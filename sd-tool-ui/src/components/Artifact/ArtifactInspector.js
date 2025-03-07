// src/components/Artifact/ArtifactInspector.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Chip,
  Divider,
  Paper,
  IconButton,
  Tooltip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import CancelIcon from '@mui/icons-material/Cancel';
import ArtifactSelectDialog from './ArtifactSelectDialog';
import { useWorkspace } from '../../contexts/WorkspaceContext';
import { useLoading } from '../../contexts/LoadingContext';
import { useMessage } from '../../contexts/MessageContext';
import { ARTIFACT_TYPES, getFileExtension } from '../../constants/artifactTypes';
import { setArtifactMeta, downloadArtifact } from '../../services/client';

/**
 * Component that displays and allows editing of artifact properties
 * @param {object} artifact - The artifact to inspect/edit
 */
const ArtifactInspector = ({ artifact }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [artType, setArtType] = useState('');
  const [dependencies, setDependencies] = useState([]); // keep track list ids of dependencies artifacts.
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dependencyArtifacts, setDependencyArtifacts] = useState([]);
  
  const { execUpdateArtifact, artifacts, updateOpenedArtifactInList } = useWorkspace();
  const { showLoading, hideLoading } = useLoading();
  const { showMessage, showError } = useMessage();

  // Load artifact data when component receives a new artifact
  useEffect(() => {
    if (artifact) {
      setTitle(artifact.title || '');
      setArtType(artifact.art_type || '');
      setDependencies(artifact.dependencies || []);
      setIsEditing(false); // Reset editing mode when artifact changes
    }
  }, [artifact, artifact.dependencies]);

  // Find the dependency artifacts when dependencies change
  useEffect(() => {
    if (dependencies && dependencies.length > 0 && artifacts && artifacts.items) {
      const deps = artifacts.items.filter(a => dependencies.includes(a.id));
      setDependencyArtifacts(deps);
    } else {
      setDependencyArtifacts([]);
    }
  }, [dependencies, artifacts]);

  const handleEditToggle = () => {
    if (isEditing) {
      // If we're canceling, reset the form
      setTitle(artifact.title || '');
      setArtType(artifact.art_type || '');
      setDependencies(artifact.dependencies || []);
    }
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      showError('Title cannot be empty');
      return;
    }

    showLoading();
    try {
      // For new unsaved artifacts, update the artifact in the opened artifacts list
      if (artifact.isNew) {
        const updatedArtifact = {
          ...artifact,
          title,
          art_type: artType,
          dependencies: dependencies
        };
        
        // Update the artifact in the context
        updateOpenedArtifactInList(updatedArtifact);
        setIsEditing(false);
        showMessage('Properties updated. Save in editor to create the artifact.', 'success');
      } else {
        // For existing artifacts, use the API to update
        const artifactData = {
          title,
          content: null, // Don't update content
          dependencies: dependencies
        };
        
        await execUpdateArtifact(artifact.document_id, artifactData);
        setIsEditing(false);
        showMessage('Artifact updated successfully', 'success');
      }
    } catch (error) {
      console.error('Error updating artifact:', error);
      showError(`Failed to update artifact: ${error.message}`);
    } finally {
      hideLoading();
    }
  };

  const handleDownload = async () => {
    showLoading();
    try {
      await downloadArtifact(artifact.document_id, `${artifact.title}${getFileExtension(artifact.art_type)}`);
      showMessage('File downloaded successfully', 'success');
    } catch (error) {
      console.error('Error downloading artifact:', error);
      showError('Failed to download artifact');
    } finally {
      hideLoading();
    }
  };

  const handleDependencySelect = (selectedDeps) => { // ids
    setDependencies(selectedDeps);
  };

  const handleRemoveDependency = (depToRemove) => {
    setDependencies(dependencies.filter(dep => dep !== depToRemove));
  };

  if (!artifact) {
    return (
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          No artifact selected
        </Typography>
      </Paper>
    );
  }

  const fileExtension = getFileExtension(artifact.art_type);

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="subtitle1" fontWeight="bold">
          {artifact.isNew ? "New Artifact" : "Artifact Inspector"}
        </Typography>
        
        <IconButton 
          size="small" 
          onClick={handleEditToggle}
          color={isEditing ? "error" : "primary"}
        >
          {isEditing ? <CancelIcon /> : <EditIcon />}
        </IconButton>
      </Box>
      
      <Divider sx={{ my: 1 }} />
      
      {isEditing ? (
        // Edit mode
        <Box>
          <TextField
            label="Title"
            fullWidth
            margin="dense"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            size="small"
            variant="outlined"
          />
          
          <FormControl fullWidth margin="dense" size="small">
            <InputLabel id="art-type-label">Artifact Type</InputLabel>
            <Select
              labelId="art-type-label"
              id="art-type"
              value={artType}
              label="Artifact Type"
              onChange={(e) => setArtType(e.target.value)}
            >
              {ARTIFACT_TYPES.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="subtitle2">Dependencies</Typography>
              <Button 
                size="small" 
                onClick={() => setDialogOpen(true)} 
                variant="outlined"
              >
                Select
              </Button>
            </Box>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
              {dependencyArtifacts.length > 0 ? (
                dependencyArtifacts.map(dep => (
                  <Chip
                    key={dep.document_id}
                    label={dep.title || dep.document_id}
                    onDelete={() => handleRemoveDependency(dep.document_id)}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No dependencies selected
                </Typography>
              )}
            </Box>
          </Box>
          
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              onClick={handleSave}
              startIcon={<SaveIcon />}
              size="small"
              sx={{ ml: 1 }}
            >
              Save
            </Button>
          </Box>
        </Box>
      ) : (
        // View mode
        <Box>
          {/* Show a message for new unsaved artifacts */}
          {artifact.isNew && (
            <Box sx={{ mb: 2, bgcolor: 'info.light', p: 1, borderRadius: 1 }}>
              <Typography variant="body2" color="info.contrastText">
                This is a new unsaved artifact. Click the edit icon to modify properties like type and dependencies. Changes will be included when you save in the editor.
              </Typography>
            </Box>
          )}
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Document ID
            </Typography>
            <Typography variant="body1">
              {artifact.document_id}
            </Typography>
          </Box>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Title
            </Typography>
            <Typography variant="body1">
              {artifact.title}
            </Typography>
          </Box>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Type
            </Typography>
            <Typography variant="body1">
              {ARTIFACT_TYPES.find(t => t.value === artifact.art_type)?.label || artifact.art_type}
            </Typography>
          </Box>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              File Format
            </Typography>
            <Typography variant="body1">
              {fileExtension}
            </Typography>
          </Box>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Dependencies
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
              {dependencyArtifacts.length > 0 ? (
                dependencyArtifacts.map(dep => (
                  <Chip
                    key={dep.document_id}
                    label={dep.title || dep.document_id}
                    size="small"
                    color="default"
                    variant="outlined"
                  />
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No dependencies
                </Typography>
              )}
            </Box>
          </Box>
          
          <Divider sx={{ my: 2 }} />
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Tooltip title={artifact.isNew ? "Save artifact first to enable download" : "Download Artifact"}>
              <span> {/* Wrap in span to show tooltip when disabled */}
                <IconButton 
                  onClick={handleDownload} 
                  color="primary" 
                  size="small"
                  disabled={artifact.isNew}
                >
                  <DownloadIcon />
                </IconButton>
              </span>
            </Tooltip>
          </Box>
        </Box>
      )}
      
      <ArtifactSelectDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        selectedArtifacts={dependencies}
        onSelect={handleDependencySelect}
      />
    </Paper>
  );
};

export default ArtifactInspector;