import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Paper,
  Tooltip,
  Typography,
  Box
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import RestoreIcon from '@mui/icons-material/Restore';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useLoading } from '../../contexts/LoadingContext';
import { useMessage } from '../../contexts/MessageContext';
import { getArtifactVersions, rollbackArtifactVersion, deleteArtifactById } from '../../services/client';
import { useWorkspace } from '../../contexts/WorkspaceContext';
import ArtifactVersionPreview from './ArtifactVersionPreview';

const ArtifactVersionsDialog = ({ open, onClose, documentId, currentVersion }) => {
  const [versions, setVersions] = useState([]);
  const [previewVersion, setPreviewVersion] = useState(null);
  const { showLoading, hideLoading } = useLoading();
  const { showMessage, showError } = useMessage();
  const { 
    execLoadArtifacts, 
    updateOpenedArtifactInList,
    getCurrentArtifact
  } = useWorkspace();

  useEffect(() => {
    if (open && documentId) {
      loadVersions();
    }
  }, [open, documentId]);

  const loadVersions = async () => {
    showLoading();
    try {
      const versionsData = await getArtifactVersions(documentId);
      setVersions(versionsData);
    } catch (error) {
      console.error('Error loading versions:', error);
      showError('Failed to load versions');
    } finally {
      hideLoading();
    }
  };

  const handleDelete = async (artifactId) => {
    if (!window.confirm('Are you sure you want to delete this version?')) return;
    
    showLoading();
    try {
      await deleteArtifactById(artifactId);
      showMessage('Version deleted successfully');
      await loadVersions(); // Reload versions after deletion
    } catch (error) {
      console.error('Error deleting version:', error);
      showError('Failed to delete version');
    } finally {
      hideLoading();
    }
  };

  const handleRollback = async (version) => {
    if (!window.confirm(`Are you sure you want to rollback to version ${version}?`)) return;
    
    showLoading();
    try {
      await rollbackArtifactVersion(documentId, version);
      
      // Reload the artifacts list
      await execLoadArtifacts();
      
      // Get the updated artifact after rollback
      const updatedArtifact = await getCurrentArtifact(documentId);
      
      // Update the opened artifact in the list
      updateOpenedArtifactInList(updatedArtifact);
      
      showMessage('Rollback successful');
      onClose();
    } catch (error) {
      console.error('Error rolling back:', error);
      showError('Failed to rollback');
    } finally {
      hideLoading();
    }
  };

  const handlePreview = (version) => {
    setPreviewVersion(version);
  };

  const handleClosePreview = () => {
    setPreviewVersion(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>Version History</DialogTitle>
        <DialogContent>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Version</TableCell>
                  <TableCell>Artifact ID</TableCell>
                  <TableCell>Created At</TableCell>
                  <TableCell>Updated At</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {versions.map((ver) => (
                  <TableRow 
                    key={ver.id}
                    sx={{ 
                      backgroundColor: ver.version === currentVersion ? 'action.hover' : 'inherit'
                    }}
                  >
                    <TableCell>{ver.version}</TableCell>
                    <TableCell>{ver.id}</TableCell>
                    <TableCell>{formatDate(ver.created_at)}</TableCell>
                    <TableCell>{formatDate(ver.updated_at)}</TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        <Tooltip title="View Version">
                          <IconButton 
                            size="small" 
                            onClick={() => handlePreview(ver)}
                            color="primary"
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        {ver.version !== currentVersion && (
                          <Tooltip title="Rollback to this version">
                            <IconButton 
                              size="small" 
                              onClick={() => handleRollback(ver.version)}
                              color="primary"
                            >
                              <RestoreIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        <Tooltip title="Delete version">
                          <IconButton 
                            size="small" 
                            onClick={() => handleDelete(ver.id)}
                            color="error"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
        </DialogActions>
      </Dialog>

      <ArtifactVersionPreview
        open={Boolean(previewVersion)}
        onClose={handleClosePreview}
        artifact={previewVersion}
        onRevert={handleRollback}
        currentVersion={currentVersion}
      />
    </>
  );
};

export default ArtifactVersionsDialog; 