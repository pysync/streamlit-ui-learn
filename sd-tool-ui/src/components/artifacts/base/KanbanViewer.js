import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { 
  Box, 
  Paper, 
  Typography, 
  IconButton, 
  Tooltip,
  Button,
  Card,
  CardContent,
  CardActions,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Menu,
  MenuItem
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import TabHeader from '../../shared/TabHeader';
import SplitView from '../../shared/SplitView';
import RelatedItemsPanel from '../../shared/RelatedItemsPanel';
import { useWorkspace } from '../../../contexts/WorkspaceContext';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Sortable item component
const SortableItem = ({ id, item, onEdit, onMenuOpen }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    marginBottom: '8px'
  };

  return (
    <Card 
      ref={setNodeRef} 
      style={style} 
      sx={{ mb: 1 }}
      {...attributes}
      {...listeners}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Typography variant="h6" component="div">
            {item.title}
          </Typography>
          <IconButton size="small" onClick={(e) => onMenuOpen(e, item)}>
            <MoreVertIcon />
          </IconButton>
        </Box>
        
        {item.description && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {item.description}
          </Typography>
        )}
        
        {item.tags && item.tags.length > 0 && (
          <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {item.tags.map((tag, idx) => (
              <Chip key={idx} label={tag} size="small" />
            ))}
          </Box>
        )}
        
        {item.assignee && (
          <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              Assigned to: {item.assignee}
            </Typography>
            {item.priority && (
              <Chip 
                label={item.priority} 
                size="small"
                color={
                  item.priority === 'High' ? 'error' :
                  item.priority === 'Medium' ? 'warning' :
                  'success'
                }
              />
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

// Column component
const Column = ({ column, items, isEditing, onAddItem, onEditItem, onItemMenuOpen }) => {
  return (
    <Paper sx={{ 
      width: 280, 
      minWidth: 280,
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      mr: 2
    }}>
      <Box sx={{ 
        p: 1, 
        backgroundColor: 'primary.light', 
        color: 'primary.contrastText',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography variant="subtitle1" fontWeight="bold">
          {column.title} ({items.length})
        </Typography>
        {isEditing && (
          <IconButton 
            size="small" 
            onClick={() => onAddItem(column.id)}
            sx={{ color: 'inherit' }}
          >
            <AddIcon fontSize="small" />
          </IconButton>
        )}
      </Box>
      
      <Box sx={{ p: 1, flexGrow: 1, overflow: 'auto' }}>
        <SortableContext 
          items={items.map(item => item.id)} 
          strategy={verticalListSortingStrategy}
        >
          {items.map(item => (
            <SortableItem 
              key={item.id} 
              id={item.id} 
              item={item} 
              onEdit={() => onEditItem(item)}
              onMenuOpen={(e) => onItemMenuOpen(e, item)}
            />
          ))}
        </SortableContext>
      </Box>
    </Paper>
  );
};

/**
 * Generic Kanban board viewer for board-style artifacts
 */
const KanbanViewer = ({
  artifact,
  visualization,
  visualizations = [],
  isEditable = true,
  onContentUpdate,
  onVisualizationChange,
  layoutMode = 'single'
}) => {
  const { navigateToArtifact } = useWorkspace();
  const [isEditing, setIsEditing] = useState(false);
  const [columns, setColumns] = useState([]);
  const [items, setItems] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [currentColumn, setCurrentColumn] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [activeId, setActiveId] = useState(null);
  
  // Set up DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Parse artifact content and initialize data
  useEffect(() => {
    if (artifact) {
      let parsedColumns = [];
      let parsedItems = [];
      
      // Handle different content formats
      if (typeof artifact.content === 'string') {
        try {
          // Try to parse as JSON
          const parsed = JSON.parse(artifact.content);
          if (parsed.columns && Array.isArray(parsed.columns)) {
            parsedColumns = parsed.columns;
          }
          if (parsed.items && Array.isArray(parsed.items)) {
            parsedItems = parsed.items;
          }
        } catch (e) {
          console.warn('Failed to parse artifact content as JSON:', e);
          // If not JSON, create default columns
          parsedColumns = [
            { id: 'todo', title: 'To Do' },
            { id: 'inprogress', title: 'In Progress' },
            { id: 'done', title: 'Done' }
          ];
        }
      } else if (artifact.content) {
        // Already parsed object
        if (artifact.content.columns && Array.isArray(artifact.content.columns)) {
          parsedColumns = artifact.content.columns;
        }
        if (artifact.content.items && Array.isArray(artifact.content.items)) {
          parsedItems = artifact.content.items;
        }
      }
      
      // If no columns, create default
      if (parsedColumns.length === 0) {
        parsedColumns = [
          { id: 'todo', title: 'To Do' },
          { id: 'inprogress', title: 'In Progress' },
          { id: 'done', title: 'Done' }
        ];
      }
      
      setColumns(parsedColumns);
      setItems(parsedItems);
    }
  }, [artifact]);
  
  // Toggle edit mode
  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };
  
  // Handle save
  const handleSave = () => {
    if (!artifact) return;
    
    const updatedContent = {
      columns,
      items
    };
    
    onContentUpdate(updatedContent);
    setIsEditing(false);
  };
  
  // Add new item
  const handleAddItem = (columnId) => {
    setCurrentColumn(columnId);
    setEditItem({
      id: `item-${Date.now()}`,
      title: '',
      description: '',
      columnId: columnId,
      tags: [],
      assignee: '',
      priority: 'Medium'
    });
    setDialogOpen(true);
  };
  
  // Edit item
  const handleEditItem = (item) => {
    setEditItem({ ...item });
    setCurrentColumn(item.columnId);
    setDialogOpen(true);
  };
  
  // Save item
  const handleSaveItem = () => {
    if (!editItem) return;
    
    if (editItem.id) {
      // Update existing item
      setItems(items.map(item => 
        item.id === editItem.id ? { ...editItem } : item
      ));
    } else {
      // Add new item
      setItems([...items, { ...editItem, id: `item-${Date.now()}` }]);
    }
    
    setDialogOpen(false);
    setEditItem(null);
  };
  
  // Delete item
  const handleDeleteItem = (itemId) => {
    setItems(items.filter(item => item.id !== itemId));
    setMenuAnchor(null);
  };
  
  // Open item menu
  const handleItemMenuOpen = (event, item) => {
    setMenuAnchor(event.currentTarget);
    setSelectedItem(item);
  };
  
  // Close item menu
  const handleItemMenuClose = () => {
    setMenuAnchor(null);
    setSelectedItem(null);
  };
  
  // Handle drag end
  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (active.id !== over?.id) {
      setItems(items => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        
        return arrayMove(items, oldIndex, newIndex);
      });
    }
    
    setActiveId(null);
  };
  
  // Get items for a specific column
  const getColumnItems = (columnId) => {
    return items.filter(item => item.columnId === columnId);
  };
  
  // Related items panel for secondary content
  const secondaryContent = artifact?.references?.length > 0 ? (
    <RelatedItemsPanel 
      title="Related Items"
      items={artifact.references}
      onItemClick={(item) => navigateToArtifact(item.id)}
    />
  ) : null;

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <TabHeader
        title={artifact?.title || 'Kanban Board'}
        actions={
          <>
            {isEditable && (
              <Tooltip title={isEditing ? "Save" : "Edit"}>
                <IconButton onClick={isEditing ? handleSave : toggleEditMode}>
                  {isEditing ? <SaveIcon /> : <EditIcon />}
                </IconButton>
              </Tooltip>
            )}
            {!isEditing && (
              <Tooltip title="View">
                <IconButton>
                  <VisibilityIcon />
                </IconButton>
              </Tooltip>
            )}
          </>
        }
      />
      
      <SplitView
        direction={layoutMode === 'horizontal' ? 'horizontal' : 'vertical'}
        primaryContent={
          <Box sx={{ 
            p: 2, 
            height: '100%', 
            display: 'flex',
            flexDirection: 'column'
          }}>
            
          </Box>
        }
        secondaryContent={secondaryContent}
        showSecondary={layoutMode !== 'single' && !!secondaryContent}
      />
    </Box>
  );
};

KanbanViewer.propTypes = {
  artifact: PropTypes.shape({
    id: PropTypes.string,
    document_id: PropTypes.string.isRequired,
    art_type: PropTypes.string.isRequired,
    title: PropTypes.string,
    content: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    references: PropTypes.array,
    version: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    status: PropTypes.string,
    updated_at: PropTypes.string
  }).isRequired,
  visualization: PropTypes.object,
  visualizations: PropTypes.array,
  isEditable: PropTypes.bool,
  onContentUpdate: PropTypes.func,
  onVisualizationChange: PropTypes.func,
  layoutMode: PropTypes.string
};

export default KanbanViewer; 