// src/components/ProjectPlan/ProjectPlanTab.js
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    Box,
    Toolbar,
    AppBar,
    Tabs,
    Tab,
    Button,
    Paper,
    Typography,
    IconButton,
    Tooltip,

    CircularProgress,
} from '@mui/material';
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels'; // Correct Import: PanelGroup, Panel, PanelResizeHandle
import MarkdownEditor from './MarkdownEditor';
import ExcalidrawComponent from './ExcalidrawComponent';
import BacklogBoard from './BacklogBoard';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import TextSnippetIcon from '@mui/icons-material/TextSnippet'; // Import TextSnippetIcon
import BrushIcon from '@mui/icons-material/Brush';          // Import BrushIcon
import AddIcon from '@mui/icons-material/Add';
import { useWorkspace } from '../../contexts/WorkspaceContext'; // Import useWorkspace
import { useLoading } from '../../contexts/LoadingContext'; // Import Loading Context
import { useError } from '../../contexts/ErrorContext';     // Import Error Context
import generateDocumentId from '../../utils/generateDocumentId'; // Import generateDocumentId

const ProjectPlanTab = () => {
    const [isNotesPaneVisible, setIsNotesPaneVisible] = useState(true);
    const [isWireframePaneVisible, setIsWireframePaneVisible] = useState(false);
    const panelGroupRef = useRef(null);


    const [noteMarkdownContent, setNoteMarkdownContent] = useState(''); // State for note content in ProjectPlanTab
    const [noteTitle, setNoteTitle] = useState('Idea Note'); // State for note title in ProjectPlanTab
    
    const { showLoading, hideLoading } = useLoading();    // Use Loading Context
    const { showError, clearError } = useError();        // Use Error Context


    const { currentWorkspace, execCreateArtifact,
        execUpdateArtifact, openedArtifacts,
        removeOpenedArtifact, activeArtifactDocumentId,
        setActiveArtifact,
        addNewEmptyArtifactToOpenedList,
        setActiveArtifactDocumentId,
        updateOpenedArtifactInList,
    } = useWorkspace(); // Get context functions

    // Get the active artifact object from openedArtifacts based on activeArtifactDocumentId
    const activeArtifact = openedArtifacts.find(artifact => artifact.document_id === activeArtifactDocumentId);

    useEffect(() => { // useEffect to update local state when activeArtifact changes
        if (activeArtifact) {
            setNoteMarkdownContent(activeArtifact.content || ''); // Load content from activeArtifact to local state
            setNoteTitle(activeArtifact.title || 'Idea Note');   // Load title from activeArtifact to local state
        } else {
            handleCreateNewNote()
        }
    }, [activeArtifact]); // Dependency: activeArtifact


    const handleToggleNotesPane = () => {
        setIsNotesPaneVisible(!isNotesPaneVisible);
    };

    const handleToggleWireframePane = () => {
        setIsWireframePaneVisible(!isWireframePaneVisible);
    };

    const handleCreateNewNote = () => {
        setNoteMarkdownContent(''); // Clear content when creating new note
        setNoteTitle('Idea Note'); // Reset title for new note
        addNewEmptyArtifactToOpenedList(); // Call addNewEmptyArtifactToOpenedList from context
    };


    const handleSaveNote = async () => { // Implement handleSaveNote in ProjectPlanTab
        showLoading(); // Start loading for Save button
        clearError();
        try {
            if (!noteMarkdownContent.trim()) {
                showError("Content cannot be empty to save."); // Basic validation
                return;
            }

            let artifactData;

            if(activeArtifact && !activeArtifact.isNew) { // Check if activeArtifact exists AND is NOT new
                // Update existing artifact
                artifactData = {
                    title: noteTitle,
                    content: noteMarkdownContent,
                    art_type: 'note',
                };
                await execUpdateArtifact(activeArtifact.document_id, artifactData);
                console.log("Artifact updated:", activeArtifact.document_id);
            } else {
                // Create new artifact
                // const document_id = generateDocumentId(noteTitle);
                artifactData = {
                    ...activeArtifact, // for use default document id
                    title: noteTitle,
                    content: noteMarkdownContent,
                    art_type: 'note',
                    workspace_id: currentWorkspace.id,
                };
                const createdArtifact = await execCreateArtifact(artifactData);
               
                updateOpenedArtifactInList(createdArtifact); 
                setActiveArtifactDocumentId(createdArtifact.document_id); 
            }
            // Optionally refresh artifact list in sidebar here if needed
            showError("Note saved successfully!"); // Basic success feedback
        } catch (error) {
            console.error("Error saving note:", error);
            showError("Failed to save note."); // Basic error feedback
        } finally {
            hideLoading(); // End loading for Save button
        }
    };


    // Callbacks to update LOCAL state only
    const handleNoteContentChange = (newContent) => {
        setNoteMarkdownContent(newContent); // Update LOCAL markdownContent state
    }; // No dependencies needed, stable callback

    const handleNoteTitleChange = (newTitle) => {
        setNoteTitle(newTitle); // Update LOCAL noteTitle state
    } // No dependencies needed, stable callback
    
    // const handleNoteContentChange = useCallback((newContent) => {
    //     if (activeArtifactDocumentId) {
    //         const existingArtifact = openedArtifacts.find(art => art.document_id === activeArtifactDocumentId); // Find existing artifact
    //         if (existingArtifact) {
    //             updateOpenedArtifactInList({
    //                 ...existingArtifact, // Copy existing artifact data
    //                 content: newContent  // Update only the content field
    //             });
    //         }
    //     }
    // }, [activeArtifactDocumentId, openedArtifacts, updateOpenedArtifactInList]); // Add openedArtifacts to dependencies

    // const handleNoteTitleChange = useCallback((newTitle) => {
    //     if (activeArtifactDocumentId) {
    //         const existingArtifact = openedArtifacts.find(art => art.document_id === activeArtifactDocumentId); // Find existing artifact
    //         if (existingArtifact) {
    //             updateOpenedArtifactInList({
    //                 ...existingArtifact, // Copy existing artifact data
    //                 title: newTitle     // Update only the title field
    //             });
    //         }
    //     }
    // }, [activeArtifactDocumentId, openedArtifacts, updateOpenedArtifactInList]); // Add openedArtifacts to dependencies

    const handleCloseTab = (documentId) => {
        console.log("close", documentId)
        removeOpenedArtifact(documentId); // Call removeOpenedArtifact from WorkspaceContext
    };

    const handleTabChange = (event, newValue) => { // Ensure this function is present
        setActiveArtifact(newValue); // Call setActiveArtifact from context to update active tab
    };

    return (
        <Box>
            <Toolbar>
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleCreateNewNote}
                    sx={{ ml: 1 }}
                    startIcon={<AddIcon />}
                >
                    New Note
                </Button>


                {/* Toggle Buttons for Panes - Updated Icons */}
                <Tooltip title={isNotesPaneVisible ? "Hide Idea Notes" : "Show Idea Notes"}>
                    <IconButton color="inherit" onClick={handleToggleNotesPane}>
                        {isNotesPaneVisible ? <TextSnippetIcon /> : <VisibilityOffIcon />} {/* TextSnippetIcon for Notes */}
                    </IconButton>
                </Tooltip>
                <Tooltip title={isWireframePaneVisible ? "Hide Wireframe" : "Show Wireframe"}>
                    <IconButton color="inherit" onClick={handleToggleWireframePane}>
                        {isWireframePaneVisible ? <BrushIcon /> : <VisibilityOffIcon />} {/* BrushIcon for Wireframe */}
                    </IconButton>
                </Tooltip>
                {/* Add more toolbar buttons if needed */}
            </Toolbar>

            {/* Sub-Tabs for Opened Artifacts */}
            <AppBar position="static" color="default" elevation={0}>
                <Tabs
                    value={activeArtifactDocumentId}
                    onChange={handleTabChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    aria-label="scrollable auto tabs"
                >
                    {openedArtifacts.map((artifact) => (
                        <Tab
                            key={artifact.document_id}
                            value={artifact.document_id}
                            label={artifact.title || "New Note"}
                            aria-label={artifact.title || "New Note"}
                            wrapped
                            onClose={() => handleCloseTab(artifact.document_id)}
                        />
                    ))}
                </Tabs>
            </AppBar>

            <PanelGroup // Correct Component: PanelGroup
                direction="horizontal" // or "vertical"
                className="panels-container" // Optional class name for styling
                ref={panelGroupRef} // Attach the ref
                id="panel-group-id" // Add an ID for PanelGroup (important for react-resizable-panels)
            >
                {/* Idea Notes Panel */}
                {isNotesPaneVisible && (
                    <Panel
                        className="panel-item"
                        minSize={20}
                        defaultSize={50}
                        id="notes-panel-id"
                    >
                        <Box sx={{ height: 'calc(100vh - 200px)', overflow: 'auto' }}>
                            <Paper elevation={2} sx={{ p: 2, height: '100%', width: '100%', boxSizing: 'border-box' }}>
                                <MarkdownEditor
                                    noteTitle={noteTitle || ""}                 // Pass noteTitle prop
                                    markdownContent={noteMarkdownContent || ""}   // Pass markdownContent prop
                                    onContentChange={handleNoteContentChange} // Pass onContentChange callback
                                    onTitleChange={handleNoteTitleChange}     // Pass onTitleChange callback
                                    onSave={handleSaveNote}
                                />
                            </Paper>
                        </Box>
                    </Panel>
                )}
                {isNotesPaneVisible && isWireframePaneVisible && <PanelResizeHandle className="resizer" />} {/* Correct Component: PanelResizeHandle */} {/* Resizer between panes */}

                {/* Draft Wireframe Panel */}
                {isWireframePaneVisible && (
                    <Panel
                        className="panel-item" // Optional class name for styling
                        minSize={20}
                        defaultSize={50}
                        id="wireframe-panel-id" // Add an ID for Panel (important for react-resizable-panels)
                    >
                        <Box sx={{ height: 'calc(100vh - 200px)', overflow: 'auto' }}>
                            <Paper elevation={2} sx={{ p: 2, height: '100%', width: '100%', boxSizing: 'border-box' }}>
                                <Typography variant="h6" gutterBottom>Draft Wireframe (Excalidraw)</Typography>
                                <ExcalidrawComponent />
                            </Paper>
                        </Box>
                    </Panel>
                )}
            </PanelGroup>


            <Box mt={2}>
                <Paper elevation={2} sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>Project Backlog (Trello-style)</Typography>
                    <BacklogBoard />
                </Paper>
            </Box>
        </Box>
    );
};

export default ProjectPlanTab;