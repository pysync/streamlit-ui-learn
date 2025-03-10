import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { 
  Box, Paper, Tabs, Tab, Divider, IconButton, Tooltip, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle,
  FormControl, InputLabel, Select, MenuItem, Typography
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PrintIcon from '@mui/icons-material/Print';
import DownloadIcon from '@mui/icons-material/Download';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import TabHeader from '../shared/TabHeader';
import ViewSelector from '../shared/ViewSelector';
import SplitView from '../shared/SplitView';
import RelatedItemsPanel from '../shared/RelatedItemsPanel';
import MarkdownEditor from '../shared/MarkdownEditor';
import MDEditor from '@uiw/react-md-editor';
import { useWorkspace } from '../../contexts/WorkspaceContext';
import { useWorkspaceLayout } from '../../contexts/WorkspaceLayoutContext';

// Import constants directly instead of importing the whole file
const VISUALIZATION_TYPES = {
  DOCUMENT: 'document',
  TABLE: 'table',
  DIAGRAM: 'diagram',
  CHART: 'chart',
  KANBAN: 'kanban',
  TIMELINE: 'timeline'
};

const INITIAL_SECTIONS = [
  { id: 'overview', label: 'Overview', content: '# Overview\n\nProvide a high-level overview of the functionality.' },
  { id: 'requirements', label: 'Requirements', content: '# Requirements\n\n## Functional Requirements\n\n- Requirement 1\n- Requirement 2\n\n## Non-Functional Requirements\n\n- Performance\n- Security' },
  { id: 'design', label: 'Design', content: '# Design\n\nDescribe the design approach for implementing this functionality.' },
  { id: 'interfaces', label: 'Interfaces', content: '# Interfaces\n\n## User Interfaces\n\n## API Interfaces' },
  { id: 'data', label: 'Data Models', content: '# Data Models\n\nDescribe key data structures and relationships.' }
];

// Sample initial functions for the table view
const INITIAL_FUNCTIONS = [
  { id: 'F001', module: 'Authentication', name: 'User Login', screen: 'Login Screen', detail: 'Allow users to log in with username and password' },
  { id: 'F002', module: 'Authentication', name: 'User Registration', screen: 'Registration Screen', detail: 'Allow new users to create an account' },
  { id: 'F003', module: 'Dashboard', name: 'View Statistics', screen: 'Dashboard', detail: 'Display key metrics and statistics' }
];

/**
 * Specialized viewer for Functional Specification artifacts
 */
const FunctionalSpecViewer = ({
  artifact,
  activeVisualization,
  visualizations,
  isEditable = false,
  onContentUpdate,
  onVisualizationChange
}) => {
  // Get layoutMode from context instead of props
  const { layoutMode } = useWorkspaceLayout();
  const { navigateToArtifact } = useWorkspace();
  const [isEditing, setIsEditing] = useState(false);
  const [sections, setSections] = useState(INITIAL_SECTIONS);
  const [activeSection, setActiveSection] = useState('overview');
  const [content, setContent] = useState({});
  const [functions, setFunctions] = useState(INITIAL_FUNCTIONS);
  const [functionDialogOpen, setFunctionDialogOpen] = useState(false);
  const [currentFunction, setCurrentFunction] = useState(null);
  const [viewMode, setViewMode] = useState('document'); // 'document' or 'table'

  // Debug logging
  useEffect(() => {
    console.log(`✨ FunctionalSpecViewer mounted for ${artifact?.document_id}`, {
      type: artifact?.art_type,
      sections: Object.keys(artifact?.content || {}),
      layoutMode,
      activeVisualization,
      viewMode
    });
  }, [artifact?.document_id, layoutMode, activeVisualization, viewMode]);
  
  // Set view mode based on active visualization
  useEffect(() => {
    if (activeVisualization) {
      console.log('Active visualization changed:', activeVisualization);
      if (activeVisualization.type === VISUALIZATION_TYPES.TABLE) {
        setViewMode('table');
      } else {
        setViewMode('document');
      }
    }
  }, [activeVisualization]);

  // Initialize content from artifact
  useEffect(() => {
    if (!artifact) return;
    
    console.log('Initializing content from artifact:', artifact);
    
    // Initialize with default sections
    const initialContent = {};
    INITIAL_SECTIONS.forEach(section => {
      initialContent[section.id] = section.content;
    });
    
    if (artifact?.content) {
      try {
        let parsedContent;
        
        if (typeof artifact.content === 'object') {
          parsedContent = artifact.content;
        } else {
          parsedContent = JSON.parse(artifact.content);
        }
        
        if (parsedContent.sections) {
          setSections(parsedContent.sections);
        }
        
        if (parsedContent.sectionContent) {
          setContent({...initialContent, ...parsedContent.sectionContent});
        } else {
          setContent(initialContent);
        }
        
        if (parsedContent.functions) {
          setFunctions(parsedContent.functions);
        }
      } catch (e) {
        console.error('Failed to parse artifact content:', e);
        setContent(initialContent);
      }
    } else {
      setContent(initialContent);
    }
  }, [artifact?.document_id]);

  // Get current section content
  const currentSection = sections.find(s => s.id === activeSection);
  const currentContent = content[activeSection] || currentSection?.content || '';

  // Handle content change from editor
  const handleContentChange = (newContent) => {
    setContent({
      ...content,
      [activeSection]: newContent
    });
  };

  // Handle save
  const handleSave = () => {
    if (onContentUpdate) {
      const updatedContent = {
        sections: sections,
        sectionContent: content,
        functions: functions
      };
      
      onContentUpdate(updatedContent);
      setIsEditing(false);
    }
  };

  // Handle function dialog open
  const handleOpenFunctionDialog = (func = null) => {
    if (func) {
      setCurrentFunction(func);
    } else {
      // Generate a new ID for the function
      const newId = `F${String(functions.length + 1).padStart(3, '0')}`;
      setCurrentFunction({ id: newId, module: '', name: '', screen: '', detail: '' });
    }
    setFunctionDialogOpen(true);
  };

  // Handle function save
  const handleSaveFunction = () => {
    if (!currentFunction) return;
    
    if (currentFunction.id) {
      // Update existing function
      const existingIndex = functions.findIndex(f => f.id === currentFunction.id);
      if (existingIndex >= 0) {
        const updatedFunctions = [...functions];
        updatedFunctions[existingIndex] = currentFunction;
        setFunctions(updatedFunctions);
      } else {
        // Add new function
        setFunctions([...functions, currentFunction]);
      }
    }
    
    setFunctionDialogOpen(false);
    setCurrentFunction(null);
  };

  // Handle function delete
  const handleDeleteFunction = (id) => {
    setFunctions(functions.filter(f => f.id !== id));
  };

  // Prepare header actions
  const headerActions = [
    {
      id: 'edit',
      label: isEditing ? 'View' : 'Edit',
      icon: isEditing ? <VisibilityIcon /> : <EditIcon />,
      onClick: () => setIsEditing(!isEditing),
      disabled: false
    },
    {
      id: 'save',
      label: 'Save',
      icon: <SaveIcon />,
      onClick: handleSave,
      disabled: !isEditing
    },
    {
      id: 'print',
      label: 'Print',
      icon: <PrintIcon />,
      onClick: () => window.print()
    },
    {
      id: 'download',
      label: 'Download',
      icon: <DownloadIcon />,
      onClick: () => {
        // Implementation would depend on your download strategy
        console.log('Download', artifact?.title);
      }
    }
  ];

  // Secondary content for split view
  const secondaryContent = (
    <RelatedItemsPanel
      references={artifact?.references || []}
      onArtifactClick={navigateToArtifact}
      editable={isEditable}
    />
  );

  // Handle visualization change
  const handleVisualizationChange = (viz) => {
    console.log('Visualization changed to:', viz);
    if (onVisualizationChange) {
      onVisualizationChange(viz);
    }
  };

  // Create visualization selector component
  const visualizationSelector = visualizations && visualizations.length > 0 ? (
    <ViewSelector
      visualizations={visualizations}
      activeVisualization={activeVisualization}
      onChange={handleVisualizationChange}
      size="small" // Make it more compact for the header
    />
  ) : null;

  // Render document view
  const renderDocumentView = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={activeSection}
          onChange={(_, newValue) => setActiveSection(newValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
          {sections.map(section => (
            <Tab 
              key={section.id}
              label={section.label} 
              value={section.id}
            />
          ))}
        </Tabs>
      </Box>
      
      <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
        {isEditing ? (
          <MarkdownEditor
            noteTitle={currentSection?.label}
            markdownContent={currentContent}
            onContentChange={handleContentChange}
            onTitleChange={(newTitle) => {
              setSections(sections.map(section => 
                section.id === activeSection 
                  ? { ...section, label: newTitle } 
                  : section
              ));
            }}
            onSave={handleSave}
            artifactId={artifact?.id}
          />
        ) : (
          <Box data-color-mode="light" className="markdown-renderer">
            <MDEditor.Markdown source={currentContent} />
          </Box>
        )}
      </Box>
    </Box>
  );

  // Render table view
  const renderTableView = () => (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 2 }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Functional Requirements</Typography>
        {isEditing && (
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={() => handleOpenFunctionDialog()}
          >
            Add Function
          </Button>
        )}
      </Box>
      
      <TableContainer component={Paper} sx={{ flex: 1, overflow: 'auto' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Module</TableCell>
              <TableCell>Function Name</TableCell>
              <TableCell>Screen</TableCell>
              <TableCell>Detail</TableCell>
              {isEditing && <TableCell>Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {functions.map((func) => (
              <TableRow key={func.id}>
                <TableCell>{func.id}</TableCell>
                <TableCell>{func.module}</TableCell>
                <TableCell>{func.name}</TableCell>
                <TableCell>{func.screen}</TableCell>
                <TableCell>{func.detail}</TableCell>
                {isEditing && (
                  <TableCell>
                    <IconButton size="small" onClick={() => handleOpenFunctionDialog(func)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDeleteFunction(func.id)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* Function Edit Dialog */}
      <Dialog open={functionDialogOpen} onClose={() => setFunctionDialogOpen(false)}>
        <DialogTitle>
          {currentFunction?.id ? `Edit Function ${currentFunction.id}` : 'Add New Function'}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="ID"
            fullWidth
            value={currentFunction?.id || ''}
            onChange={(e) => setCurrentFunction({...currentFunction, id: e.target.value})}
            disabled={!!currentFunction?.id} // Disable editing ID for existing functions
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Module</InputLabel>
            <Select
              value={currentFunction?.module || ''}
              onChange={(e) => setCurrentFunction({...currentFunction, module: e.target.value})}
            >
              <MenuItem value="Authentication">Authentication</MenuItem>
              <MenuItem value="Dashboard">Dashboard</MenuItem>
              <MenuItem value="User Management">User Management</MenuItem>
              <MenuItem value="Reporting">Reporting</MenuItem>
              <MenuItem value="Settings">Settings</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Function Name"
            fullWidth
            value={currentFunction?.name || ''}
            onChange={(e) => setCurrentFunction({...currentFunction, name: e.target.value})}
          />
          <TextField
            margin="dense"
            label="Screen"
            fullWidth
            value={currentFunction?.screen || ''}
            onChange={(e) => setCurrentFunction({...currentFunction, screen: e.target.value})}
          />
          <TextField
            margin="dense"
            label="Detail"
            fullWidth
            multiline
            rows={4}
            value={currentFunction?.detail || ''}
            onChange={(e) => setCurrentFunction({...currentFunction, detail: e.target.value})}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFunctionDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveFunction} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );

  // Debug which view is being rendered
  console.log('Rendering view mode:', viewMode);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <TabHeader
        title={artifact?.title || 'Functional Specification'}
        status={artifact?.status}
        lastModified={artifact?.lastModified}
        actions={headerActions}
        visualizationSelector={visualizationSelector}
      />
      
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        {viewMode === 'document' ? renderDocumentView() : renderTableView()}
      </Box>
    </Box>
  );
};

FunctionalSpecViewer.propTypes = {
  artifact: PropTypes.shape({
    id: PropTypes.string,
    document_id: PropTypes.string.isRequired,
    art_type: PropTypes.string.isRequired,
    title: PropTypes.string,
    content: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    references: PropTypes.array,
    version: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    status: PropTypes.string,
    lastModified: PropTypes.string
  }).isRequired,
  activeVisualization: PropTypes.object,
  visualizations: PropTypes.array,
  isEditable: PropTypes.bool,
  onVisualizationChange: PropTypes.func,
  onContentUpdate: PropTypes.func
};

export default FunctionalSpecViewer; 