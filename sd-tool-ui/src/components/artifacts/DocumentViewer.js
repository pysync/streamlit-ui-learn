import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, Paper, IconButton, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PrintIcon from '@mui/icons-material/Print';
import DownloadIcon from '@mui/icons-material/Download';
import TabHeader from '../shared/TabHeader';
import ViewSelector from '../shared/ViewSelector';
import SplitView from '../shared/SplitView';
import RelatedItemsPanel from '../shared/RelatedItemsPanel';
import MarkdownEditor from '../shared/MarkdownEditor';
import MDEditor from '@uiw/react-md-editor';
import { useWorkspace } from '../../contexts/WorkspaceContext';

/**
 * Generic document viewer for text-based artifacts
 */
const DocumentViewer = ({
  artifact,
  activeVisualization,
  visualizations,
  isEditable = false,
  onContentUpdate,
  onVisualizationChange,
  layoutMode = 'single'
}) => {
  const { navigateToArtifact } = useWorkspace();
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState('');

  useEffect(() => {
    console.log('DocumentViewer mounted for :', {
      art_type: artifact.art_type,
      document_id: artifact.document_id,
    });
  }, [artifact]);
  
  // Initialize content from artifact
  useEffect(() => {
    if (artifact?.content) {
      if (typeof artifact.content === 'object') {
        try {
          setContent(JSON.stringify(artifact.content, null, 2));
        } catch (e) {
          setContent(String(artifact.content) || '');
        }
      } else {
        setContent(artifact.content);
      }
    } else {
      setContent(`# ${artifact?.title || 'Document'}\n\nStart writing content here...`);
    }
  }, [artifact?.document_id]);

  // Handle content change from editor
  const handleContentChange = (newContent) => {
    setContent(newContent);
  };

  // Handle save
  const handleSave = () => {
    if (onContentUpdate) {
      onContentUpdate(content);
      setIsEditing(false);
    }
  };

  // Prepare header actions
  const headerActions = [
    {
      id: 'edit',
      label: isEditing ? 'View Mode' : 'Edit Mode',
      icon: isEditing ? <VisibilityIcon /> : <EditIcon />,
      onClick: () => setIsEditing(!isEditing)
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
    if (onVisualizationChange) {
      onVisualizationChange(viz);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <TabHeader
        title={artifact?.title || 'Document'}
        status={artifact?.status}
        lastModified={artifact?.lastModified}
        actions={headerActions}
      />
      
      {visualizations && visualizations.length > 0 && (
        <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2, py: 1 }}>
          <ViewSelector
            visualizations={visualizations}
            activeVisualization={activeVisualization}
            onChange={handleVisualizationChange}
          />
        </Box>
      )}
      
      <SplitView
        direction={layoutMode === 'horizontal' ? 'horizontal' : 'vertical'}
        primaryContent={
          <Box sx={{ height: '100%', p: 2, overflow: 'auto' }}>
            {isEditing ? (
              <MarkdownEditor
                noteTitle={artifact?.title}
                markdownContent={content}
                onContentChange={handleContentChange}
                onTitleChange={(newTitle) => {
                  if (onContentUpdate && artifact) {
                    // Update title in parent component
                    console.log('Title changed to:', newTitle);
                  }
                }}
                onSave={handleSave}
                artifactId={artifact?.id}
              />
            ) : (
              <Box data-color-mode="light" className="markdown-renderer">
                <MDEditor.Markdown source={content} />
              </Box>
            )}
          </Box>
        }
        secondaryContent={secondaryContent}
        showSecondary={layoutMode !== 'single' && !!secondaryContent}
      />
    </Box>
  );
};

DocumentViewer.propTypes = {
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
  onContentUpdate: PropTypes.func,
  layoutMode: PropTypes.oneOf(['single', 'vertical', 'horizontal'])
};

export default DocumentViewer; 