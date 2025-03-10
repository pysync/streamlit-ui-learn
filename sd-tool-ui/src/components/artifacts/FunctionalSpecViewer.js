import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { 
  Box, Paper, Tabs, Tab, Divider, IconButton, Tooltip, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle,
  FormControl, InputLabel, Select, MenuItem, Typography, Chip
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
import { 
  validateFunctions, 
  parseMarkdownTableToFunctions, 
  generateFunctionsMarkdownTable 
} from '../../schemas/functionSchema';

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
  { id: 'scope', label: 'Scope', content: '# Scope\n\n## In Scope\n\n- Feature 1\n- Feature 2\n\n## Out of Scope\n\n- Feature 3\n- Feature 4' },
  { id: 'requirements', label: 'Requirements', content: '# Requirements\n\n## Functional Requirements\n\n- Requirement 1\n- Requirement 2\n\n## Non-Functional Requirements\n\n- Performance\n- Security' },
  { id: 'useCases', label: 'Use Cases', content: '# Use Cases\n\n## UC1: User Registration\n\n**Actor**: New User\n\n**Steps**:\n1. User navigates to registration page\n2. User enters details\n3. System validates information\n4. System creates account\n\n**Alternate Flows**:\n- If validation fails, show error message' },
  { id: 'userRoles', label: 'User Roles', content: '# User Roles\n\n## Admin\n\nCan manage all aspects of the system.\n\n## Regular User\n\nCan perform standard operations.' },
  { id: 'interfaces', label: 'Interfaces', content: '# Interfaces\n\n## User Interfaces\n\n- Login Screen\n- Dashboard\n\n## API Interfaces\n\n- Authentication API\n- Data Retrieval API' },
  { id: 'dataModels', label: 'Data Models', content: '# Data Models\n\nDescribe key data structures and relationships.' },
  { id: 'businessRules', label: 'Business Rules', content: '# Business Rules\n\n1. Users must verify email before accessing the system\n2. Orders over $1000 require manager approval' },
  { id: 'assumptions', label: 'Assumptions', content: '# Assumptions and Dependencies\n\n## Assumptions\n\n- Users have internet access\n- System will handle up to 1000 concurrent users\n\n## Dependencies\n\n- Payment gateway integration\n- Email service' }
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
      viewMode,
      isEditing
    });
  }, [artifact?.document_id, layoutMode, activeVisualization, viewMode, isEditing]);
  
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

  // Function to update markdown content when table data changes
  const updateMarkdownFromTable = (newFunctions) => {
    const validation = validateFunctions(newFunctions);
    if (!validation.success) {
      console.error('Invalid functions data:', validation.errors);
      return;
    }

    const markdownTable = generateFunctionsMarkdownTable(newFunctions);
    
    // Get the current requirements section content
    const currentContent = content[activeSection] || '';
    
    // Find the functions table section and replace it
    const newContent = currentContent.replace(
      /## Functions List\n\|[\s\S]*?\n\n/m, // Regex to match the existing table
      markdownTable
    );

    // If no existing table was found, append the new table
    if (newContent === currentContent) {
      setContent(prev => ({
        ...prev,
        requirements: `${currentContent}\n\n${markdownTable}`
      }));
    } else {
      setContent(prev => ({
        ...prev,
        requirements: newContent
      }));
    }
  };

  // Function to update table when markdown content changes
  const updateTableFromMarkdown = (newContent) => {
    // Only process if we're in the requirements section
    if (activeSection === 'requirements') {
      const result = parseMarkdownTableToFunctions(newContent);
      if (result.success) {
        setFunctions(result.data);
      } else {
        console.warn('Failed to parse functions from markdown:', result.error);
      }
    }
  };

  // Handle content change from editor
  const handleContentChange = (newContent) => {
    console.log('Content changed in section:', activeSection);
    setContent({
      ...content,
      [activeSection]: newContent
    });

    // Try to update table if markdown changed
    updateTableFromMarkdown(newContent);
  };

  // Handle function changes in table view
  const handleFunctionChange = (newFunctions) => {
    console.log('Functions changed in table view');
    setFunctions(newFunctions);
    updateMarkdownFromTable(newFunctions);
  };

  // Handle adding a new function
  const handleSaveFunction = () => {
    if (!currentFunction) return;
    
    let updatedFunctions;
    if (currentFunction.id) {
      // Update existing function
      updatedFunctions = functions.map(f => 
        f.id === currentFunction.id ? currentFunction : f
      );
    } else {
      // Add new function
      const newId = `F${String(functions.length + 1).padStart(3, '0')}`;
      updatedFunctions = [...functions, { ...currentFunction, id: newId }];
    }
    
    handleFunctionChange(updatedFunctions);
    setFunctionDialogOpen(false);
    setCurrentFunction(null);
  };

  // Handle deleting a function
  const handleDeleteFunction = (id) => {
    const updatedFunctions = functions.filter(f => f.id !== id);
    handleFunctionChange(updatedFunctions);
  };

  // Toggle edit mode
  const toggleEditMode = () => {
    console.log('Toggling edit mode from', isEditing, 'to', !isEditing);
    setIsEditing(!isEditing);
  };

  // Prepare content for saving
  const prepareContentForSave = () => {
    const contentToSave = {
      sections: sections,
      sectionContent: content,
      functions: functions
    };

    // Convert the content object to a string
    return JSON.stringify(contentToSave);
  };

  // Handle save action
  const handleSave = () => {
    if (onContentUpdate) {
      try {
        // Convert content to string before saving
        const stringifiedContent = prepareContentForSave();
        console.log('Saving stringified content:', stringifiedContent);
        
        onContentUpdate(stringifiedContent);
        setIsEditing(false);
      } catch (error) {
        console.error('Error preparing content for save:', error);
        // You might want to show an error message to the user here
      }
    }
  };

  // Prepare header actions
  const headerActions = [
    {
      id: 'edit',
      label: isEditing ? 'View' : 'Edit',
      icon: isEditing ? <VisibilityIcon /> : <EditIcon />,
      onClick: toggleEditMode,
      disabled: !isEditable
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
            onSave={() => {
              if (onContentUpdate) {
                
                // Convert content to string before saving
                const stringifiedContent = prepareContentForSave();
                console.log('Saving stringified content:', stringifiedContent);
                
                onContentUpdate(stringifiedContent);
                setIsEditing(false);
              }
            }}
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
    <Box sx={{ p: 2 }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
        {isEditing && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setCurrentFunction({
                module: '',
                name: '',
                screen: '',
                detail: '',
                status: 'planned',
                priority: 'medium'
              });
              setFunctionDialogOpen(true);
            }}
          >
            Add Function
          </Button>
        )}
      </Box>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Module</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Screen</TableCell>
              <TableCell>Detail</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Priority</TableCell>
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
                <TableCell>
                  <Chip 
                    label={func.status} 
                    size="small"
                    color={
                      func.status === 'completed' ? 'success' :
                      func.status === 'in-progress' ? 'primary' :
                      func.status === 'on-hold' ? 'warning' :
                      'default'
                    }
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={func.priority}
                    size="small"
                    color={
                      func.priority === 'critical' ? 'error' :
                      func.priority === 'high' ? 'warning' :
                      func.priority === 'medium' ? 'info' :
                      'default'
                    }
                  />
                </TableCell>
                {isEditing && (
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => {
                          setCurrentFunction(func);
                          setFunctionDialogOpen(true);
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteFunction(func.id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Function Edit Dialog */}
      <Dialog 
        open={functionDialogOpen} 
        onClose={() => setFunctionDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {currentFunction?.id ? `Edit Function ${currentFunction.id}` : 'Add New Function'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            {currentFunction?.id && (
              <TextField
                label="ID"
                fullWidth
                value={currentFunction?.id || ''}
                disabled
              />
            )}
            <FormControl fullWidth>
              <InputLabel>Module</InputLabel>
              <Select
                value={currentFunction?.module || ''}
                onChange={(e) => setCurrentFunction({...currentFunction, module: e.target.value})}
                label="Module"
              >
                <MenuItem value="Authentication">Authentication</MenuItem>
                <MenuItem value="Dashboard">Dashboard</MenuItem>
                <MenuItem value="User Management">User Management</MenuItem>
                <MenuItem value="Reporting">Reporting</MenuItem>
                <MenuItem value="Settings">Settings</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Function Name"
              fullWidth
              value={currentFunction?.name || ''}
              onChange={(e) => setCurrentFunction({...currentFunction, name: e.target.value})}
            />
            <TextField
              label="Screen"
              fullWidth
              value={currentFunction?.screen || ''}
              onChange={(e) => setCurrentFunction({...currentFunction, screen: e.target.value})}
            />
            <TextField
              label="Detail"
              fullWidth
              multiline
              rows={4}
              value={currentFunction?.detail || ''}
              onChange={(e) => setCurrentFunction({...currentFunction, detail: e.target.value})}
            />
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={currentFunction?.status || 'planned'}
                onChange={(e) => setCurrentFunction({...currentFunction, status: e.target.value})}
                label="Status"
              >
                <MenuItem value="planned">Planned</MenuItem>
                <MenuItem value="in-progress">In Progress</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="on-hold">On Hold</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                value={currentFunction?.priority || 'medium'}
                onChange={(e) => setCurrentFunction({...currentFunction, priority: e.target.value})}
                label="Priority"
              >
                <MenuItem value="critical">Critical</MenuItem>
                <MenuItem value="high">High</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="low">Low</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFunctionDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleSaveFunction} 
            variant="contained"
            disabled={!currentFunction?.module || !currentFunction?.name}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );

  // Debug which view is being rendered
  console.log('Rendering view mode:', viewMode, 'isEditing:', isEditing);

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