import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { 
  Box, 
  Paper, 
  Typography, 
  Tabs, 
  Tab, 
  IconButton, 
  Tooltip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';
import MarkdownEditor from '../../common/MarkdownEditor';
import MarkdownViewer from '../../common/MarkdownViewer';
import TabHeader from '../../shared/TabHeader';
import SplitView from '../../shared/SplitView';
import RelatedItemsPanel from '../../shared/RelatedItemsPanel';
import { useWorkspace } from '../../../contexts/WorkspaceContext';
import { DataGrid } from '@mui/x-data-grid';
import { ARTIFACT_SCHEMAS } from '../../../constants/artifactSchemas';
import { ARTIFACT_TYPES } from '../../../constants/sdlcConstants';

/**
 * Specialized viewer for requirements artifacts (business and functional)
 */
const RequirementsViewer = ({
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
  const [sections, setSections] = useState([]);
  const [activeSection, setActiveSection] = useState(null);
  const [content, setContent] = useState({});
  const [requirements, setRequirements] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editRequirement, setEditRequirement] = useState(null);
  
  // Get the appropriate schema based on artifact type
  const schema = artifact?.art_type === ARTIFACT_TYPES.BUSINESS_REQUIREMENTS 
    ? ARTIFACT_SCHEMAS[ARTIFACT_TYPES.BUSINESS_REQUIREMENTS]
    : ARTIFACT_SCHEMAS[ARTIFACT_TYPES.FUNCTIONAL_REQUIREMENTS];
  
  // Parse artifact content and initialize data
  useEffect(() => {
    if (artifact) {
      let parsedSections = [];
      let parsedRequirements = [];
      
      // Handle different content formats
      if (typeof artifact.content === 'string') {
        try {
          // Try to parse as JSON
          const parsed = JSON.parse(artifact.content);
          if (parsed.sections && Array.isArray(parsed.sections)) {
            parsedSections = parsed.sections;
          }
          if (parsed.requirements && Array.isArray(parsed.requirements)) {
            parsedRequirements = parsed.requirements;
          }
        } catch (e) {
          console.warn('Failed to parse artifact content as JSON:', e);
          // If not JSON, create a single section with the content
          parsedSections = [
            { id: 'content', label: 'Content', content: artifact.content }
          ];
        }
      } else if (artifact.content) {
        // Already parsed object
        if (artifact.content.sections && Array.isArray(artifact.content.sections)) {
          parsedSections = artifact.content.sections;
        }
        if (artifact.content.requirements && Array.isArray(artifact.content.requirements)) {
          parsedRequirements = artifact.content.requirements;
        }
      }
      
      // If no sections, use default from schema
      if (parsedSections.length === 0 && schema?.default?.sections) {
        parsedSections = schema.default.sections;
      }
      
      setSections(parsedSections);
      
      // Create content object from sections
      const contentObj = {};
      parsedSections.forEach(section => {
        contentObj[section.id] = section.content;
      });
      setContent(contentObj);
      
      // Set active section to first section if not already set
      if ((!activeSection || !parsedSections.find(s => s.id === activeSection)) && parsedSections.length > 0) {
        setActiveSection(parsedSections[0].id);
      }
      
      setRequirements(parsedRequirements);
    }
  }, [artifact, schema]);
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  // Handle section change
  const handleSectionChange = (event, newValue) => {
    setActiveSection(newValue);
  };
  
  // Toggle edit mode
  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };
  
  // Handle content change in editor
  const handleContentChange = (sectionId, newContent) => {
    setContent(prevContent => ({
      ...prevContent,
      [sectionId]: newContent
    }));
  };
  
  // Handle add requirement
  const handleAddRequirement = () => {
    const newId = `REQ-${requirements.length + 1}`;
    setEditRequirement({
      id: newId,
      title: '',
      description: '',
      priority: 'medium',
      status: 'proposed',
      category: ''
    });
    setDialogOpen(true);
  };
  
  // Handle edit requirement
  const handleEditRequirement = (requirement) => {
    setEditRequirement({ ...requirement });
    setDialogOpen(true);
  };
  
  // Handle save requirement
  const handleSaveRequirement = () => {
    if (!editRequirement) return;
    
    const isNew = !requirements.find(r => r.id === editRequirement.id);
    
    if (isNew) {
      setRequirements([...requirements, editRequirement]);
    } else {
      setRequirements(requirements.map(r => r.id === editRequirement.id ? editRequirement : r));
    }
    
    setDialogOpen(false);
    setEditRequirement(null);
  };
  
  // Handle delete requirement
  const handleDeleteRequirement = (reqId) => {
    setRequirements(requirements.filter(r => r.id !== reqId));
  };
  
  // Save changes
  const handleSave = () => {
    // Update sections with new content
    const updatedSections = sections.map(section => ({
      ...section,
      content: content[section.id] || ''
    }));
    
    if (onContentUpdate) {
      onContentUpdate({
        sections: updatedSections,
        requirements
      });
    }
    
    setIsEditing(false);
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
  
  // Requirement columns for table view
  const requirementColumns = [
    { field: 'id', headerName: 'ID', width: 120 },
    { field: 'title', headerName: 'Title', flex: 1 },
    { 
      field: 'priority', 
      headerName: 'Priority', 
      width: 120,
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          color={
            params.value === 'high' ? 'error' : 
            params.value === 'medium' ? 'warning' : 
            'success'
          }
          size="small"
        />
      )
    },
    { 
      field: 'status', 
      headerName: 'Status', 
      width: 120 
    },
    { 
      field: 'category', 
      headerName: 'Category', 
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
              <IconButton size="small" onClick={() => handleEditRequirement(params.row)}>
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" onClick={() => handleDeleteRequirement(params.row.id)}>
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
        title={artifact?.title || 'Untitled Requirements'}
        status={artifact?.status}
        lastModified={artifact?.updated_at}
        actions={headerActions}
      />
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Document" />
          <Tab label="Requirements List" />
        </Tabs>
      </Box>
      
      <SplitView
        direction={layoutMode === 'horizontal' ? 'horizontal' : 'vertical'}
        primaryContent={
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Document view */}
            {activeTab === 0 && (
              <Box sx={{ display: 'flex', height: '100%' }}>
                {/* Section tabs */}
                <Box sx={{ width: '200px', borderRight: '1px solid rgba(0, 0, 0, 0.12)' }}>
                  <Tabs
                    orientation="vertical"
                    variant="scrollable"
                    value={activeSection}
                    onChange={handleSectionChange}
                    sx={{ borderRight: 1, borderColor: 'divider' }}
                  >
                  </Tabs>
                </Box>
              </Box>
            )}
            
            {/* Requirements list view */}
            {activeTab === 1 && (
              <Box sx={{ height: '100%', p: 1 }}>
                {isEditing && (
                  <Box sx={{ mb: 2 }}>
                    <Button
                      variant="outlined"
                      startIcon={<AddIcon />}
                      onClick={handleAddRequirement}
                    >
                      Add Requirement
                    </Button>
                  </Box>
                )}
                
                <DataGrid
                  rows={requirements}
                  columns={requirementColumns}
                  pageSize={10}
                  rowsPerPageOptions={[10, 25, 50]}
                  disableSelectionOnClick
                  autoHeight
                  sx={{ height: '100%' }}
                />
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
          {editRequirement && requirements.find(r => r.id === editRequirement.id) 
            ? 'Edit Requirement' 
            : 'Add Requirement'
          }
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1, minWidth: '400px' }}>
            <TextField
              label="Title"
              value={editRequirement?.title || ''}
              onChange={(e) => setEditRequirement({ ...editRequirement, title: e.target.value })}
              fullWidth
              required
            />
            
            <TextField
              label="Description"
              value={editRequirement?.description || ''}
              onChange={(e) => setEditRequirement({ ...editRequirement, description: e.target.value })}
              fullWidth
              multiline
              rows={3}
            />
            
            <TextField
              label="Priority"
              value={editRequirement?.priority || ''}
              onChange={(e) => setEditRequirement({ ...editRequirement, priority: e.target.value })}
              fullWidth
            />
            
            <TextField
              label="Status"
              value={editRequirement?.status || ''}
              onChange={(e) => setEditRequirement({ ...editRequirement, status: e.target.value })}
              fullWidth
            />
            
            <TextField
              label="Category"
              value={editRequirement?.category || ''}
              onChange={(e) => setEditRequirement({ ...editRequirement, category: e.target.value })}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleSaveRequirement} 
            variant="contained"
            disabled={!editRequirement?.title}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

RequirementsViewer.propTypes = {
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

export default RequirementsViewer; 