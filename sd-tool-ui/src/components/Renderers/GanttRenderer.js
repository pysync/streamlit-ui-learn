import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { 
  Box, 
  Paper, 
  Tabs, 
  Tab, 
  IconButton, 
  Tooltip,
  Menu,
  MenuItem,
  Divider,
  TextField,
  Button
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import TodayIcon from '@mui/icons-material/Today';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

// Import shared components
import ViewTypeSelector from '../Shared/ViewTypeSelector';
import TabHeader from '../Shared/TabHeader';
import SplitView from '../Shared/SplitView';
import EditableTable from '../Shared/EditableTable';
import RelatedArtifactsPanel from '../Shared/RelatedArtifactsPanel';

// React Gantt Component 
// This is a placeholder - in a real implementation you'd use a library
// like gantt-chart-d3, dhtmlx-gantt, or react-gantt-chart
const GanttChart = ({ 
  tasks, 
  timeRange, 
  onTaskUpdate, 
  zoom = 1,
  showCriticalPath = true,
  showProgress = true,
  viewMode = 'week',
  onLinkAdd,
  onLinkDelete,
  readOnly = false
}) => {
  // This is a placeholder implementation
  return (
    <Box 
      sx={{ 
        border: '1px solid #ddd', 
        height: '100%', 
        position: 'relative',
        bgcolor: '#f9f9f9',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Gantt header - dates */}
      <Box sx={{ height: 60, borderBottom: '1px solid #ddd', display: 'flex' }}>
        {/* Time scale would go here */}
      </Box>
      
      {/* Gantt body - task bars */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        {/* Tasks would be rendered here with appropriate positioning */}
        {tasks.map(task => (
          <Box 
            key={task.id}
            sx={{
              position: 'absolute',
              left: `${Math.random() * 60}%`, // Placeholder random positioning
              top: `${tasks.indexOf(task) * 40 + 10}px`,
              width: `${Math.random() * 200 + 100}px`, // Placeholder random width
              height: '30px',
              bgcolor: task.color || '#4285F4',
              borderRadius: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}
          >
            {task.name}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

/**
 * Renders project plans with Gantt chart and task management
 */
const GanttRenderer = ({
  artifact,
  visualization,
  visualizations,
  isEditable = false,
  onVisualizationChange,
  onContentUpdate,
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [filter, setFilter] = useState({});
  const [viewMode, setViewMode] = useState('week');
  const [anchorEl, setAnchorEl] = useState(null);
  
  // Parse content
  const content = artifact.content || {};
  const tasks = content.tasks || [];
  const phases = content.phases || [];
  const timeline = content.timeline || { startDate: new Date(), endDate: new Date() };
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  // Open menu
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  // Close menu
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  // Handle zoom change
  const handleZoomIn = () => {
    setZoom(Math.min(zoom + 0.25, 2));
  };
  
  const handleZoomOut = () => {
    setZoom(Math.max(zoom - 0.25, 0.5));
  };
  
  // Handle view mode change
  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    handleMenuClose();
  };
  
  // Handle task update
  const handleTaskUpdate = (taskId, updates) => {
    if (!isEditable) return;
    
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, ...updates } : task
    );
    
    const updatedContent = {
      ...content,
      tasks: updatedTasks
    };
    
    if (onContentUpdate) {
      onContentUpdate(updatedContent);
    }
  };
  
  // Handle task add
  const handleTaskAdd = (newTask) => {
    if (!isEditable) return;
    
    const updatedTasks = [...tasks, newTask];
    
    const updatedContent = {
      ...content,
      tasks: updatedTasks
    };
    
    if (onContentUpdate) {
      onContentUpdate(updatedContent);
    }
  };
  
  // Handle phase add
  const handlePhaseAdd = (newPhase) => {
    if (!isEditable) return;
    
    const updatedPhases = [...phases, newPhase];
    
    const updatedContent = {
      ...content,
      phases: updatedPhases
    };
    
    if (onContentUpdate) {
      onContentUpdate(updatedContent);
    }
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
  
  // Define table columns for tasks view
  const taskColumns = [
    { field: 'name', headerName: 'Task Name', width: '30%' },
    { field: 'startDate', headerName: 'Start Date', width: '15%', type: 'date' },
    { field: 'endDate', headerName: 'End Date', width: '15%', type: 'date' },
    { 
      field: 'phaseId', 
      headerName: 'Phase', 
      width: '15%',
      type: 'select',
      options: phases.map(phase => ({ value: phase.id, label: phase.name }))
    },
    { 
      field: 'status', 
      headerName: 'Status', 
      width: '10%',
      type: 'select',
      options: [
        { value: 'not_started', label: 'Not Started' },
        { value: 'in_progress', label: 'In Progress' },
        { value: 'completed', label: 'Completed' },
        { value: 'on_hold', label: 'On Hold' },
        { value: 'cancelled', label: 'Cancelled' }
      ]
    },
    { 
      field: 'completionPercentage', 
      headerName: 'Progress', 
      width: '10%',
      type: 'number' 
    }
  ];
  
  // Define header actions
  const headerActions = [
    { id: 'add', label: 'Add Task', icon: <AddIcon /> },
    { id: 'filter', label: 'Filter', icon: <FilterListIcon /> }
  ];
  
  // Handle header action clicks
  const handleActionClick = (actionId) => {
    switch (actionId) {
      case 'add':
        // Open task add dialog
        console.log('Add task');
        break;
      case 'filter':
        // Toggle filter panel
        console.log('Toggle filters');
        break;
      default:
        break;
    }
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
      
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        sx={{ px: 2, borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab label="Gantt Chart" />
        <Tab label="Task List" />
        <Tab label="Timeline" />
        <Tab label="Resources" />
      </Tabs>
      
      <SplitView 
        secondaryContent={secondaryContent}
        showSecondary={!!secondaryContent}
      >
        <Paper 
          elevation={1} 
          sx={{ 
            height: '100%', 
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}
        >
          {/* Toolbar */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            p: 1,
            borderBottom: 1,
            borderColor: 'divider'
          }}>
            <Box>
              <Tooltip title="Previous">
                <IconButton size="small">
                  <KeyboardArrowLeftIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Today">
                <IconButton size="small">
                  <TodayIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Next">
                <IconButton size="small">
                  <KeyboardArrowRightIcon />
                </IconButton>
              </Tooltip>
            </Box>
            
            <Box>
              <Tooltip title="Zoom Out">
                <IconButton size="small" onClick={handleZoomOut}>
                  <ZoomOutIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Zoom In">
                <IconButton size="small" onClick={handleZoomIn}>
                  <ZoomInIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="View Options">
                <IconButton 
                  size="small" 
                  onClick={handleMenuOpen}
                  aria-controls="view-menu"
                  aria-haspopup="true"
                >
                  <MoreVertIcon />
                </IconButton>
              </Tooltip>
              <Menu
                id="view-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem 
                  onClick={() => handleViewModeChange('day')}
                  selected={viewMode === 'day'}
                >
                  Day
                </MenuItem>
                <MenuItem 
                  onClick={() => handleViewModeChange('week')}
                  selected={viewMode === 'week'}
                >
                  Week
                </MenuItem>
                <MenuItem 
                  onClick={() => handleViewModeChange('month')}
                  selected={viewMode === 'month'}
                >
                  Month
                </MenuItem>
                <MenuItem 
                  onClick={() => handleViewModeChange('quarter')}
                  selected={viewMode === 'quarter'}
                >
                  Quarter
                </MenuItem>
                <Divider />
                <MenuItem onClick={() => {}}>
                  Show Critical Path
                </MenuItem>
                <MenuItem onClick={() => {}}>
                  Show Progress
                </MenuItem>
              </Menu>
            </Box>
          </Box>
          
          {/* Content area based on active tab */}
          <Box sx={{ flex: 1, overflow: 'auto', p: activeTab !== 0 ? 2 : 0 }}>
            {activeTab === 0 && (
              <GanttChart 
                tasks={tasks}
                timeRange={{
                  start: new Date(timeline.startDate),
                  end: new Date(timeline.endDate)
                }}
                onTaskUpdate={handleTaskUpdate}
                zoom={zoom}
                viewMode={viewMode}
                showCriticalPath={true}
                showProgress={true}
                readOnly={!isEditable}
              />
            )}
            
            {activeTab === 1 && (
              <EditableTable 
                data={tasks}
                columns={taskColumns}
                editable={isEditable}
                onRowUpdate={(id, updates) => handleTaskUpdate(id, updates)}
                onRowAdd={handleTaskAdd}
              />
            )}
            
            {activeTab === 2 && (
              <Box>Timeline View (Implementation Placeholder)</Box>
            )}
            
            {activeTab === 3 && (
              <Box>Resources View (Implementation Placeholder)</Box>
            )}
          </Box>
        </Paper>
      </SplitView>
    </Box>
  );
};

GanttRenderer.propTypes = {
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

export default GanttRenderer; 