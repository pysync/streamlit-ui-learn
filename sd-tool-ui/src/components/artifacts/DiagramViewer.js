import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { 
  Box, 
  Paper, 
  Typography, 
  IconButton, 
  Tooltip,
  Menu,
  MenuItem,
  Divider,
  Tabs, 
  Tab,
  Button
} from '@mui/material';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import CenterFocusStrongIcon from '@mui/icons-material/CenterFocusStrong';
import SaveIcon from '@mui/icons-material/Save';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ViewComfyIcon from '@mui/icons-material/ViewComfy';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ListItemIcon from '@mui/material/ListItemIcon';

// Import shared components
import ViewTypeSelector from '../shared/ViewTypeSelector'
import TabHeader from '../shared/TabHeader';
import SplitView from '../shared/SplitView';
import EditableTable from '../shared/EditableTable';
import RelatedArtifactsPanel from '../shared/RelatedArtifactsPanel';

// Placeholder for a real diagramming library
// In a real implementation, you would use a library like:
// - react-diagrams
// - react-flow
// - mxgraph
// - jointjs
const DiagramCanvas = ({
  elements = [],
  onElementsChange,
  readOnly = false,
  zoom = 1,
  diagramType = 'flowchart',
  onAddNode,
  onAddEdge,
  onRemoveElement,
  onSelectElement,
  selectedElement,
  onCanvasClick
}) => {
  // This is just a placeholder component
  return (
    <Box 
      sx={{ 
        height: '100%', 
        width: '100%', 
        position: 'relative',
        bgcolor: '#fafafa',
        border: '1px solid #ddd',
        overflow: 'hidden'
      }}
      onClick={onCanvasClick}
    >
      <svg width="100%" height="100%">
        {/* Node elements would be rendered here */}
        {elements
          .filter(el => el.type === 'node')
          .map(node => (
            <g 
              key={node.id}
              transform={`translate(${node.position.x}, ${node.position.y})`}
            >
              <rect 
                width={node.width || 150}
                height={node.height || 40}
                rx={5}
                fill={selectedElement?.id === node.id ? '#e3f2fd' : '#ffffff'}
                stroke={selectedElement?.id === node.id ? '#1976d2' : '#ccc'}
                strokeWidth={selectedElement?.id === node.id ? 2 : 1}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectElement(node);
                }}
              />
              <text
                x={10}
                y={25}
                fontSize={12}
                fill="#000"
              >
                {node.label || node.id}
              </text>
            </g>
          ))}
          
        {/* Edge elements would be rendered here */}
        {elements
          .filter(el => el.type === 'edge')
          .map(edge => {
            const source = elements.find(el => el.id === edge.source);
            const target = elements.find(el => el.id === edge.target);
            
            if (!source || !target) return null;
            
            const sourceX = source.position.x + (source.width || 150) / 2;
            const sourceY = source.position.y + (source.height || 40) / 2;
            const targetX = target.position.x + (target.width || 150) / 2;
            const targetY = target.position.y + (target.height || 40) / 2;
            
            return (
              <g key={edge.id}>
                <line
                  x1={sourceX}
                  y1={sourceY}
                  x2={targetX}
                  y2={targetY}
                  stroke={selectedElement?.id === edge.id ? '#1976d2' : '#999'}
                  strokeWidth={selectedElement?.id === edge.id ? 2 : 1}
                  markerEnd="url(#arrowhead)"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectElement(edge);
                  }}
                />
                {edge.label && (
                  <text
                    x={(sourceX + targetX) / 2}
                    y={(sourceY + targetY) / 2 - 10}
                    fontSize={10}
                    fill="#666"
                    textAnchor="middle"
                    backgroundColor="#fff"
                  >
                    {edge.label}
                  </text>
                )}
              </g>
            );
          })}
          
        {/* Define arrowhead marker */}
        <defs>
          <marker
            id="arrowhead"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#999" />
          </marker>
        </defs>
      </svg>
    </Box>
  );
};

/**
 * Renders diagram-based artifacts with interactive editing
 */
const DiagramRenderer = ({
  artifact,
  visualization,
  visualizations,
  isEditable = false,
  onVisualizationChange,
  onContentUpdate,
}) => {
  // State for diagram elements
  const [elements, setElements] = useState([]);
  const [selectedElement, setSelectedElement] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [activeTab, setActiveTab] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);
  
  // State for diagram history (undo/redo)
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  // Parse diagram elements from artifact content
  useEffect(() => {
    if (artifact.content) {
      const parsedContent = typeof artifact.content === 'string' 
        ? JSON.parse(artifact.content) 
        : artifact.content;
      
      if (parsedContent.elements && Array.isArray(parsedContent.elements)) {
        setElements(parsedContent.elements);
        
        // Initialize history
        setHistory([parsedContent.elements]);
        setHistoryIndex(0);
      }
    }
  }, [artifact.content]);
  
  // Handle element selection
  const handleSelectElement = (element) => {
    setSelectedElement(element);
  };
  
  // Handle canvas click (deselect)
  const handleCanvasClick = () => {
    setSelectedElement(null);
  };
  
  // Handle adding a new node
  const handleAddNode = () => {
    const newNodeId = `node-${Date.now()}`;
    const newNode = {
      id: newNodeId,
      type: 'node',
      position: { x: 100, y: 100 },
      label: 'New Node',
      width: 150,
      height: 40
    };
    
    const newElements = [...elements, newNode];
    setElements(newElements);
    
    // Update history
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newElements);
    setHistory(newHistory);
    setHistoryIndex(historyIndex + 1);
    
    // Select the new node
    setSelectedElement(newNode);
    
    // Update artifact content
    if (onContentUpdate) {
      onContentUpdate({
        ...artifact.content,
        elements: newElements
      });
    }
  };
  
  // Handle adding a new edge
  const handleAddEdge = () => {
    if (elements.filter(el => el.type === 'node').length < 2) {
      // Need at least two nodes to create an edge
      return;
    }
    
    // For simplicity, connect the first two nodes
    const nodes = elements.filter(el => el.type === 'node');
    const sourceId = nodes[0].id;
    const targetId = nodes[1].id;
    
    const newEdgeId = `edge-${Date.now()}`;
    const newEdge = {
      id: newEdgeId,
      type: 'edge',
      source: sourceId,
      target: targetId,
      label: 'Connection'
    };
    
    const newElements = [...elements, newEdge];
    setElements(newElements);
    
    // Update history
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newElements);
    setHistory(newHistory);
    setHistoryIndex(historyIndex + 1);
    
    // Select the new edge
    setSelectedElement(newEdge);
    
    // Update artifact content
    if (onContentUpdate) {
      onContentUpdate({
        ...artifact.content,
        elements: newElements
      });
    }
  };
  
  // Handle removing an element
  const handleRemoveElement = () => {
    if (!selectedElement) return;
    
    const newElements = elements.filter(el => el.id !== selectedElement.id);
    setElements(newElements);
    
    // Update history
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newElements);
    setHistory(newHistory);
    setHistoryIndex(historyIndex + 1);
    
    // Clear selection
    setSelectedElement(null);
    
    // Update artifact content
    if (onContentUpdate) {
      onContentUpdate({
        ...artifact.content,
        elements: newElements
      });
    }
  };
  
  // Handle undo
  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setElements(history[historyIndex - 1]);
      
      // Update artifact content
      if (onContentUpdate) {
        onContentUpdate({
          ...artifact.content,
          elements: history[historyIndex - 1]
        });
      }
    }
  };
  
  // Handle redo
  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setElements(history[historyIndex + 1]);
      
      // Update artifact content
      if (onContentUpdate) {
        onContentUpdate({
          ...artifact.content,
          elements: history[historyIndex + 1]
        });
      }
    }
  };
  
  // Handle zoom in
  const handleZoomIn = () => {
    setZoom(Math.min(zoom + 0.1, 2));
  };
  
  // Handle zoom out
  const handleZoomOut = () => {
    setZoom(Math.max(zoom - 0.1, 0.5));
  };
  
  // Handle reset zoom
  const handleResetZoom = () => {
    setZoom(1);
  };
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  // Handle menu open
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  // Handle menu close
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  // Handle export diagram
  const handleExport = () => {
    // Implementation would depend on the actual diagramming library
    console.log('Export diagram:', elements);
    handleMenuClose();
  };
  
  // Configure header actions
  const headerActions = [
    {
      id: 'export',
      label: 'Export Diagram',
      icon: <FileDownloadIcon />,
      onClick: handleExport
    }
  ];
  
  // Configure element properties table columns
  const elementPropertiesColumns = [
    { field: 'property', headerName: 'Property', width: 150 },
    { field: 'value', headerName: 'Value', width: 300, editable: isEditable }
  ];
  
  // Prepare element properties data
  const elementPropertiesData = selectedElement 
    ? Object.entries(selectedElement).map(([key, value]) => {
        // Skip complex objects for simplicity
        if (typeof value === 'object' && value !== null) {
          if (key === 'position') {
            return [
              { id: `${key}-x`, property: 'position.x', value: value.x },
              { id: `${key}-y`, property: 'position.y', value: value.y }
            ];
          }
          return null;
        }
        return { id: key, property: key, value };
      })
      .flat()
      .filter(Boolean)
    : [];
  
  // Prepare secondary content
  const secondaryContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {selectedElement ? (
        <>
          <Box sx={{ p: 2, borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}>
            <Typography variant="subtitle1">
              {selectedElement.type === 'node' ? 'Node Properties' : 'Edge Properties'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              ID: {selectedElement.id}
            </Typography>
          </Box>
          
          <Box sx={{ p: 2, flex: 1, overflow: 'auto' }}>
            <EditableTable
              data={elementPropertiesData}
              columns={elementPropertiesColumns}
              editable={isEditable}
              onRowUpdate={(id, updates) => {
                // Handle property updates
                console.log('Update property:', id, updates);
              }}
            />
          </Box>
          
          {isEditable && (
            <Box sx={{ p: 2, borderTop: '1px solid rgba(0, 0, 0, 0.12)' }}>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleRemoveElement}
                fullWidth
              >
                Delete Element
              </Button>
            </Box>
          )}
        </>
      ) : artifact.references ? (
        <RelatedArtifactsPanel
          references={artifact.references}
          onArtifactClick={(ref) => {
            console.log('Navigate to artifact:', ref);
            // Here you would typically navigate to the referenced artifact
          }}
          editable={isEditable}
        />
      ) : (
        <Box sx={{ p: 2 }}>
          <Typography color="text.secondary">
            Select an element to view its properties
          </Typography>
        </Box>
      )}
    </Box>
  );
  
  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <TabHeader 
        title={artifact.title}
        artifactType={artifact.artifactType}
        version={artifact.version}
        status={artifact.status}
        lastModified={artifact.lastModifiedAt}
        actions={headerActions}
      />
      
      <ViewTypeSelector 
        visualizations={visualizations}
        activeVisualization={visualization}
        onChange={onVisualizationChange}
      />
      
      <SplitView 
        secondaryContent={secondaryContent}
        showSecondary={true}
      >
        <Paper 
          elevation={1} 
          sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
        >
          {/* Diagram toolbar */}
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              p: 1,
              borderBottom: '1px solid rgba(224, 224, 224, 1)'
            }}
          >
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab label="Diagram" />
              <Tab label="Elements" />
            </Tabs>
            
            <Box sx={{ flexGrow: 1 }} />
            
            {isEditable && (
              <>
                <Tooltip title="Add Node">
                  <IconButton size="small" onClick={handleAddNode}>
                    <AddIcon />
                  </IconButton>
                </Tooltip>
                
                <Tooltip title="Add Edge">
                  <IconButton size="small" onClick={handleAddEdge}>
                    <ViewComfyIcon />
                  </IconButton>
                </Tooltip>
                
                <Tooltip title="Undo">
                  <IconButton 
                    size="small" 
                    onClick={handleUndo}
                    disabled={historyIndex <= 0}
                  >
                    <UndoIcon />
                  </IconButton>
                </Tooltip>
                
                <Tooltip title="Redo">
                  <IconButton 
                    size="small" 
                    onClick={handleRedo}
                    disabled={historyIndex >= history.length - 1}
                  >
                    <RedoIcon />
                  </IconButton>
                </Tooltip>
              </>
            )}
            
            <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
            
            <Tooltip title="Zoom In">
              <IconButton size="small" onClick={handleZoomIn}>
                <ZoomInIcon />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Zoom Out">
              <IconButton size="small" onClick={handleZoomOut}>
                <ZoomOutIcon />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Reset Zoom">
              <IconButton size="small" onClick={handleResetZoom}>
                <CenterFocusStrongIcon />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="More Options">
              <IconButton 
                size="small"
                onClick={handleMenuClick}
                aria-controls={menuOpen ? 'diagram-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={menuOpen ? 'true' : undefined}
              >
                <MoreVertIcon />
              </IconButton>
            </Tooltip>
            
            <Menu
              id="diagram-menu"
              anchorEl={anchorEl}
              open={menuOpen}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleExport}>
                <ListItemIcon>
                  <FileDownloadIcon fontSize="small" />
                </ListItemIcon>
                Export Diagram
              </MenuItem>
              <MenuItem onClick={handleMenuClose}>
                <ListItemIcon>
                  <SaveIcon fontSize="small" />
                </ListItemIcon>
                Save Diagram
              </MenuItem>
            </Menu>
          </Box>
          
          {/* Main content area based on active tab */}
          <Box sx={{ flex: 1, overflow: 'hidden' }}>
            {activeTab === 0 && (
              <DiagramCanvas
                elements={elements}
                onElementsChange={setElements}
                readOnly={!isEditable}
                zoom={zoom}
                diagramType={'flowchart'}
                onAddNode={handleAddNode}
                onAddEdge={handleAddEdge}
                onRemoveElement={handleRemoveElement}
                onSelectElement={handleSelectElement}
                selectedElement={selectedElement}
                onCanvasClick={handleCanvasClick}
              />
            )}
            
            {activeTab === 1 && (
              <Box p={2}>
                <EditableTable
                  data={elements}
                  columns={[
                    { field: 'id', headerName: 'ID', width: 150 },
                    { field: 'type', headerName: 'Type', width: 100 },
                    { field: 'label', headerName: 'Label', width: 200, editable: isEditable }
                  ]}
                  editable={isEditable}
                  onRowUpdate={(id, updates) => {
                    // Handle element updates
                    const updatedElements = elements.map(el => 
                      el.id === id ? { ...el, ...updates } : el
                    );
                    setElements(updatedElements);
                    
                    // Update history
                    const newHistory = history.slice(0, historyIndex + 1);
                    newHistory.push(updatedElements);
                    setHistory(newHistory);
                    setHistoryIndex(historyIndex + 1);
                    
                    // Update artifact content
                    if (onContentUpdate) {
                      onContentUpdate({
                        ...artifact.content,
                        elements: updatedElements
                      });
                    }
                  }}
                />
              </Box>
            )}
          </Box>
        </Paper>
      </SplitView>
    </Box>
  );
};

DiagramRenderer.propTypes = {
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

export default DiagramRenderer; 