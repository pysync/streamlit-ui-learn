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
    IconButton,
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
import FilterListIcon from '@mui/icons-material/FilterList';
import CreateArtifactDialog from '../Artifact/CreateArtifactDialog';
import ArtifactInspector from '../Artifact/ArtifactInspector';
import { useWorkspace } from '../../contexts/WorkspaceContext';
import { getArtifactTypeLabel, getArtifactIcon } from '../../constants/sdlcConstants';
import { useNavigate } from 'react-router-dom';
import LogoDevIcon from '@mui/icons-material/LogoDev';
import SearchArtifactDialog from './SearchArtifactDialog';

const drawerWidth = 240;


const WorkspaceSidebar = () => {
    const [isCreateArtifactDialogOpen, setIsCreateArtifactDialogOpen] = useState(false);
    const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false);
    const { 
      artifacts, 
      addOpenedArtifact, 
      selectArtifact, 
      activeArtifactDocumentId,
      activeArtifact
    } = useWorkspace();
    const navigate = useNavigate();

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

    const handleLogoClick = () => {
        navigate('/');
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
            <Box 
                sx={{ 
                    p: 2, 
                    display: 'flex', 
                    alignItems: 'center', 
                    cursor: 'pointer',
                    '&:hover': {
                        bgcolor: 'action.hover',
                    },
                }}
                onClick={handleLogoClick}
            >
                <LogoDevIcon 
                    sx={{ 
                        fontSize: 40, 
                        color: 'primary.main',
                        mr: 1 
                    }} 
                />
                <Typography 
                    variant="h6" 
                    color="primary"
                    sx={{ 
                        fontWeight: 'bold',
                        letterSpacing: 1 
                    }}
                >
                    SD-TOOL
                </Typography>
            </Box>
            <Divider />

            {/* Artifact Inspector section */}
            {activeArtifact && (
              <ArtifactInspector artifact={activeArtifact} />
            )}

            {/* Working Documents section with filter button */}
            <Box sx={{ 
                p: 2, 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center' 
            }}>
                <Typography variant="subtitle1" gutterBottom sx={{ mb: 0 }}>
                    Working Documents
                </Typography>
                <Tooltip title="Search & Filter">
                    <IconButton 
                        size="small" 
                        onClick={() => setIsSearchDialogOpen(true)}
                    >
                        <FilterListIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
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

            {/* Add Search Dialog */}
            <SearchArtifactDialog
                open={isSearchDialogOpen}
                onClose={() => setIsSearchDialogOpen(false)}
                onSelect={handleArtifactSelect}
            />
        </Drawer>
    );
};

export default WorkspaceSidebar;