import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { 
  Box, 
  Paper, 
  Typography, 
  Divider,
  IconButton, 
  Tooltip,
  TableOfContents
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import PrintIcon from '@mui/icons-material/Print';
import DownloadIcon from '@mui/icons-material/Download';

// Rich text editor components
import { Editor, EditorState, RichUtils, convertToRaw, convertFromRaw } from 'draft-js';
import 'draft-js/dist/Draft.css';

// Import shared components
import ViewTypeSelector from '../Shared/ViewTypeSelector';
import TabHeader from '../Shared/TabHeader';
import SplitView from '../Shared/SplitView';
import RelatedArtifactsPanel from '../Shared/RelatedArtifactsPanel';

/**
 * Renders document-based artifacts with rich text editing capabilities
 */
const DocumentRenderer = ({
  artifact,
  visualization,
  visualizations,
  isEditable = false,
  onVisualizationChange,
  onContentUpdate,
}) => {
  // Initialize state
  const [isEditing, setIsEditing] = useState(false);
  const [editorState, setEditorState] = useState(() => {
    // Initialize with content if available
    if (artifact.content && typeof artifact.content === 'object') {
      try {
        return EditorState.createWithContent(convertFromRaw(artifact.content));
      } catch (e) {
        console.error('Error parsing document content:', e);
        return EditorState.createEmpty();
      }
    }
    return EditorState.createEmpty();
  });
  
  // Handle editor state changes
  const handleEditorChange = (state) => {
    setEditorState(state);
  };
  
  // Toggle edit mode
  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };
  
  // Save content changes
  const handleSave = () => {
    const contentState = editorState.getCurrentContent();
    const rawContent = convertToRaw(contentState);
    
    if (onContentUpdate) {
      onContentUpdate(rawContent);
    }
    
    setIsEditing(false);
  };
  
  // Cancel editing
  const handleCancel = () => {
    // Reset to original content
    if (artifact.content && typeof artifact.content === 'object') {
      try {
        setEditorState(EditorState.createWithContent(convertFromRaw(artifact.content)));
      } catch (e) {
        console.error('Error resetting document content:', e);
      }
    }
    
    setIsEditing(false);
  };
  
  // Handle keyboard shortcuts
  const handleKeyCommand = (command, editorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      handleEditorChange(newState);
      return 'handled';
    }
    return 'not-handled';
  };
  
  // Handle visualization change
  const handleVisualizationChange = (newVisualization) => {
    if (onVisualizationChange) {
      onVisualizationChange(newVisualization);
    }
  };
  
  // Handle artifact click
  const handleArtifactClick = (reference) => {
    // Navigate to the referenced artifact
    console.log('Navigate to:', reference);
  };
  
  // Generate actions for tab header
  const headerActions = [
    { id: 'print', label: 'Print', icon: <PrintIcon /> },
    { id: 'export', label: 'Export', icon: <DownloadIcon /> },
  ];
  
  if (isEditable) {
    if (isEditing) {
      headerActions.unshift(
        { id: 'save', label: 'Save', icon: <SaveIcon /> },
        { id: 'cancel', label: 'Cancel', icon: <CancelIcon /> }
      );
    } else {
      headerActions.unshift({ id: 'edit', label: 'Edit', icon: <EditIcon /> });
    }
  }
  
  // Handle header action clicks
  const handleActionClick = (actionId) => {
    switch (actionId) {
      case 'edit':
        toggleEditMode();
        break;
      case 'save':
        handleSave();
        break;
      case 'cancel':
        handleCancel();
        break;
      case 'print':
        window.print();
        break;
      case 'export':
        // Implement export functionality
        console.log('Export document');
        break;
      default:
        break;
    }
  };
  
  // Create table of contents from the document structure
  const generateTableOfContents = () => {
    // This is a simplified ToC - in a real implementation,
    // you would parse the document structure to create this
    return [
      { id: 'section1', label: 'Introduction', level: 1 },
      { id: 'section2', label: 'Objectives', level: 1 },
      { id: 'section3', label: 'Requirements', level: 1 },
      { id: 'section3_1', label: 'Functional Requirements', level: 2 },
      { id: 'section3_2', label: 'Non-Functional Requirements', level: 2 },
      { id: 'section4', label: 'Conclusion', level: 1 }
    ];
  };
  
  // Secondary panel content
  const secondaryContent = artifact.references?.length > 0 ? (
    <RelatedArtifactsPanel
      references={artifact.references}
      onArtifactClick={handleArtifactClick}
      editable={isEditable}
    />
  ) : null;
  
  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <TabHeader 
        title={artifact.title}
        artifactType={artifact.artifactType}
        version={artifact.version}
        status={artifact.status}
        lastModified={artifact.lastModifiedAt}
        actions={headerActions}
        onActionClick={handleActionClick}
      />
      
      <ViewTypeSelector 
        visualizations={visualizations}
        activeVisualization={visualization}
        onChange={handleVisualizationChange}
      />
      
      <SplitView 
        secondaryContent={secondaryContent}
        showSecondary={!!secondaryContent}
      >
        <Paper 
          elevation={1} 
          sx={{ 
            p: 3, 
            height: '100%', 
            display: 'flex',
            flexDirection: 'column',
            overflow: 'auto'
          }}
        >
          {/* Document Title */}
          <Typography variant="h4" gutterBottom>
            {artifact.title}
          </Typography>
          
          <Divider sx={{ my: 2 }} />
          
          {/* Document Content */}
          <Box sx={{ flex: 1, overflow: 'auto' }}>
            <Editor
              editorState={editorState}
              onChange={handleEditorChange}
              handleKeyCommand={handleKeyCommand}
              readOnly={!isEditing}
              stripPastedStyles
            />
          </Box>
        </Paper>
      </SplitView>
    </Box>
  );
};

DocumentRenderer.propTypes = {
  artifact: PropTypes.shape({
    artifactId: PropTypes.string.isRequired,
    artifactType: PropTypes.string.isRequired,
    title: PropTypes.string,
    content: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    references: PropTypes.array,
    visualization: PropTypes.array,
    version: PropTypes.string,
    status: PropTypes.string,
    lastModifiedAt: PropTypes.string
  }).isRequired,
  visualization: PropTypes.object,
  visualizations: PropTypes.array,
  isEditable: PropTypes.bool,
  onVisualizationChange: PropTypes.func,
  onContentUpdate: PropTypes.func
};

export default DocumentRenderer; 