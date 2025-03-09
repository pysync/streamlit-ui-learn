import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { 
  Box, 
  CircularProgress, 
  Alert, 
  Paper,
  Backdrop,
  Snackbar
} from '@mui/material';

// Import renderer component
import ArtifactRenderer from './ArtifactRenderer';

// Import services
import { getArtifactById, updateArtifact, updateArtifactContent } from '../../services/apiService';
import { getArtifactById as getMockArtifact, updateArtifact as updateMockArtifact } from '../../services/mockDataService';

/**
 * Container component for viewing and editing a single artifact
 */
const ArtifactDetailsView = ({
  artifactId,
  isEditable = false,
  useMockData = false, // For development/testing
  onNavigate,
  onClose
}) => {
  // State
  const [artifact, setArtifact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });
  
  // Fetch artifact data
  useEffect(() => {
    const fetchArtifact = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const service = useMockData ? getMockArtifact : getArtifactById;
        const artifactData = await service(artifactId);
        setArtifact(artifactData);
      } catch (err) {
        console.error('Error fetching artifact:', err);
        setError('Failed to load artifact. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    if (artifactId) {
      fetchArtifact();
    }
  }, [artifactId, useMockData]);
  
  // Handle artifact updates
  const handleUpdate = async (updates) => {
    setSaving(true);
    
    try {
      const service = useMockData ? updateMockArtifact : updateArtifact;
      const updatedArtifact = await service(artifactId, updates);
      setArtifact(updatedArtifact);
      
      setNotification({
        open: true,
        message: 'Artifact updated successfully',
        severity: 'success'
      });
    } catch (err) {
      console.error('Error updating artifact:', err);
      setNotification({
        open: true,
        message: 'Failed to update artifact',
        severity: 'error'
      });
    } finally {
      setSaving(false);
    }
  };
  
  // Handle artifact content updates
  const handleContentUpdate = async (content) => {
    setSaving(true);
    
    try {
      const service = useMockData ? updateMockArtifact : updateArtifactContent;
      const updatedArtifact = await service(artifactId, { content });
      setArtifact(updatedArtifact);
      
      setNotification({
        open: true,
        message: 'Content updated successfully',
        severity: 'success'
      });
    } catch (err) {
      console.error('Error updating content:', err);
      setNotification({
        open: true,
        message: 'Failed to update content',
        severity: 'error'
      });
    } finally {
      setSaving(false);
    }
  };
  
  // Handle notification close
  const handleNotificationClose = () => {
    setNotification({ ...notification, open: false });
  };
  
  // Display loading state
  if (loading && !artifact) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          height: '100%',
          p: 4
        }}
      >
        <CircularProgress />
      </Box>
    );
  }
  
  // Display error state
  if (error && !artifact) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          height: '100%',
          p: 4
        }}
      >
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }
  
  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {artifact && (
        <ArtifactRenderer
          artifact={artifact}
          isEditable={isEditable}
          onUpdate={handleUpdate}
          onContentUpdate={handleContentUpdate}
          loadingOverride={loading}
        />
      )}
      
      {/* Saving indicator */}
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={saving}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      
      {/* Notification */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleNotificationClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleNotificationClose} severity={notification.severity}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

ArtifactDetailsView.propTypes = {
  artifactId: PropTypes.string.isRequired,
  isEditable: PropTypes.bool,
  useMockData: PropTypes.bool,
  onNavigate: PropTypes.func,
  onClose: PropTypes.func
};

export default ArtifactDetailsView; 