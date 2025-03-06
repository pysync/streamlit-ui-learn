// src/components/Workspace/WorkspaceSidebar.js
import React, { useState } from 'react';
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
    Typography, // Import Typography for header
} from '@mui/material';
import NoteIcon from '@mui/icons-material/Note';
import CodeIcon from '@mui/icons-material/Code';
import ImageIcon from '@mui/icons-material/Image';
import AddIcon from '@mui/icons-material/Add';
import CreateArtifactDialog from '../Artifact/CreateArtifactDialog';
import { useWorkspace } from '../../contexts/WorkspaceContext'; // Import useWorkspace

const drawerWidth = 240;

const WorkspaceSidebar = () => {
    const [selectedArtifact, setSelectedArtifact] = useState(null);
    const [isCreateArtifactDialogOpen, setIsCreateArtifactDialogOpen] = useState(false);
    const { artifacts, addOpenedArtifact, setActiveArtifact } = useWorkspace(); // Consume artifacts from context

    const handleArtifactSelect = (artifact) => {
        setSelectedArtifact(artifact);
        console.log("Selected Artifact:", artifact);
        addOpenedArtifact(artifact); // Add selected artifact to opened list
        setActiveArtifact(artifact.document_id); // Set active artifact in context
    };

    const handleCreateArtifactDialogOpen = () => {
        setIsCreateArtifactDialogOpen(true);
    };

    const handleCreateArtifactDialogClose = () => {
        setIsCreateArtifactDialogOpen(false);
    };

    const isEmpty = !(artifacts && artifacts.items && artifacts.items.length > 0)

    return (
        <Drawer
            sx={{
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                },
            }}
            variant="permanent"
            anchor="left"
        >
            <Toolbar />
            <Divider />

            {/* Sidebar Header */}
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
                ) :
                    (artifacts.items.map((artifact, index) => (
                        <ListItem
                            key={artifact.id}
                            disablePadding
                            selected={selectedArtifact?.id === artifact.id}
                        >
                            <ListItemButton onClick={() => handleArtifactSelect(artifact)}>
                                <ListItemIcon>
                                    {index % 2 === 0 ? <NoteIcon /> : <CodeIcon />}
                                </ListItemIcon>
                                <ListItemText primary={artifact.title} />
                            </ListItemButton>
                        </ListItem>
                    )))
                }
            </List>


            <Divider />
            <Box sx={{ p: 2, textAlign: 'center' }}>
                <Tooltip title="Create New Artifact">
                    <Fab color="primary" aria-label="add" onClick={handleCreateArtifactDialogOpen}>
                        <AddIcon />
                    </Fab>
                </Tooltip>
            </Box>

            <CreateArtifactDialog // Dialog inside Sidebar component
                open={isCreateArtifactDialogOpen}
                onClose={handleCreateArtifactDialogClose}
            />
        </Drawer>
    );
};

export default WorkspaceSidebar;