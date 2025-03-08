// src/pages/WorkingSpacePage.js
import React, { useState, useEffect, useRef } from 'react';
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
import WorkspacePhasesSidebar from '../components/Workspace/WorkspacePhasesSidebar';
import { ARTIFACT_TYPE_TO_PHASE, SDLC_PHASES, PHASE_LABELS, ARTIFACT_TYPES, ARTIFACT_TYPE_LABELS } from '../constants/sdlcConstants';
import { useEditor } from '../contexts/EditorContext';
import TableRowsIcon from '@mui/icons-material/TableRows';
import VerticalSplitIcon from '@mui/icons-material/VerticalSplit';
import HorizontalSplitIcon from '@mui/icons-material/HorizontalSplit';
import ViewQuiltIcon from '@mui/icons-material/ViewQuilt';
import ButtonGroup from '@mui/material/ButtonGroup';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import ArtifactTypesSettingsDialog from '../components/Settings/ArtifactTypesSettingsDialog';
import InfoIcon from '@mui/icons-material/Info';
import ArtifactGuide from '../components/Guide/ArtifactGuide';
import ArtifactTypeList from '../components/Artifact/ArtifactTypeList';

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
        fetchArtifacts,
        showArtifactTypeList
    } = useWorkspace();
    
    const [currentPhase, setCurrentPhase] = useState(SDLC_PHASES.PLANNING);
    const [isCreateArtifactDialogOpen, setIsCreateArtifactDialogOpen] = useState(false);
    const [contextMenuAnchorEl, setContextMenuAnchorEl] = useState(null);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [layoutMode, setLayoutMode] = useState('single'); // 'single', 'vertical', 'horizontal'
    const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false);
    const [showGuide, setShowGuide] = useState(true);
    const tabsRef = useRef(null);
    
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

    const handlePhaseChange = (newPhase) => {
        setCurrentPhase(newPhase);
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
        if (showArtifactTypeList) {
            return <ArtifactTypeList artifactType={showArtifactTypeList} />;
        }

        if (showGuide && (!activeArtifactDocumentId || activeArtifactDocumentId === 'guide')) {
            return <ArtifactGuide />;
        }
        
        if (!activeArtifact) {
            return (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <Typography variant="h6" color="text.secondary">
                        Select an artifact or create a new one
                    </Typography>
                </Box>
            );
        }

        return <ProjectPlanTab layoutMode={layoutMode} />;
    };

    const handleScrollTabs = (direction) => {
        if (tabsRef.current) {
            const scrollAmount = 200;
            tabsRef.current.scrollLeft += direction === 'left' ? -scrollAmount : scrollAmount;
        }
    };

    // Add this function to check if a tab exists
    const getTabValue = () => {
        if (showArtifactTypeList) {
            return 'type-list';
        }
        if (showGuide && (!activeArtifactDocumentId || !openedArtifacts.find(art => art.document_id === activeArtifactDocumentId))) {
            return 'guide';
        }
        return activeArtifactDocumentId || false;
    };

    return (
        <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
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
                {/* Thin AppBar */}
                <AppBar 
                    position="static" 
                    color="default" 
                    elevation={1}
                    sx={{ 
                        height: 48,
                        minHeight: 48,
                        '& .MuiToolbar-root': {
                            minHeight: 48,
                            height: 48,
                            px: 1
                        }
                    }}
                >
                    <Toolbar sx={{ justifyContent: 'space-between' }}>
                        {/* Scrollable Tabs with Arrows */}
                        <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            flex: 1,
                            overflow: 'hidden'
                        }}>
                            <IconButton 
                                size="small" 
                                onClick={() => handleScrollTabs('left')}
                                sx={{ p: 0.5 }}
                            >
                                <KeyboardArrowLeftIcon />
                            </IconButton>
                            
                            <Box
                                ref={tabsRef}
                                sx={{
                                    overflow: 'hidden',
                                    flex: 1,
                                    whiteSpace: 'nowrap',
                                    scrollBehavior: 'smooth'
                                }}
                            >
                                <Tabs
                                    value={getTabValue()}
                                    onChange={handleArtifactSelect}
                                    variant="scrollable"
                                    scrollButtons={false}
                                    sx={{ 
                                        minHeight: 48,
                                        '& .MuiTab-root': {
                                            minHeight: 48,
                                            py: 0
                                        }
                                    }}
                                >
                                    {showGuide && (
                                        <Tab
                                            label={
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <InfoIcon sx={{ mr: 1, fontSize: 20 }} />
                                                    Guide
                                                    <IconButton
                                                        size="small"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setShowGuide(false);
                                                        }}
                                                        sx={{ ml: 1, p: 0.5 }}
                                                    >
                                                        <CloseIcon fontSize="small" />
                                                    </IconButton>
                                                </Box>
                                            }
                                            value="guide"
                                        />
                                    )}
                                    {showArtifactTypeList && (
                                        <Tab
                                            label="Type List"
                                            value="type-list"
                                        />
                                    )}
                                    {openedArtifacts.map((artifact) => (
                                        <Tab
                                            key={artifact.document_id}
                                            label={
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    {artifact.title || 'Untitled'}
                                                    <IconButton
                                                        size="small"
                                                        onClick={(e) => handleCloseArtifact(artifact.document_id, e)}
                                                        sx={{ ml: 1, p: 0.5 }}
                                                    >
                                                        <CloseIcon fontSize="small" />
                                                    </IconButton>
                                                </Box>
                                            }
                                            value={artifact.document_id}
                                        />
                                    ))}
                                </Tabs>
                            </Box>
                            
                            <IconButton 
                                size="small" 
                                onClick={() => handleScrollTabs('right')}
                                sx={{ p: 0.5 }}
                            >
                                <KeyboardArrowRightIcon />
                            </IconButton>
                        </Box>

                        {/* Right-side Controls */}
                        <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                            {/* Layout Controls */}
                            <ButtonGroup size="small" variant="outlined">
                                <Tooltip title="Notes Only">
                                    <IconButton 
                                        onClick={() => setLayoutMode('single')}
                                        color={layoutMode === 'single' ? "primary" : "default"}
                                        size="small"
                                    >
                                        <TableRowsIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Split View">
                                    <IconButton 
                                        onClick={() => setLayoutMode('vertical')}
                                        color={layoutMode === 'vertical' ? "primary" : "default"}
                                        size="small"
                                    >
                                        <VerticalSplitIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Horizontal Split">
                                    <IconButton 
                                        onClick={() => setLayoutMode('horizontal')}
                                        color={layoutMode === 'horizontal' ? "primary" : "default"}
                                        size="small"
                                    >
                                        <HorizontalSplitIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Wireframe Only">
                                    <IconButton 
                                        onClick={() => setLayoutMode('wireframe')}
                                        color={layoutMode === 'wireframe' ? "primary" : "default"}
                                        size="small"
                                    >
                                        <ViewQuiltIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </ButtonGroup>

                            <Tooltip title="Show Guide">
                                <IconButton 
                                    size="small" 
                                    onClick={() => setShowGuide(true)}
                                    sx={{ mr: 1 }}
                                >
                                    <InfoIcon />
                                </IconButton>
                            </Tooltip>

                            <IconButton 
                                size="small"
                                onClick={handleContextMenu}
                                sx={{ ml: 1 }}
                            >
                                <MoreVertIcon />
                            </IconButton>
                            
                            <Menu
                                anchorEl={contextMenuAnchorEl}
                                open={Boolean(contextMenuAnchorEl)}
                                onClose={handleContextMenuClose}
                            >
                                <MenuItem onClick={() => {
                                    setIsSettingsDialogOpen(true);
                                    handleContextMenuClose();
                                }}>
                                    Artifact Types Settings
                                </MenuItem>
                                <MenuItem onClick={handleContextMenuClose}>Workspace Settings</MenuItem>
                                <Divider />
                                <MenuItem onClick={handleContextMenuClose}>Help</MenuItem>
                            </Menu>
                        </Box>
                    </Toolbar>
                </AppBar>

                {/* Main Content Area */}
                <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
                    {renderContent()}
                </Box>
            </Box>
            
            {/* Add the new phases sidebar */}
            <WorkspacePhasesSidebar 
                currentPhase={currentPhase}
                onPhaseChange={handlePhaseChange}
            />
            
            {/* Create Artifact Dialog */}
            <CreateArtifactDialog
                open={isCreateArtifactDialogOpen}
                onClose={handleCreateArtifactDialogClose}
            />

            {/* Settings Dialog */}
            <ArtifactTypesSettingsDialog
                open={isSettingsDialogOpen}
                onClose={() => setIsSettingsDialogOpen(false)}
            />
        </Box>
    );
};

export default WorkingSpacePage;