import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { 
  Box, 
  Paper, 
  Typography, 
  IconButton, 
  Tooltip,
  Button,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import TodayIcon from '@mui/icons-material/Today';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import TabHeader from '../../shared/TabHeader';
import SplitView from '../../shared/SplitView';
import RelatedItemsPanel from '../../shared/RelatedItemsPanel';
import { useWorkspace } from '../../../contexts/WorkspaceContext';
import { DataGrid } from '@mui/x-data-grid';
import DatePickerWrapper from '../../common/DatePickerWrapper';

/**
 * Generic Gantt chart viewer for project plans and timeline-based artifacts
 */
const GanttViewer = ({
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
  const [activeTab, setActiveTab] = useState(0);
  const [tasks, setTasks] = useState([]);
  const [resources, setResources] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [viewDate, setViewDate] = useState(new Date());
  
  // Parse artifact content and initialize gantt data
  useEffect(() => {
    if (artifact) {
      let parsedTasks = [];
      let parsedResources = [];
      
      // Handle different content formats
      if (typeof artifact.content === 'string') {
        try {
          // Try to parse as JSON
          const parsed = JSON.parse(artifact.content);
          if (parsed.tasks && Array.isArray(parsed.tasks)) {
            parsedTasks = parsed.tasks;
          }
          if (parsed.resources && Array.isArray(parsed.resources)) {
            parsedResources = parsed.resources;
          }
        } catch (e) {
          console.warn('Failed to parse artifact content as JSON:', e);
        }
      } else if (artifact.content) {
        // Already parsed object
        if (artifact.content.tasks && Array.isArray(artifact.content.tasks)) {
          parsedTasks = artifact.content.tasks;
        }
        if (artifact.content.resources && Array.isArray(artifact.content.resources)) {
          parsedResources = artifact.content.resources;
        }
      }
      
      // Ensure tasks have proper date objects
      parsedTasks = parsedTasks.map(task => ({
        ...task,
        startDate: task.startDate ? new Date(task.startDate) : null,
        endDate: task.endDate ? new Date(task.endDate) : null
      }));
      
      setTasks(parsedTasks);
      setResources(parsedResources);
    }
  }, [artifact]);
  
  // Toggle edit mode
  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };
  
  // Handle save
  const handleSave = () => {
    if (onContentUpdate) {
      onContentUpdate({
        tasks,
        resources
      });
    }
    setIsEditing(false);
  };
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  // Handle add task
  const handleAddTask = () => {
    setEditTask({
      id: Date.now().toString(),
      title: '',
      description: '',
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // One week later
      progress: 0,
      dependencies: [],
      assignee: ''
    });
    setDialogOpen(true);
  };
  
  // Handle edit task
  const handleEditTask = (task) => {
    setEditTask({ ...task });
    setDialogOpen(true);
  };
  
  // Handle save task
  const handleSaveTask = () => {
    if (!editTask) return;
    
    const isNew = !tasks.find(t => t.id === editTask.id);
    
    if (isNew) {
      setTasks([...tasks, editTask]);
    } else {
      setTasks(tasks.map(t => t.id === editTask.id ? editTask : t));
    }
    
    setDialogOpen(false);
    setEditTask(null);
  };
  
  // Handle delete task
  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter(t => t.id !== taskId));
  };
  
  // Handle zoom in
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.1, 2));
  };
  
  // Handle zoom out
  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.1, 0.5));
  };
  
  // Handle today
  const handleToday = () => {
    setViewDate(new Date());
  };
  
  // Handle previous period
  const handlePrevPeriod = () => {
    const newDate = new Date(viewDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setViewDate(newDate);
  };
  
  // Handle next period
  const handleNextPeriod = () => {
    const newDate = new Date(viewDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setViewDate(newDate);
  };
  
  // Related items panel
  const secondaryContent = artifact?.references?.length > 0 && (
    <RelatedItemsPanel
      title="Related Items"
      items={artifact.references.map(ref => ({
        id: ref.document_id,
        title: ref.title || ref.document_id,
        type: ref.art_type,
        onClick: () => navigateToArtifact(ref)
      }))}
    />
  );
  
  // Header actions
  const headerActions = [
    <Tooltip key="edit-toggle" title={isEditing ? "View Mode" : "Edit Mode"}>
      <IconButton onClick={toggleEditMode}>
        {isEditing ? <VisibilityIcon /> : <EditIcon />}
      </IconButton>
    </Tooltip>
  ];
  
  if (isEditing) {
    headerActions.push(
      <Tooltip key="save" title="Save Changes">
        <IconButton onClick={handleSave}>
          <SaveIcon />
        </IconButton>
      </Tooltip>
    );
  }
  
  // Task columns for table view
  const taskColumns = [
    { field: 'title', headerName: 'Task', flex: 1 },
    { 
      field: 'startDate', 
      headerName: 'Start Date', 
      width: 120,
      valueFormatter: (params) => params.value ? params.value.toLocaleDateString() : 'N/A'
    },
    { 
      field: 'endDate', 
      headerName: 'End Date', 
      width: 120,
      valueFormatter: (params) => params.value ? params.value.toLocaleDateString() : 'N/A'
    },
    { 
      field: 'progress', 
      headerName: 'Progress', 
      width: 120,
      valueFormatter: (params) => `${params.value || 0}%`
    },
    { 
      field: 'assignee', 
      headerName: 'Assignee', 
      width: 150 
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Box>
          {isEditing && (
            <>
              <IconButton size="small" onClick={() => handleEditTask(params.row)}>
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" onClick={() => handleDeleteTask(params.row.id)}>
                <EditIcon fontSize="small" />
              </IconButton>
            </>
          )}
        </Box>
      )
    }
  ];
  
  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <TabHeader
        title={artifact?.title || 'Untitled Project Plan'}
        status={artifact?.status}
        lastModified={artifact?.updated_at}
        actions={headerActions}
      />
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Tasks" />
          <Tab label="Gantt Chart" />
          <Tab label="Timeline" />
          <Tab label="Resources" />
        </Tabs>
      </Box>
      
      <SplitView
        direction={layoutMode === 'horizontal' ? 'horizontal' : 'vertical'}
        primaryContent={
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Task list view */}
            {activeTab === 0 && (
              <Box sx={{ height: '100%', p: 1 }}>
                {isEditing && (
                  <Box sx={{ mb: 2 }}>
                    <Button
                      variant="outlined"
                      startIcon={<AddIcon />}
                      onClick={handleAddTask}
                    >
                      Add Task
                    </Button>
                  </Box>
                )}
                
                <DataGrid
                  rows={tasks}
                  columns={taskColumns}
                  pageSize={10}
                  rowsPerPageOptions={[10, 25, 50]}
                  disableSelectionOnClick
                  autoHeight
                  sx={{ height: '100%' }}
                />
              </Box>
            )}
            
            {/* Gantt chart view */}
            {activeTab === 1 && (
              <Box sx={{ height: '100%', p: 1 }}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  mb: 2,
                  borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
                  pb: 1
                }}>
                  <Box>
                    <IconButton onClick={handlePrevPeriod}>
                      <KeyboardArrowLeftIcon />
                    </IconButton>
                    <IconButton onClick={handleToday}>
                      <TodayIcon />
                    </IconButton>
                    <IconButton onClick={handleNextPeriod}>
                      <KeyboardArrowRightIcon />
                    </IconButton>
                  </Box>
                  
                  <Typography variant="subtitle1">
                    {viewDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                  </Typography>
                  
                  <Box>
                    <IconButton onClick={handleZoomOut}>
                      <ZoomOutIcon />
                    </IconButton>
                    <IconButton onClick={handleZoomIn}>
                      <ZoomInIcon />
                    </IconButton>
                  </Box>
                </Box>
                
                <Box sx={{ 
                  height: 'calc(100% - 50px)', 
                  border: '1px solid rgba(0, 0, 0, 0.12)',
                  p: 2,
                  position: 'relative'
                }}>
                  {/* This would be replaced with an actual Gantt chart component */}
                  <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center' }}>
                    Gantt Chart Placeholder - Would integrate with a Gantt chart library
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    {tasks.map(task => (
                      <Box key={task.id} sx={{ mb: 2, p: 1, border: '1px solid #ccc', borderRadius: 1 }}>
                        <Typography variant="subtitle1">{task.title}</Typography>
                        <Typography variant="body2">
                          {task.startDate?.toLocaleDateString()} - {task.endDate?.toLocaleDateString()}
                        </Typography>
                        <Box sx={{ 
                          mt: 1, 
                          height: 10, 
                          bgcolor: '#eee', 
                          borderRadius: 5,
                          overflow: 'hidden'
                        }}>
                          <Box sx={{ 
                            height: '100%', 
                            width: `${task.progress || 0}%`, 
                            bgcolor: 'primary.main' 
                          }} />
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>
            )}
            
            {/* Timeline view */}
            {activeTab === 2 && (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary">
                  Timeline View (Implementation Placeholder)
                </Typography>
              </Box>
            )}
            
            {/* Resources view */}
            {activeTab === 3 && (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary">
                  Resources View (Implementation Placeholder)
                </Typography>
              </Box>
            )}
          </Box>
        }
        secondaryContent={secondaryContent}
        showSecondary={layoutMode !== 'single' && !!secondaryContent}
      />
      
      {/* Task edit dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>
          {editTask && tasks.find(task => task.id === editTask.id) 
            ? 'Edit Task' 
            : 'Add Task'
          }
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1, minWidth: '400px' }}>
            <TextField
              label="Title"
              value={editTask?.title || ''}
              onChange={(e) => setEditTask({ ...editTask, title: e.target.value })}
              fullWidth
              required
            />
            
            <TextField
              label="Description"
              value={editTask?.description || ''}
              onChange={(e) => setEditTask({ ...editTask, description: e.target.value })}
              fullWidth
              multiline
              rows={3}
            />
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <DatePickerWrapper
                type="date"
                label="Start Date"
                value={editTask?.startDate || null}
                onChange={(newValue) => setEditTask({ ...editTask, startDate: newValue })}
              />
              
              <DatePickerWrapper
                type="date"
                label="End Date"
                value={editTask?.endDate || null}
                onChange={(newValue) => setEditTask({ ...editTask, endDate: newValue })}
              />
            </Box>
            
            <TextField
              label="Progress (%)"
              type="number"
              value={editTask?.progress || 0}
              onChange={(e) => setEditTask({ 
                ...editTask, 
                progress: Math.min(100, Math.max(0, parseInt(e.target.value) || 0)) 
              })}
              fullWidth
              InputProps={{ inputProps: { min: 0, max: 100 } }}
            />
            
            <TextField
              label="Assignee"
              value={editTask?.assignee || ''}
              onChange={(e) => setEditTask({ ...editTask, assignee: e.target.value })}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleSaveTask} 
            variant="contained"
            disabled={!editTask?.title}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

GanttViewer.propTypes = {
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

export default GanttViewer; 