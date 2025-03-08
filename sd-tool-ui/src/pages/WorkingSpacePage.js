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
import { ARTIFACT_TYPE_TO_PHASE, SDLC_PHASES, PHASE_LABELS, ARTIFACT_TYPES, ARTIFACT_TYPE_LABELS, getArtifactIcon, getArtifactTypeLabel } from '../constants/sdlcConstants';
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
        showArtifactTypeList,
        setShowArtifactTypeList,
        setActiveArtifactDocumentId,
        addOpenedArtifact
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

    // Fix Bug 1: Use a controlled state approach for tabs
    const [openTabs, setOpenTabs] = useState({
        guide: true,
        typeList: null,
        artifacts: []
    });
    const [activeTabId, setActiveTabId] = useState('guide');

    // Keep WorkspaceContext in sync with our tab state
    useEffect(() => {
        // Only set this when we're activating an artifact tab
        if (activeTabId !== 'guide' && activeTabId !== 'typeList') {
            setActiveArtifactDocumentId(activeTabId);
        } else {
            // Clear active artifact when not on an artifact tab
            setActiveArtifactDocumentId(null);
        }
    }, [activeTabId, setActiveArtifactDocumentId]);

    // Fix Bug 3: Sync sidebar selection with our tab state
    useEffect(() => {
        if (activeArtifactDocumentId && activeArtifactDocumentId !== 'guide' && activeArtifactDocumentId !== 'typeList') {
            // Add to our tabs if not already there
            setOpenTabs(prev => {
                if (!prev.artifacts.includes(activeArtifactDocumentId)) {
                    return {
                        ...prev,
                        artifacts: [...prev.artifacts, activeArtifactDocumentId]
                    };
                }
                return prev;
            });
            
            // Make it the active tab
            setActiveTabId(activeArtifactDocumentId);
        }
    }, [activeArtifactDocumentId, openedArtifacts]);

    // Completely separate tab selection from artifact selection
    const handleTabSelect = (event, tabId) => {
        if (tabId) {
            setActiveTabId(tabId);
            
            // Keep WorkspaceContext in sync
            if (tabId !== 'guide' && tabId !== 'typeList') {
                setActiveArtifactDocumentId(tabId);
            } else {
                setActiveArtifactDocumentId(null);
            }
        }
    };
    
    // Fix the close artifact handler to properly remove tabs
    const handleCloseArtifact = (documentId, e) => {
        e?.stopPropagation();
        
        // First update our local tab state
        setOpenTabs(prev => ({
            ...prev,
            artifacts: prev.artifacts.filter(id => id !== documentId)
        }));
        
        // If closing the active tab, switch to another tab
        if (activeTabId === documentId) {
            const remainingArtifacts = openTabs.artifacts.filter(id => id !== documentId);
            if (remainingArtifacts.length > 0) {
                setActiveTabId(remainingArtifacts[remainingArtifacts.length - 1]);
            } else if (openTabs.guide) {
                setActiveTabId('guide');
            } else if (openTabs.typeList) {
                setActiveTabId('typeList');
            }
        }
        
        // Then update WorkspaceContext
        removeOpenedArtifact(documentId);
    };

    // Fix Bug 2: Consistent artifact opening
    const handleOpenArtifact = (artifact) => {
        // First add to workspace context
        addOpenedArtifact(artifact);
        
        // Then update our local tab state
        setOpenTabs(prev => {
            if (!prev.artifacts.includes(artifact.document_id)) {
                return {
                    ...prev,
                    artifacts: [...prev.artifacts, artifact.document_id]
                };
            }
            return prev;
        });
        
        // Finally set as active
        setActiveTabId(artifact.document_id);
    };
    
    // Use our internal state for tab values
    // instead of trying to derive it from WorkspaceContext
    const renderContent = () => {
        if (activeTabId === 'guide') {
            return <ArtifactGuide onOpenTypeList={handleOpenTypeList} onOpenArtifact={handleOpenArtifact} />;
        }
        
        if (activeTabId === 'typeList' && openTabs.typeList) {
            return <ArtifactTypeList artifactType={openTabs.typeList} onOpenArtifact={handleOpenArtifact} />;
        }
        
        const activeArtifact = openedArtifacts.find(art => art.document_id === activeTabId);
        if (activeArtifact) {
            return <ProjectPlanTab layoutMode={layoutMode} />;
        }
        
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <Typography variant="h6" color="text.secondary">
                    Select an artifact or create a new one
                </Typography>
            </Box>
        );
    };

    const handleScrollTabs = (direction) => {
        if (tabsRef.current) {
            const scrollAmount = 200;
            tabsRef.current.scrollLeft += direction === 'left' ? -scrollAmount : scrollAmount;
        }
    };

    // Update getTabValue to handle all cases
    const getTabValue = () => {
        if (activeTabId && openedArtifacts.find(art => art.document_id === activeTabId)) {
            return activeTabId;
        }
        if (showArtifactTypeList && !activeTabId) {
            return 'type-list';
        }
        if (showGuide) {
            return 'guide';
        }
        return false;
    };

    // Add this function to handle showing guide
    const handleShowGuide = () => {
        setShowGuide(true);
        setShowArtifactTypeList(null);
        selectArtifact('guide'); // Use selectArtifact to handle tab activation
    };

    // Fix the handleOpenTypeList function
    const handleOpenTypeList = (typeValue) => {
        // Update our tab state
        setOpenTabs(prev => ({ ...prev, typeList: typeValue }));
        
        // Set as active tab
        setActiveTabId('typeList');
        
        // Update the workspace context
        setShowArtifactTypeList(typeValue);
        
        // Ensure we're not on the guide tab
        setShowGuide(false);
        
        // Clear any active artifact
        setActiveArtifactDocumentId(null);
    };

    // Open guide tab
    const handleOpenGuide = () => {
        setOpenTabs(prev => ({ ...prev, guide: true }));
        setActiveTabId('guide');
    };

    // Close guide tab
    const handleCloseGuide = (e) => {
        e?.stopPropagation();
        setOpenTabs(prev => ({ ...prev, guide: false }));
        
        // Activate another tab if guide was active
        if (activeTabId === 'guide') {
            if (openTabs.typeList) {
                setActiveTabId('typeList');
            } else if (openTabs.artifacts.length > 0) {
                setActiveTabId(openTabs.artifacts[openTabs.artifacts.length - 1]);
            }
        }
    };

    // Close type list tab
    const handleCloseTypeList = (e) => {
        e?.stopPropagation();
        setOpenTabs(prev => ({ ...prev, typeList: null }));
        setShowArtifactTypeList(null);
        
        // Activate another tab if type list was active
        if (activeTabId === 'typeList') {
            if (openTabs.guide) {
                setActiveTabId('guide');
            } else if (openTabs.artifacts.length > 0) {
                setActiveTabId(openTabs.artifacts[openTabs.artifacts.length - 1]);
            }
        }
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
                                    value={activeTabId}
                                    onChange={handleTabSelect}
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
                                    {openTabs.guide && (
                                        <Tab
                                            label={
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <InfoIcon sx={{ mr: 1, fontSize: 20 }} />
                                                    Guide
                                                    <IconButton
                                                        size="small"
                                                        onClick={handleCloseGuide}
                                                        sx={{ ml: 1, p: 0.5 }}
                                                    >
                                                        <CloseIcon fontSize="small" />
                                                    </IconButton>
                                                </Box>
                                            }
                                            value="guide"
                                        />
                                    )}
                                    {openTabs.typeList && (
                                        <Tab
                                            label={
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    {getArtifactIcon(openTabs.typeList)}
                                                    <Box sx={{ ml: 1 }}>
                                                        {getArtifactTypeLabel(openTabs.typeList)} List
                                                    </Box>
                                                    <IconButton
                                                        size="small"
                                                        onClick={handleCloseTypeList}
                                                        sx={{ ml: 1, p: 0.5 }}
                                                    >
                                                        <CloseIcon fontSize="small" />
                                                    </IconButton>
                                                </Box>
                                            }
                                            value="typeList"
                                        />
                                    )}
                                    {openedArtifacts
                                        .filter(artifact => openTabs.artifacts.includes(artifact.document_id))
                                        .map((artifact) => (
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
                                    onClick={handleOpenGuide}
                                    sx={{ mr: 1 }}
                                >
                                    <InfoIcon />
                                </IconButton>
                            </Tooltip>

                            <IconButton 
                                size="small"
                                onClick={() => setContextMenuAnchorEl(true)}
                                sx={{ ml: 1 }}
                            >
                                <MoreVertIcon />
                            </IconButton>
                            
                            <Menu
                                anchorEl={contextMenuAnchorEl}
                                open={Boolean(contextMenuAnchorEl)}
                                onClose={() => setContextMenuAnchorEl(null)}
                            >
                                <MenuItem onClick={() => {
                                    setIsSettingsDialogOpen(true);
                                    setContextMenuAnchorEl(null);
                                }}>
                                    Artifact Types Settings
                                </MenuItem>
                                <MenuItem onClick={() => setContextMenuAnchorEl(null)}>Workspace Settings</MenuItem>
                                <Divider />
                                <MenuItem onClick={() => setContextMenuAnchorEl(null)}>Help</MenuItem>
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
                onPhaseChange={setCurrentPhase}
            />
            
            {/* Create Artifact Dialog */}
            <CreateArtifactDialog
                open={isCreateArtifactDialogOpen}
                onClose={() => setIsCreateArtifactDialogOpen(false)}
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