import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { 
  Box, 
  Paper, 
  IconButton, 
  Tooltip,
  ButtonGroup,
  Menu,
  MenuItem,
  Divider,
  Typography
} from '@mui/material';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import CenterFocusStrongIcon from '@mui/icons-material/CenterFocusStrong';
import SaveIcon from '@mui/icons-material/Save';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DownloadIcon from '@mui/icons-material/Download';
import TabHeader from '../../shared/TabHeader';
import SplitView from '../../shared/SplitView';
import RelatedItemsPanel from '../../shared/RelatedItemsPanel';
import { useWorkspace } from '../../../contexts/WorkspaceContext';

/**
 * Generic diagram viewer for diagram-based artifacts
 * This is a placeholder that would integrate with a real diagramming library
 * like react-flow, mermaid, or excalidraw
 */
const DiagramViewer = ({
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
  const [zoom, setZoom] = useState(1);
  const [diagramData, setDiagramData] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const canvasRef = useRef(null);
  
  // Parse artifact content and initialize diagram data
  useEffect(() => {
    if (artifact) {
      let parsedData = null;
      
      // Handle different content formats
      if (typeof artifact.content === 'string') {
        try {
          // Try to parse as JSON
          parsedData = JSON.parse(artifact.content);
        } catch (e) {
          console.warn('Failed to parse artifact content as JSON:', e);
          // For non-JSON content, we might need special handling
          parsedData = { rawContent: artifact.content };
        }
      } else if (artifact.content) {
        // Already parsed object
        parsedData = artifact.content;
      }
      
      setDiagramData(parsedData);
      
      // Initialize history
      setHistory([parsedData]);
      setHistoryIndex(0);
    }
  }, [artifact]);
  
  // Toggle edit mode
  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };
  
  // Handle zoom in
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.1, 2));
  };
  
  // Handle zoom out
  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.1, 0.5));
  };
  
  // Handle reset zoom
  const handleResetZoom = () => {
    setZoom(1);
  };
  
  // Handle undo
  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setDiagramData(history[historyIndex - 1]);
    }
  };
  
  // Handle redo
  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setDiagramData(history[historyIndex + 1]);
    }
  };
  
  // Handle save
  const handleSave = () => {
    if (onContentUpdate) {
      onContentUpdate(diagramData);
    }
    setIsEditing(false);
  };
  
  // Handle diagram changes
  const handleDiagramChange = (newData) => {
    setDiagramData(newData);
    
    // Update history
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newData);
    setHistory(newHistory);
    setHistoryIndex(historyIndex + 1);
  };
  
  // Handle download
  const handleDownload = () => {
    // This would be implemented based on the specific diagramming library
    console.log('Download diagram');
  };
  
  // Prepare secondary content (related items)
  const secondaryContent = artifact?.references?.length > 0 && (
    <RelatedItemsPanel
      references={artifact.references}
      onArtifactClick={navigateToArtifact}
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
  
  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <TabHeader
        title={artifact?.title || 'Untitled Diagram'}
        status={artifact?.status}
        lastModified={artifact?.updated_at}
        actions={headerActions}
      />
      
      <SplitView
        direction={layoutMode === 'horizontal' ? 'horizontal' : 'vertical'}
        primaryContent={
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Diagram toolbar */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              p: 1, 
              borderBottom: '1px solid rgba(0, 0, 0, 0.12)' 
            }}>
              <ButtonGroup size="small">
                <Tooltip title="Zoom In">
                  <IconButton onClick={handleZoomIn}>
                    <ZoomInIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Zoom Out">
                  <IconButton onClick={handleZoomOut}>
                    <ZoomInIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Reset Zoom">
                  <IconButton onClick={handleResetZoom}>
                    <CenterFocusStrongIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </ButtonGroup>
              
              {isEditing && (
                <ButtonGroup size="small">
                  <Tooltip title="Undo">
                    <IconButton onClick={handleUndo} disabled={historyIndex <= 0}>
                      <UndoIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Redo">
                    <IconButton onClick={handleRedo} disabled={historyIndex >= history.length - 1}>
                      <RedoIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </ButtonGroup>
              )}
              
              <Tooltip title="Download Diagram">
                <IconButton onClick={handleDownload}>
                  <DownloadIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
            
            {/* Diagram canvas */}
            <Box 
              ref={canvasRef}
              sx={{ 
                flexGrow: 1, 
                overflow: 'auto',
                position: 'relative',
                '& .diagram-container': {
                  transform: `scale(${zoom})`,
                  transformOrigin: 'top left',
                  transition: 'transform 0.2s ease-in-out'
                }
              }}
            >
              {diagramData ? (
                <Box className="diagram-container" sx={{ p: 2 }}>
                  {/* This would be replaced with an actual diagramming component */}
                  <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center' }}>
                    Diagram Placeholder - Would integrate with a diagramming library
                  </Typography>
                  <pre>{JSON.stringify(diagramData, null, 2)}</pre>
                </Box>
              ) : (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="body1" color="text.secondary">
                    No diagram data available
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        }
        secondaryContent={secondaryContent}
        showSecondary={layoutMode !== 'single' && !!secondaryContent}
      />
    </Box>
  );
};

DiagramViewer.propTypes = {
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

export default DiagramViewer; 