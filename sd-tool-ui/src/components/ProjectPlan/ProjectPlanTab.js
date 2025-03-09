// src/components/ProjectPlan/ProjectPlanTab.js
import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    Paper,
    Typography,
    IconButton,
    Tooltip,
    ButtonGroup,
} from '@mui/material';
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels';
import MarkdownEditor from './MarkdownEditor';
import ExcalidrawComponent from './ExcalidrawComponent';
import BacklogBoard from './BacklogBoard';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useWorkspace } from '../../contexts/WorkspaceContext';
import { useLoading } from '../../contexts/LoadingContext';
import { useMessage } from '../../contexts/MessageContext';
import { ARTIFACT_TYPES } from '../../constants/sdlcConstants';
import { ARTIFACT_VISUALIZATIONS } from '../../constants/artifactVisualizations';
import { useEditor } from '../../contexts/EditorContext';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import VerticalSplitIcon from '@mui/icons-material/VerticalSplit';
import HorizontalSplitIcon from '@mui/icons-material/HorizontalSplit';
import TableRowsIcon from '@mui/icons-material/TableRows';
import ArtifactRendererFactory from '../Renderers/ArtifactRendererFactory';
import { getDefaultVisualization } from '../../constants/artifactVisualizations';

const ProjectPlanTab = ({ layoutMode }) => {
    const [isNotesPaneVisible, setIsNotesPaneVisible] = useState(true);
    const [isWireframePaneVisible, setIsWireframePaneVisible] = useState(false);
    const panelGroupRef = useRef(null);

    const [noteMarkdownContent, setNoteMarkdownContent] = useState('');
    const [noteTitle, setNoteTitle] = useState('Idea Note');
    // Add isFullScreen state
    const [isFullScreen, setIsFullScreen] = useState(false);

    const { showLoading, hideLoading } = useLoading();
    const { showSuccess, showError, clearMessage } = useMessage();

    const { 
        currentWorkspace, 
        execCreateArtifact,
        execUpdateArtifact, 
        openedArtifacts,
        removeOpenedArtifact, 
        activeArtifactDocumentId,
        selectArtifact,
        addNewEmptyArtifactToOpenedList,
        setActiveArtifactDocumentId,
        updateOpenedArtifactInList,
        activeArtifact
    } = useWorkspace();

    const { registerSaveHandler, registerFullscreenHandler } = useEditor();

    // Load content when active artifact changes
    useEffect(() => {
        if (activeArtifact) {
            setNoteMarkdownContent(activeArtifact.content || '');
            setNoteTitle(activeArtifact.title || 'Idea Note');
            
            // Determine which panes to show based on artifact type
            if (activeArtifact.art_type === ARTIFACT_TYPES.NOTE) {
                setIsNotesPaneVisible(true);
                setIsWireframePaneVisible(false);
            } else if (activeArtifact.art_type === ARTIFACT_TYPES.WIREFRAME) {
                setIsNotesPaneVisible(false);
                setIsWireframePaneVisible(true);
            } else {
                // Default for other types or new artifacts
                setIsNotesPaneVisible(true);
                setIsWireframePaneVisible(false);
            }
        } else {
            // handleCreateNewNote();
        }
    }, [activeArtifact]);

    // Update visibility based on layoutMode
    useEffect(() => {
        switch (layoutMode) {
            case 'single':
                setIsNotesPaneVisible(true);
                setIsWireframePaneVisible(false);
                break;
            case 'vertical':
            case 'horizontal':
                setIsNotesPaneVisible(true);
                setIsWireframePaneVisible(true);
                break;
            case 'wireframe':
                setIsNotesPaneVisible(false);
                setIsWireframePaneVisible(true);
                break;
            default:
                setIsNotesPaneVisible(true);
                setIsWireframePaneVisible(false);
        }
    }, [layoutMode]);

    const handleToggleNotesPane = () => {
        setIsNotesPaneVisible(!isNotesPaneVisible);
    };

    const handleToggleWireframePane = () => {
        setIsWireframePaneVisible(!isWireframePaneVisible);
    };

    const handleCreateNewNote = () => {
        setNoteMarkdownContent('');
        setNoteTitle('Idea Note');
        addNewEmptyArtifactToOpenedList();
    };

    const handleSaveNote = async () => {
        showLoading();
        clearMessage();
        try {
            if (!noteMarkdownContent.trim()) {
                showError("Content cannot be empty to save.");
                return;
            }

            if (!activeArtifact) {
                showError("Cannot find the active artifact. Please try again.");
                return;
            }

            let artifactData;
            let updatedArtifact;

            if(activeArtifact && !activeArtifact.isNew) {
                // Existing artifact - update it
                artifactData = {
                    title: noteTitle,
                    content: noteMarkdownContent,
                    art_type: activeArtifact.art_type || ARTIFACT_TYPES.NOTE,
                    dependencies: activeArtifact.dependencies || []
                };
                
                // Update the artifact via the API
                updatedArtifact = await execUpdateArtifact(activeArtifact.document_id, artifactData);
                
                // No need to call updateOpenedArtifactInList here as execUpdateArtifact already does it
            } else {
                // New artifact - create it
                artifactData = {
                    document_id: activeArtifact.document_id,
                    title: noteTitle,
                    content: noteMarkdownContent,
                    art_type: activeArtifact.art_type || ARTIFACT_TYPES.NOTE,
                    dependencies: activeArtifact.dependencies || [],
                    workspace_id: currentWorkspace.id,
                };
                
                // Create the artifact via the API
                updatedArtifact = await execCreateArtifact(artifactData);
                
                // Update the opened artifact with the created one
                const updatedCreatedArtifact = {
                    ...updatedArtifact,
                    dependencies: artifactData.dependencies
                };
                
                updateOpenedArtifactInList(updatedCreatedArtifact);
                setActiveArtifactDocumentId(updatedArtifact.document_id);
            }
            
            showSuccess("Note saved successfully!");
        } catch (error) {
            console.error("Error saving note:", error);
            showError(`Failed to save note: ${error.message}`);
        } finally {
            hideLoading();
        }
    };

    // Then update the useEffect for registering handlers
    useEffect(() => {
        registerSaveHandler(handleSaveNote);
        registerFullscreenHandler(() => setIsFullScreen(prev => !prev));
        
        return () => {
            registerSaveHandler(null);
            registerFullscreenHandler(null);
        };
    }, [registerSaveHandler, registerFullscreenHandler]);

    const handleNoteContentChange = (newContent) => {
        setNoteMarkdownContent(newContent);
    };

    const handleNoteTitleChange = (newTitle) => {
        setNoteTitle(newTitle);
    };

    // Render the appropriate content based on the active artifact type
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

        // Special handling for note and wireframe types
        if (activeArtifact.art_type === ARTIFACT_TYPES.NOTE || 
            activeArtifact.art_type === ARTIFACT_TYPES.WIREFRAME || 
            activeArtifact.art_type === ARTIFACT_TYPES.BACKLOG_ITEM) {
            // Use the existing implementation for these types
            return (
                <Box>
                    <PanelGroup direction="horizontal" ref={panelGroupRef}>
                        {isNotesPaneVisible && (
                            <Panel
                                className="panel-item"
                                minSize={20}
                                defaultSize={isWireframePaneVisible ? 50 : 100}
                                id="notes-panel-id"
                            >
                                <Box sx={{ height: '100%', overflow: 'auto' }}>
                                    <Paper elevation={2} sx={{ p: 2, height: '100%', width: '100%', boxSizing: 'border-box' }}>
                                        <MarkdownEditor
                                            noteTitle={noteTitle || ""}
                                            markdownContent={noteMarkdownContent || ""}
                                            onContentChange={handleNoteContentChange}
                                            onTitleChange={handleNoteTitleChange}
                                            onSave={handleSaveNote}
                                            artifactId={activeArtifact?.document_id}
                                            activeArtifact={activeArtifact}
                                        />
                                    </Paper>
                                </Box>
                            </Panel>
                        )}
                        
                        {isNotesPaneVisible && isWireframePaneVisible && <PanelResizeHandle className="resizer" />}

                        {isWireframePaneVisible && (
                            <Panel
                                className="panel-item"
                                minSize={20}
                                defaultSize={50}
                                id="wireframe-panel-id"
                            >
                                <Box sx={{ height: '100%', overflow: 'auto' }}>
                                    <Paper elevation={2} sx={{ p: 2, height: '100%', width: '100%', boxSizing: 'border-box' }}>
                                        <Typography variant="h6" gutterBottom>Draft Wireframe</Typography>
                                        <ExcalidrawComponent />
                                    </Paper>
                                </Box>
                            </Panel>
                        )}
                    </PanelGroup>

                    {activeArtifact.art_type === ARTIFACT_TYPES.BACKLOG_ITEM && (
                        <Box mt={2}>
                            <Paper elevation={2} sx={{ p: 2 }}>
                                <Typography variant="h6" gutterBottom>Project Backlog</Typography>
                                <BacklogBoard />
                            </Paper>
                        </Box>
                    )}
                </Box>
            );
        }

        // For all other artifact types, use the specialized renderers
        // Get default visualization based on artifact type
        const defaultVisualization = getDefaultVisualization(activeArtifact.art_type);
        
        return (
            <ArtifactRendererFactory
                artifact={activeArtifact}
                visualization={defaultVisualization}
                visualizations={ARTIFACT_VISUALIZATIONS[activeArtifact.art_type] || []}
                isEditable={true}
                onContentUpdate={handleNoteContentChange}
                onVisualizationChange={(viz) => console.log('Visualization changed:', viz)}
                layoutMode={layoutMode}
            />
        );
    };

    return (
        <Box 
            id="project-plan-tab"
            sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
        >
            <Box sx={{ flexGrow: 1, display: 'flex', overflow: 'hidden' }}>
                <PanelGroup 
                    direction={layoutMode === 'horizontal' ? 'vertical' : 'horizontal'}
                    ref={panelGroupRef}
                >
                    {isNotesPaneVisible && (
                        <Panel
                            className="panel-item"
                            minSize={20}
                            defaultSize={isWireframePaneVisible ? 50 : 100}
                        >
                            <Box sx={{ height: '100%', overflow: 'auto' }}>
                                <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
                                    <MarkdownEditor
                                        noteTitle={noteTitle}
                                        markdownContent={noteMarkdownContent}
                                        onContentChange={handleNoteContentChange}
                                        onTitleChange={handleNoteTitleChange}
                                        onSave={handleSaveNote}
                                        artifactId={activeArtifact?.document_id}
                                        activeArtifact={activeArtifact}
                                    />
                                </Paper>
                            </Box>
                        </Panel>
                    )}
                    
                    {isNotesPaneVisible && isWireframePaneVisible && (
                        <PanelResizeHandle className="resizer" />
                    )}

                    {isWireframePaneVisible && (
                        <Panel
                            className="panel-item"
                            minSize={20}
                            defaultSize={isNotesPaneVisible ? 50 : 100}
                        >
                            <Box sx={{ height: '100%', overflow: 'auto' }}>
                                <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
                                    <Typography variant="h6" gutterBottom>Draft Wireframe</Typography>
                                    <ExcalidrawComponent />
                                </Paper>
                            </Box>
                        </Panel>
                    )}
                </PanelGroup>
            </Box>
        </Box>
    );
};

export default ProjectPlanTab;