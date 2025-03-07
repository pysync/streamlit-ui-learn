import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Typography,
  Box
} from '@mui/material';
import { getArtifactTypeLabel } from '../../constants/artifactTypes';

const ArtifactVersionPreview = ({ 
  open, 
  onClose, 
  artifact, 
  onRevert,
  currentVersion 
}) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  if (!artifact) return null;

  const isCurrentVersion = artifact.version === currentVersion;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Version {artifact.version} Preview
        {isCurrentVersion && (
          <Typography 
            component="span" 
            variant="caption" 
            color="primary.main"
            sx={{ ml: 1 }}
          >
            (Current)
          </Typography>
        )}
      </DialogTitle>
      <DialogContent>
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableBody>
              <TableRow>
                <TableCell component="th" width={150}>ID</TableCell>
                <TableCell>{artifact.id}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th">Document ID</TableCell>
                <TableCell>{artifact.document_id}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th">Title</TableCell>
                <TableCell>{artifact.title}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th">Type</TableCell>
                <TableCell>{getArtifactTypeLabel(artifact.art_type)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th">Version</TableCell>
                <TableCell>{artifact.version}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th">Created At</TableCell>
                <TableCell>{formatDate(artifact.created_at)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th">Updated At</TableCell>
                <TableCell>{formatDate(artifact.updated_at)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle2" gutterBottom>Content:</Typography>
          <Paper 
            variant="outlined" 
            sx={{ 
              p: 2, 
              maxHeight: '300px', 
              overflow: 'auto',
              bgcolor: 'grey.50'
            }}
          >
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
              {artifact.content || 'No content'}
            </pre>
          </Paper>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        {!isCurrentVersion && (
          <Button 
            onClick={() => onRevert(artifact.version)} 
            variant="contained" 
            color="primary"
          >
            Revert to This Version
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ArtifactVersionPreview; 