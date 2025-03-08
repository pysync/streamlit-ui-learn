import React from 'react';
import {
  Box,
  Paper,
  ToggleButtonGroup,
  ToggleButton,
  styled,
} from '@mui/material';
import { SDLC_PHASES, PHASE_LABELS } from '../../constants/sdlcConstants';

const VerticalToggleButton = styled(ToggleButton)(({ theme }) => ({
  'writing-mode': 'vertical-rl',
  textOrientation: 'mixed',
  transform: 'rotate(180deg)',
  minWidth: '36px',
  padding: theme.spacing(2, 0),
  textTransform: 'none',
  borderRadius: 0,
  '&.Mui-selected': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    }
  }
}));

const WorkspacePhasesSidebar = ({ currentPhase, onPhaseChange }) => {
  return (
    <Paper
      elevation={2}
      sx={{
        position: 'fixed',
        right: 0,
        top: 64, // Height of AppBar
        bottom: 0,
        width: '36px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        zIndex: 1,
        backgroundColor: 'background.default'
      }}
    >
      <ToggleButtonGroup
        orientation="vertical"
        value={currentPhase}
        exclusive
        onChange={(e, newPhase) => {
          if (newPhase !== null) {
            onPhaseChange(newPhase);
          }
        }}
        sx={{ height: '100%', '& .MuiToggleButton-root': { flex: 1 } }}
      >
        {Object.entries(SDLC_PHASES).map(([key, value]) => (
          <VerticalToggleButton 
            key={value} 
            value={value}
            aria-label={PHASE_LABELS[value]}
          >
            {PHASE_LABELS[value]}
          </VerticalToggleButton>
        ))}
      </ToggleButtonGroup>
    </Paper>
  );
};

export default WorkspacePhasesSidebar; 