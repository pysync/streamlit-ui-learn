// src/components/Workspace/WorkspaceSidebar.js
import React, { useState, useEffect } from 'react';
import {
    Drawer,
    Toolbar,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Divider,
    Box,
    Fab,
    Tooltip,
    Typography,
} from '@mui/material';
import NoteIcon from '@mui/icons-material/Note';
import CodeIcon from '@mui/icons-material/Code';
import ImageIcon from '@mui/icons-material/Image';
import ApiIcon from '@mui/icons-material/Api';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import DescriptionIcon from '@mui/icons-material/Description';
import ListAltIcon from '@mui/icons-material/ListAlt';
import StorageIcon from '@mui/icons-material/Storage';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import AddIcon from '@mui/icons-material/Add';
import CreateArtifactDialog from '../Artifact/CreateArtifactDialog';
import ArtifactInspector from '../Artifact/ArtifactInspector';
import { useWorkspace } from '../../contexts/WorkspaceContext';
import { getArtifactTypeLabel } from '../../constants/artifactTypes';

const drawerWidth = 240;

// Helper function to get icon by artifact type
const getArtifactIcon = (artType) => {
  switch (artType) {
    case 'note':
      return <NoteIcon />;
    case 'document':
      return <DescriptionIcon />;
    case 'basic_design':
    case 'detail_design':
      return <DesignServicesIcon />;
    case 'api_list':
      return <ApiIcon />;
    case 'screen_list':
      return <ListAltIcon />;
    case 'database_schema':
      return <StorageIcon />;
    case 'sequence_diagram':
    case 'class_diagram':
      return <AccountTreeIcon />;
    default:
      return <DescriptionIcon />;
  }
};

const WorkspaceSidebar = () => {
    const [isCreateArtifactDialogOpen, setIsCreateArtifactDialogOpen] = useState(false);
    const { 
      artifacts, 
      addOpenedArtifact, 
      selectArtifact, 
      activeArtifactDocumentId,
      activeArtifact
    } = useWorkspace();

    const handleArtifactSelect = (artifact) => {
        addOpenedArtifact(artifact); // Add selected artifact to opened list
        selectArtifact(artifact.document_id); // Set active artifact in context
    };

    const handleCreateArtifactDialogOpen = () => {
        setIsCreateArtifactDialogOpen(true);
    };

    const handleCreateArtifactDialogClose = () => {
        setIsCreateArtifactDialogOpen(false);
    };

    const isEmpty = !(artifacts && artifacts.items && artifacts.items.length > 0);

    return (
        <Drawer
            sx={{
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                    overflow: 'auto', // Allow scrolling
                },
            }}
            variant="permanent"
            anchor="left"
        >
            <Toolbar />
            <Divider />

            {/* Artifact Inspector section */}
            {activeArtifact && (
              <ArtifactInspector artifact={activeArtifact} />
            )}

            {/* Working Documents section */}
            <Box sx={{ p: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                    Working Documents
                </Typography>
            </Box>
            <Divider />

            <List>
                {isEmpty ? (
                    <Box sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>
                        <Typography variant="body2">No artifacts yet.</Typography>
                    </Box>
                ) : (
                    artifacts.items.map((artifact) => (
                        <ListItem
                            key={artifact.id}
                            disablePadding
                            selected={activeArtifactDocumentId === artifact.document_id}
                        >
                            <ListItemButton onClick={() => handleArtifactSelect(artifact)}>
                                <ListItemIcon>
                                    {getArtifactIcon(artifact.art_type)}
                                </ListItemIcon>
                                <ListItemText 
                                  primary={artifact.title} 
                                  secondary={getArtifactTypeLabel(artifact.art_type)}
                                />
                            </ListItemButton>
                        </ListItem>
                    ))
                )}
            </List>

            <Divider />
            <Box sx={{ p: 2, textAlign: 'center' }}>
                <Tooltip title="Create New Artifact">
                    <Fab color="primary" aria-label="add" onClick={handleCreateArtifactDialogOpen}>
                        <AddIcon />
                    </Fab>
                </Tooltip>
            </Box>

            <CreateArtifactDialog
                open={isCreateArtifactDialogOpen}
                onClose={handleCreateArtifactDialogClose}
            />
        </Drawer>
    );
};

export default WorkspaceSidebar;