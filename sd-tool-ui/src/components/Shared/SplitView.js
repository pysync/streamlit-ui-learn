import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels';

/**
 * A reusable split view component that can be used by various artifact renderers
 * and integrates well with the WorkingSpacePage layout options
 */
const SplitView = ({
  direction = 'horizontal',
  leftContent,
  rightContent,
  leftSize = 50,
  rightSize = 50,
  showLeft = true,
  showRight = true,
  minLeftSize = 20,
  minRightSize = 20
}) => {
  // If only one panel should be shown, use full width/height
  if (!showLeft && showRight) {
    return (
      <Box sx={{ height: '100%', width: '100%' }}>
        {rightContent}
      </Box>
    );
  }
  
  if (showLeft && !showRight) {
    return (
      <Box sx={{ height: '100%', width: '100%' }}>
        {leftContent}
      </Box>
    );
  }
  
  if (!showLeft && !showRight) {
    return null;
  }
  
  return (
    <Box sx={{ height: '100%', width: '100%' }}>
      <PanelGroup direction={direction}>
        <Panel
          defaultSize={leftSize}
          minSize={minLeftSize}
        >
          {leftContent}
        </Panel>
        
        <PanelResizeHandle className="resizer" />
        
        <Panel
          defaultSize={rightSize}
          minSize={minRightSize}
        >
          {rightContent}
        </Panel>
      </PanelGroup>
    </Box>
  );
};

SplitView.propTypes = {
  direction: PropTypes.oneOf(['horizontal', 'vertical']),
  leftContent: PropTypes.node,
  rightContent: PropTypes.node,
  leftSize: PropTypes.number,
  rightSize: PropTypes.number,
  showLeft: PropTypes.bool,
  showRight: PropTypes.bool,
  minLeftSize: PropTypes.number,
  minRightSize: PropTypes.number
};

export default SplitView; 