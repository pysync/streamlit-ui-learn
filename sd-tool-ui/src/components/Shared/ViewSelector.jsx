import React from 'react';
import PropTypes from 'prop-types';
import { Box, ToggleButtonGroup, ToggleButton, Tooltip } from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import TableChartIcon from '@mui/icons-material/TableChart';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import TimelineIcon from '@mui/icons-material/Timeline';
import BarChartIcon from '@mui/icons-material/BarChart';
import ViewKanbanIcon from '@mui/icons-material/ViewKanban';
import CodeIcon from '@mui/icons-material/Code';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { VISUALIZATION_TYPES } from '../../constants/visualizationTypes';

// Icon mapping for visualization types
const VISUALIZATION_ICONS = {
  [VISUALIZATION_TYPES.DOCUMENT]: <DescriptionIcon />,
  [VISUALIZATION_TYPES.TABLE]: <TableChartIcon />,
  [VISUALIZATION_TYPES.MATRIX]: <TableChartIcon />,
  [VISUALIZATION_TYPES.DIAGRAM]: <AccountTreeIcon />,
  [VISUALIZATION_TYPES.GANTT]: <TimelineIcon />,
  [VISUALIZATION_TYPES.TIMELINE]: <TimelineIcon />,
  [VISUALIZATION_TYPES.CHART]: <BarChartIcon />,
  [VISUALIZATION_TYPES.KANBAN]: <ViewKanbanIcon />,
  [VISUALIZATION_TYPES.CODE]: <CodeIcon />,
  [VISUALIZATION_TYPES.DASHBOARD]: <DashboardIcon />,
  // Add more mappings as needed
};

/**
 * Component for switching between different visualizations of an artifact
 */
const ViewSelector = ({
  visualizations = [],
  activeVisualization,
  onChange
}) => {
  // If there's only one visualization, don't render selector
  if (visualizations.length <= 1) {
    return null;
  }

  const handleViewChange = (event, newValue) => {
    if (newValue !== null && onChange) {
      const selectedVisualization = visualizations.find(v => v.type === newValue);
      onChange(selectedVisualization);
    }
  };

  return (
    <Box sx={{ 
      p: 1, 
      borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
      display: 'flex',
      justifyContent: 'center'
    }}>
      <ToggleButtonGroup
        value={activeVisualization?.type}
        exclusive
        onChange={handleViewChange}
        size="small"
      >
        {visualizations.map((visualization) => (
          <ToggleButton 
            key={`${visualization.type}-${visualization.subtype || 'default'}`}
            value={visualization.type}
          >
            <Tooltip title={visualization.label}>
              {VISUALIZATION_ICONS[visualization.type] || <DescriptionIcon />}
            </Tooltip>
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Box>
  );
};

ViewSelector.propTypes = {
  visualizations: PropTypes.arrayOf(PropTypes.shape({
    type: PropTypes.string.isRequired,
    subtype: PropTypes.string,
    label: PropTypes.string.isRequired,
    isDefault: PropTypes.bool
  })),
  activeVisualization: PropTypes.shape({
    type: PropTypes.string.isRequired,
    subtype: PropTypes.string
  }),
  onChange: PropTypes.func
};

export default ViewSelector; 