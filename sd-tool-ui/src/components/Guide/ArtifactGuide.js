import React from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Switch,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  SDLC_PHASES,
  PHASE_LABELS,
  ARTIFACT_TYPE_DESCRIPTIONS,
  ARTIFACT_TYPE_TO_PHASE,
  getArtifactIcon,
} from '../../constants/sdlcConstants';
import { useWorkspace } from '../../contexts/WorkspaceContext';

const ArtifactGuide = ({ onClose }) => {
  const { artifacts, artifactTypeSettings, toggleSticky } = useWorkspace();

  // Calculate artifact counts by type
  const artifactCounts = React.useMemo(() => {
    if (!artifacts?.items) return {};
    return artifacts.items.reduce((acc, artifact) => {
      acc[artifact.art_type] = (acc[artifact.art_type] || 0) + 1;
      return acc;
    }, {});
  }, [artifacts]);

  // Group artifact types by phase
  const groupedArtifacts = React.useMemo(() => {
    return Object.entries(ARTIFACT_TYPE_TO_PHASE).reduce((acc, [type, phase]) => {
      if (!acc[phase]) {
        acc[phase] = [];
      }
      acc[phase].push({
        type,
        isSticky: artifactTypeSettings?.[type]?.isSticky || false
      });
      return acc;
    }, {});
  }, [artifactTypeSettings]);

  return (
    <Box sx={{ height: '100%', overflow: 'auto' }}>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h5">
            Software Development Lifecycle Artifacts Guide
          </Typography>
        </Box>
        
        <Typography variant="body2" color="text.secondary" paragraph>
          This guide provides an overview of all artifact types used in the software development process.
          Each phase contains specific documents and deliverables that help ensure project success.
        </Typography>

        {Object.entries(SDLC_PHASES).map(([key, phase]) => (
          <Box key={phase} sx={{ mb: 4 }}>
            <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 3 }}>
              {PHASE_LABELS[phase]}
            </Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'action.hover' }}>
                    <TableCell width={50}>Icon</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell align="center" width={100}>Sticky</TableCell>
                    <TableCell align="center" width={100}>Count</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {groupedArtifacts[phase]?.map((item) => (
                    <TableRow key={item.type} hover>
                      <TableCell>
                        {getArtifactIcon(item.type)}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {item.type}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {ARTIFACT_TYPE_DESCRIPTIONS[item.type]}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Switch
                          size="small"
                          checked={item.isSticky}
                          onChange={() => toggleSticky(item.type)}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={artifactCounts[item.type] || 0}
                          size="small"
                          color={artifactCounts[item.type] ? "primary" : "default"}
                          variant={artifactCounts[item.type] ? "filled" : "outlined"}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default ArtifactGuide; 