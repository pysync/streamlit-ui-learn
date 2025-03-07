// src/pages/WorkingSpacePage.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
    Box,
    AppBar,
    Toolbar,
    Typography,
    Tabs,
    Tab,
    IconButton,
    Button,
    Menu,
    MenuItem,
    Divider,
    Tooltip,
    Badge,
    Chip,
    useTheme,
    ToggleButtonGroup,
    ToggleButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SaveIcon from '@mui/icons-material/Save';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import CloseIcon from '@mui/icons-material/Close';
import { WorkspaceProvider, useWorkspace } from '../contexts/WorkspaceContext';
import ProjectPlanTab from '../components/ProjectPlan/ProjectPlanTab';
import CreateArtifactDialog from '../components/Artifact/CreateArtifactDialog';
import WorkspaceSidebar from '../components/Workspace/WorkspaceSidebar';
import { ARTIFACT_TYPE_TO_PHASE, SDLC_PHASES, PHASE_LABELS, ARTIFACT_TYPES, ARTIFACT_TYPE_LABELS } from '../constants/sdlcPhases';
import { useEditor } from '../contexts/EditorContext';
import TableRowsIcon from '@mui/icons-material/TableRows';
import VerticalSplitIcon from '@mui/icons-material/VerticalSplit';
import HorizontalSplitIcon from '@mui/icons-material/HorizontalSplit';
import ButtonGroup from '@mui/material/ButtonGroup';

const drawerWidth = 240;

const WorkingSpacePage = () => {
    const { workspaceId } = useParams();
    const [layoutMode, setLayoutMode] = useState('single'); // 'single', 'vertical', 'horizontal'
    
    if (!workspaceId) {
        return <div>Error: No Workspace ID provided.</div>;
    }


    return (
        <WorkspaceProvider workspaceId={workspaceId}>
            <WorkingSpaceContent />
        </WorkspaceProvider>
    );
};

// Create a new component for the content that uses the workspace context
const WorkingSpaceContent = () => {
    const { 
        currentWorkspace, 
        openedArtifacts, 
        activeArtifacts,
        activeArtifactDocumentId,
        selectArtifact,
        removeOpenedArtifact,
        activeArtifact,
        fetchArtifacts
    } = useWorkspace();
    
    const [currentPhase, setCurrentPhase] = useState(SDLC_PHASES.PLANNING);
    const [isCreateArtifactDialogOpen, setIsCreateArtifactDialogOpen] = useState(false);
    const [contextMenuAnchorEl, setContextMenuAnchorEl] = useState(null);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [layoutMode, setLayoutMode] = useState('single'); // 'single', 'vertical', 'horizontal'
    
    const theme = useTheme();
    const { triggerSave, triggerFullscreen } = useEditor();

    // Filter artifacts by the current SDLC phase
    const filteredArtifacts = openedArtifacts.filter(artifact => {
        // If no art_type is set (like for new artifacts), default to showing in Planning
        if (!artifact.art_type) return currentPhase === SDLC_PHASES.PLANNING;
        
        // Otherwise, check if the artifact type belongs to the current phase
        const artifactPhase = ARTIFACT_TYPE_TO_PHASE[artifact.art_type] || SDLC_PHASES.PLANNING;
        return artifactPhase === currentPhase;
    });

    const handlePhaseChange = (event, newPhase) => {
        if (newPhase !== null) {
            setCurrentPhase(newPhase);
        }
    };

    const handleArtifactSelect = (event, newValue) => {
        if (newValue !== null) {
            selectArtifact(newValue);
        }
    };

    const handleCreateArtifactDialogOpen = () => {
        setIsCreateArtifactDialogOpen(true);
    };

    const handleCreateArtifactDialogClose = () => {
        setIsCreateArtifactDialogOpen(false);
    };

    const handleContextMenu = (event) => {
        setContextMenuAnchorEl(event.currentTarget);
    };

    const handleContextMenuClose = () => {
        setContextMenuAnchorEl(null);
    };

    const handleCloseArtifact = (documentId, event) => {
        event.stopPropagation();
        removeOpenedArtifact(documentId);
    };

    const toggleFullScreen = () => {
        setIsFullScreen(!isFullScreen);
    };

    // Add this function to handle save action
    const handleSaveArtifact = () => {
        if (!activeArtifact) return;
        
        // Get the ProjectPlanTab component to handle the save
        // This is a temporary solution - in a real app, you'd use refs or context
        const projectPlanTabElement = document.getElementById('project-plan-tab');
        if (projectPlanTabElement && projectPlanTabElement.__reactProps$) {
            // Access the component's save function if available
            const saveFunction = projectPlanTabElement.__reactProps$.onSave;
            if (typeof saveFunction === 'function') {
                saveFunction();
            }
        } else {
            console.log('Save button clicked, but no handler available');
        }
    };

    // Determine which content to show based on the active artifact
    const renderContent = () => {
        if (!activeArtifact) {
            return (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <Typography variant="h6" color="text.secondary">
                        Select an artifact or create a new one
                    </Typography>
                </Box>
            );
        }

        // For now, we'll just show the ProjectPlanTab for all artifacts
        // In a real implementation, you'd switch based on artifact type
        return <ProjectPlanTab layoutMode={layoutMode} />;
    };

    return (
        <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
            {/* Sidebar */}
            <WorkspaceSidebar />
            
            {/* Main Content */}
            <Box
                component="main"
                sx={{ 
                    flexGrow: 1, 
                    ml: `${drawerWidth}px`, 
                    width: `calc(100% - ${drawerWidth}px)`,
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    overflow: 'hidden'
                }}
            >
                {/* Unified Top AppBar */}
                <AppBar 
                    position="static" 
                    color="default" 
                    elevation={1}
                    sx={{ zIndex: theme.zIndex.drawer + 1 }}
                >
                    <Toolbar sx={{ justifyContent: 'space-between' }}>
                        {/* Workspace Title */}
                        <Typography variant="h6" noWrap component="div">
                            {currentWorkspace ? currentWorkspace.title : 'Loading Workspace...'}
                        </Typography>
                        
                        {/* SDLC Phase Selector */}
                        <ToggleButtonGroup
                            value={currentPhase}
                            exclusive
                            onChange={handlePhaseChange}
                            aria-label="sdlc phase"
                            size="small"
                            sx={{ mx: 2 }}
                        >
                            <ToggleButton value={SDLC_PHASES.PLANNING} aria-label="planning">
                                {PHASE_LABELS[SDLC_PHASES.PLANNING]}
                            </ToggleButton>
                            <ToggleButton value={SDLC_PHASES.REQUIREMENTS} aria-label="requirements">
                                {PHASE_LABELS[SDLC_PHASES.REQUIREMENTS]}
                            </ToggleButton>
                            <ToggleButton value={SDLC_PHASES.DESIGN} aria-label="design">
                                {PHASE_LABELS[SDLC_PHASES.DESIGN]}
                            </ToggleButton>
                        </ToggleButtonGroup>
                        
                        {/* Context-Sensitive Actions */}
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {activeArtifact && (
                                <>
                                    <Tooltip title="Save">
                                        <IconButton 
                                            color="inherit" 
                                            size="small" 
                                            sx={{ mr: 1 }}
                                            onClick={triggerSave}
                                        >
                                            <SaveIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title={isFullScreen ? "Exit Fullscreen" : "Fullscreen"}>
                                        <IconButton 
                                            color="inherit" 
                                            size="small" 
                                            sx={{ mr: 1 }}
                                            onClick={triggerFullscreen}
                                        >
                                            <FullscreenIcon />
                                        </IconButton>
                                    </Tooltip>
                                </>
                            )}
                            <Tooltip title="Create New Artifact">
                                <IconButton 
                                    color="primary" 
                                    onClick={handleCreateArtifactDialogOpen}
                                    size="small"
                                >
                                    <AddIcon />
                                </IconButton>
                            </Tooltip>
                            <IconButton 
                                color="inherit" 
                                onClick={handleContextMenu}
                                size="small"
                            >
                                <MoreVertIcon />
                            </IconButton>
                            <Menu
                                anchorEl={contextMenuAnchorEl}
                                open={Boolean(contextMenuAnchorEl)}
                                onClose={handleContextMenuClose}
                            >
                                <MenuItem onClick={handleContextMenuClose}>Workspace Settings</MenuItem>
                                <MenuItem onClick={handleContextMenuClose}>Export All Artifacts</MenuItem>
                                <Divider />
                                <MenuItem onClick={handleContextMenuClose}>Help</MenuItem>
                            </Menu>
                        </Box>
                    </Toolbar>
                </AppBar>
                
                {/* Artifact Sub-Navigation Bar */}
                <Box sx={{ 
                    borderBottom: 1, 
                    borderColor: 'divider',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <Tabs 
                        value={activeArtifactDocumentId || false} 
                        onChange={handleArtifactSelect}
                        variant="scrollable"
                        scrollButtons="auto"
                    >
                        {filteredArtifacts.map((artifact) => (
                            <Tab
                                key={artifact.document_id}
                                label={
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        {artifact.title || 'Untitled'}
                                        <IconButton
                                            size="small"
                                            onClick={(e) => handleCloseArtifact(artifact.document_id, e)}
                                            sx={{ ml: 1 }}
                                        >
                                            <CloseIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                }
                                value={artifact.document_id}
                            />
                        ))}
                    </Tabs>

                    {/* Layout Controls */}
                    <ButtonGroup size="small" variant="outlined" sx={{ ml: 2 }}>
                        <Tooltip title="Single Panel">
                            <IconButton 
                                onClick={() => setLayoutMode('single')}
                                color={layoutMode === 'single' ? "primary" : "default"}
                            >
                                <TableRowsIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Split Vertical">
                            <IconButton 
                                onClick={() => setLayoutMode('vertical')}
                                color={layoutMode === 'vertical' ? "primary" : "default"}
                            >
                                <VerticalSplitIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Split Horizontal">
                            <IconButton 
                                onClick={() => setLayoutMode('horizontal')}
                                color={layoutMode === 'horizontal' ? "primary" : "default"}
                            >
                                <HorizontalSplitIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </ButtonGroup>
                </Box>
                
                {/* Main Content Area */}
                <Box sx={{ 
                    flexGrow: 1, 
                    overflow: 'auto',
                    p: 2,
                    ...(isFullScreen && {
                        position: 'fixed',
                        top: 0,
                        left: drawerWidth,
                        right: 0,
                        bottom: 0,
                        zIndex: theme.zIndex.drawer + 2,
                        bgcolor: 'background.paper',
                        p: 3
                    })
                }}>
                    {renderContent()}
                </Box>
            </Box>
            
            {/* Create Artifact Dialog */}
            <CreateArtifactDialog
                open={isCreateArtifactDialogOpen}
                onClose={handleCreateArtifactDialogClose}
            />
        </Box>
    );
};

export default WorkingSpacePage;