import React from 'react';
import PropTypes from 'prop-types';
import { ToggleButtonGroup, ToggleButton, Tooltip } from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import TableChartIcon from '@mui/icons-material/TableChart';
import TimelineIcon from '@mui/icons-material/Timeline';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import BarChartIcon from '@mui/icons-material/BarChart';
import ViewKanbanIcon from '@mui/icons-material/ViewKanban';
import { VISUALIZATION_TYPES } from '../../constants/visualizationTypes';

/**
 * Component for selecting different visualization types
 */
const ViewSelector = ({ visualizations, activeVisualization, onChange, size = 'medium' }) => {
  // Map visualization types to icons
  const getIcon = (type) => {
    switch (type) {
      case VISUALIZATION_TYPES.DOCUMENT:
        return <DescriptionIcon />;
      case VISUALIZATION_TYPES.TABLE:
        return <TableChartIcon />;
      case VISUALIZATION_TYPES.DIAGRAM:
        return <AccountTreeIcon />;
      case VISUALIZATION_TYPES.CHART:
        return <BarChartIcon />;
      case VISUALIZATION_TYPES.KANBAN:
        return <ViewKanbanIcon />;
      case VISUALIZATION_TYPES.TIMELINE:
        return <TimelineIcon />;
      default:
        return <DescriptionIcon />;
    }
  };

  const handleChange = (event, newValue) => {
    if (newValue && onChange) {
      const selectedViz = visualizations.find(v => v.type === newValue);
      if (selectedViz) {
        onChange(selectedViz);
      }
    }
  };

  return (
    <ToggleButtonGroup
      value={activeVisualization?.type || ''}
      exclusive
      onChange={handleChange}
      aria-label="visualization type"
      size={size}
    >
      {visualizations.map((viz) => (
        <ToggleButton key={viz.type} value={viz.type} aria-label={viz.label}>
          <Tooltip title={viz.label}>
            {getIcon(viz.type)}
          </Tooltip>
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
};

ViewSelector.propTypes = {
  visualizations: PropTypes.array.isRequired,
  activeVisualization: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  size: PropTypes.oneOf(['small', 'medium', 'large'])
};

export default ViewSelector; 