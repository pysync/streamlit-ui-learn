import React from 'react';
import PropTypes from 'prop-types';
import { Box, ToggleButtonGroup, ToggleButton, Tooltip } from '@mui/material';
import ViewListIcon from '@mui/icons-material/ViewList';
import TimelineIcon from '@mui/icons-material/Timeline';
import TableChartIcon from '@mui/icons-material/TableChart';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import DescriptionIcon from '@mui/icons-material/Description';
import InsertChartIcon from '@mui/icons-material/InsertChart';
import ApiIcon from '@mui/icons-material/Api';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CodeIcon from '@mui/icons-material/Code';
import ViewKanbanIcon from '@mui/icons-material/ViewKanban';

import { VISUALIZATION_TYPES } from '../../constants/visualizationTypes';

/**
 * Maps visualization types to icons
 */
const VISUALIZATION_ICONS = {
  [VISUALIZATION_TYPES.DOCUMENT]: DescriptionIcon,
  [VISUALIZATION_TYPES.RICH_TEXT]: DescriptionIcon,
  [VISUALIZATION_TYPES.MARKDOWN]: DescriptionIcon,
  [VISUALIZATION_TYPES.TABLE]: TableChartIcon,
  [VISUALIZATION_TYPES.MATRIX]: TableChartIcon,
  [VISUALIZATION_TYPES.GRID]: TableChartIcon,
  [VISUALIZATION_TYPES.CHART]: InsertChartIcon,
  [VISUALIZATION_TYPES.BAR_CHART]: InsertChartIcon,
  [VISUALIZATION_TYPES.PIE_CHART]: InsertChartIcon,
  [VISUALIZATION_TYPES.LINE_CHART]: InsertChartIcon,
  [VISUALIZATION_TYPES.TIMELINE]: TimelineIcon,
  [VISUALIZATION_TYPES.GANTT]: TimelineIcon,
  [VISUALIZATION_TYPES.DIAGRAM]: AccountTreeIcon,
  [VISUALIZATION_TYPES.ERD]: AccountTreeIcon,
  [VISUALIZATION_TYPES.FLOW]: AccountTreeIcon,
  [VISUALIZATION_TYPES.UML]: AccountTreeIcon,
  [VISUALIZATION_TYPES.NETWORK]: AccountTreeIcon,
  [VISUALIZATION_TYPES.LIST]: ViewListIcon,
  [VISUALIZATION_TYPES.CARD]: ViewListIcon,
  [VISUALIZATION_TYPES.KANBAN]: ViewKanbanIcon,
  [VISUALIZATION_TYPES.SWAGGER]: ApiIcon,
  [VISUALIZATION_TYPES.API_EXPLORER]: ApiIcon,
  [VISUALIZATION_TYPES.DASHBOARD]: DashboardIcon,
  [VISUALIZATION_TYPES.TREE]: AccountTreeIcon,
  [VISUALIZATION_TYPES.MAP]: AccountTreeIcon,
  [VISUALIZATION_TYPES.CODE]: CodeIcon
}; 

/**
 * Component for selecting different visualization types for an artifact
 */
const ViewTypeSelector = ({ 
  visualizations = [],
  activeVisualization,
  onChange
}) => {
  const handleChange = (event, newValue) => {
    if (newValue !== null && onChange) {
      // Find the full visualization object
      const selectedVisualization = visualizations.find(v => 
        v.type === newValue || `${v.type}:${v.subtype}` === newValue
      );
      onChange(selectedVisualization);
    }
  };

  // Create a unique value for each visualization
  const getVisValue = (vis) => vis.subtype ? `${vis.type}:${vis.subtype}` : vis.type;
  
  // Get active value
  const activeValue = activeVisualization ? 
    getVisValue(activeVisualization) : 
    visualizations.length > 0 ? getVisValue(visualizations[0]) : '';

  return (
    <Box sx={{ mb: 2 }}>
      <ToggleButtonGroup
        value={activeValue}
        exclusive
        onChange={handleChange}
        aria-label="View type"
        size="small"
      >
        {visualizations.map((visualization) => {
          const visValue = getVisValue(visualization);
          const IconComponent = VISUALIZATION_ICONS[visualization.type] || DescriptionIcon;
          
          return (
            <Tooltip key={visValue} title={visualization.label} arrow>
              <ToggleButton value={visValue} aria-label={visualization.label}>
                <IconComponent fontSize="small" />
              </ToggleButton>
            </Tooltip>
          );
        })}
      </ToggleButtonGroup>
    </Box>
  );
};

ViewTypeSelector.propTypes = {
  visualizations: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string.isRequired,
      subtype: PropTypes.string,
      label: PropTypes.string.isRequired,
      isDefault: PropTypes.bool
    })
  ),
  activeVisualization: PropTypes.shape({
    type: PropTypes.string.isRequired,
    subtype: PropTypes.string,
    label: PropTypes.string.isRequired
  }),
  onChange: PropTypes.func
};

export default ViewTypeSelector; 