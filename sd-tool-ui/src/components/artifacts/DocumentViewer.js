import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, IconButton, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import PrintIcon from '@mui/icons-material/Print';
import DownloadIcon from '@mui/icons-material/Download';
import MarkdownEditor from '../shared/MarkdownEditor';
import BaseArtifactViewer from './BaseArtifactViewer';
import RelatedArtifactsPanel from '../shared/RelatedArtifactsPanel';

/**
 * Renders document-based artifacts with rich text editing capabilities
 */
const DocumentViewer = ({
  artifact,
  activeVisualization,
  visualizations,
  isEditable = false,
  onVisualizationChange,
  onContentUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(artifact.content);
  
  // Handle editing toggle
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  // Handle save
  const handleSave = () => {
    if (onContentUpdate) {
      onContentUpdate(content);
    }
    setIsEditing(false);
  };

  // Handle content change
  const handleContentChange = (newContent) => {
    setContent(newContent);
  };

  // Handle artifact reference click
  const handleArtifactClick = (reference) => {
   /// navigateToArtifact(reference.id);
   alert("navigateToArtifact")
  };

  // Generate actions for tab header
  const headerActions = [
    { id: 'print', label: 'Print', icon: <PrintIcon /> },
    { id: 'export', label: 'Export', icon: <DownloadIcon /> },
  ];

  if (isEditable) {
    if (isEditing) {
      headerActions.unshift(
        { id: 'save', label: 'Save', icon: <SaveIcon />, onClick: handleSave }
      );
    } else {
      headerActions.unshift(
        { id: 'edit', label: 'Edit', icon: <EditIcon />, onClick: handleEditToggle }
      );
    }
  }

  // Secondary panel content
  const secondaryContent = artifact.references?.length > 0 ? (
    <RelatedArtifactsPanel
      references={artifact.references}
      onArtifactClick={handleArtifactClick}
      editable={isEditable}
    />
  ) : null;

  return (
    <BaseArtifactViewer
      artifact={artifact}
      activeVisualization={activeVisualization}
      visualizations={visualizations}
      isEditable={isEditable}
      onVisualizationChange={onVisualizationChange}
      headerActions={headerActions}
      secondaryContent={secondaryContent}
    >
      <Box sx={{ flex: 1, p: 2, overflow: 'auto' }}>
        {isEditing ? (
          <MarkdownEditor
            noteTitle={artifact.title}
            markdownContent={content}
            onContentChange={handleContentChange}
            onTitleChange={(newTitle) => onContentUpdate({ ...artifact, title: newTitle })}
            onSave={handleSave}
            artifactId={artifact.id}
          />
        ) : (
          // Render document content in view mode
          <Box className="markdown-renderer">
            {/* Markdown rendering implementation */}
            {content}
          </Box>
        )}
      </Box>
    </BaseArtifactViewer>
  );
};

DocumentViewer.propTypes = {
  artifact: PropTypes.shape({
    id: PropTypes.string.isRequired,
    document_id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    title: PropTypes.string,
    content: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    references: PropTypes.array,
    visualizations: PropTypes.array,
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

export default DocumentViewer; 