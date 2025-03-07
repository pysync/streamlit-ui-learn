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
import ArtifactVersionsDialog from './ArtifactVersionsDialog';
import { useWorkspace } from '../../contexts/WorkspaceContext';
import { useLoading } from '../../contexts/LoadingContext';
import { useMessage } from '../../contexts/MessageContext';
import { ARTIFACT_TYPES, getFileExtension, getArtifactTypeLabel, ARTIFACT_TYPE_OPTIONS, ARTIFACT_TYPE_TO_PHASE, PHASE_LABELS } from '../../constants/sdlcConstants';
import { setArtifactMeta, downloadArtifact } from '../../services/client';
import { isEqual } from 'lodash'; // For deep comparison of objects

/**
 * Component that displays and allows editing of artifact properties
 * @param {object} artifact - The artifact to inspect/edit
 */
const ArtifactInspector = ({ artifact }) => {
  const [title, setTitle] = useState('');
  const [artType, setArtType] = useState('');
  const [dependencies, setDependencies] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dependencyArtifacts, setDependencyArtifacts] = useState([]);
  const [isDirty, setIsDirty] = useState(false); // New state to track changes
  
  const [originalValues, setOriginalValues] = useState({});

  const { execUpdateArtifact, artifacts, updateOpenedArtifactInList } = useWorkspace();
  const { showLoading, hideLoading } = useLoading();
  const { showMessage, showError } = useMessage();

  // Add new state for versions dialog
  const [versionsDialogOpen, setVersionsDialogOpen] = useState(false);

  // Load artifact data when component receives a new artifact
  useEffect(() => {
    if (artifact) {
      const newValues = {
        title: artifact.title || '',
        artType: artifact.art_type || '',
        dependencies: artifact.dependencies || []
      };
      
      setTitle(newValues.title);
      setArtType(newValues.artType);
      setDependencies(newValues.dependencies);
      setOriginalValues(newValues);
      setIsDirty(false);
    }
  }, [artifact]);

  // Check for changes whenever form values change
  useEffect(() => {
    const currentValues = {
      title,
      artType,
      dependencies
    };
    
    setIsDirty(!isEqual(currentValues, originalValues));
  }, [title, artType, dependencies, originalValues]);

  // Find the dependency artifacts when dependencies change
  useEffect(() => {
    if (dependencies && dependencies.length > 0 && artifacts && artifacts.items) {
      const deps = artifacts.items.filter(a => dependencies.includes(a.id));
      setDependencyArtifacts(deps);
    } else {
      setDependencyArtifacts([]);
    }
  }, [dependencies, artifacts]);

  const handleSave = async () => {
    if (!title.trim()) {
      showError('Title cannot be empty');
      return;
    }

    showLoading();
    try {
      if (artifact.isNew) {
        const updatedArtifact = {
          ...artifact,
          title,
          art_type: artType,
          dependencies
        };
        updateOpenedArtifactInList(updatedArtifact);
        showMessage('Properties updated. Save in editor to create the artifact.', 'success');
      } else {
        const artifactData = {
          title,
          content: null,
          dependencies
        };
        await execUpdateArtifact(artifact.document_id, artifactData);
        showMessage('Artifact updated successfully', 'success');
      }
      setIsDirty(false);
      setOriginalValues({ title, artType, dependencies });
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

  // Add grouping function
  const groupedOptions = ARTIFACT_TYPE_OPTIONS.reduce((acc, option) => {
    const phase = ARTIFACT_TYPE_TO_PHASE[option.value];
    if (!acc[phase]) {
      acc[phase] = [];
    }
    acc[phase].push(option);
    return acc;
  }, {});

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 2 
      }}>
        <Typography variant="subtitle1" color="text.secondary">
          Inspector
        </Typography>
        {!artifact.isNew && (
          <Tooltip title="Download Artifact">
            <IconButton 
              size="small" 
              onClick={handleDownload}
            >
              <DownloadIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      {/* Form Content */}
      <Box component="form" sx={{ mt: 1 }}>
        {/* Add Version Info after Title */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1,
          mb: 1 
        }}>
          <Typography variant="body2" color="text.secondary">
            Version: {artifact.version || 1}
          </Typography>
          {artifact.version > 1 && (
            <Button
              variant="text"
              size="small"
              onClick={() => setVersionsDialogOpen(true)}
              sx={{ 
                minWidth: 'auto', 
                textTransform: 'none',
                py: 0,
                px: 1,
                mr: 1,
                fontSize: '0.75rem',
                color: 'primary.main',
                '&:hover': {
                    backgroundColor: 'transparent',
                    textDecoration: 'underline'
                }
                }}
            >
              (versions)
            </Button>
          )}
        </Box>

        <TextField
          label="Title"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          size="small"
          margin="dense"
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
            {Object.entries(groupedOptions).map(([phase, options]) => [
              <Divider key={`divider-${phase}`}>
                <Typography variant="caption" color="text.secondary">
                  {PHASE_LABELS[phase]}
                </Typography>
              </Divider>,
              ...options.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))
            ])}
          </Select>
        </FormControl>
        
        {/* Dependencies Section */}
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
        
        {/* Centered Save Button */}
        {isDirty && (
          <Box sx={{ 
            mt: 2, 
            display: 'flex', 
            justifyContent: 'center' // Center the save button
          }}>
            <Button
              variant="contained"
              size="small"
              startIcon={<SaveIcon />}
              onClick={handleSave}
            >
              Save Changes
            </Button>
          </Box>
        )}

        {/* Add Versions Dialog */}
        <ArtifactVersionsDialog
          open={versionsDialogOpen}
          onClose={() => setVersionsDialogOpen(false)}
          documentId={artifact.document_id}
          currentVersion={artifact.version}
        />
      </Box>
      
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