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
import { useMessage } from '../../contexts/MessageContext'; // Import Message Context
import generateDocumentId from '../../utils/generateDocumentId'; // Import generateDocumentId

const ProjectPlanTab = () => {
    const [isNotesPaneVisible, setIsNotesPaneVisible] = useState(true);
    const [isWireframePaneVisible, setIsWireframePaneVisible] = useState(false);
    const panelGroupRef = useRef(null);


    const [noteMarkdownContent, setNoteMarkdownContent] = useState(''); // State for note content in ProjectPlanTab
    const [noteTitle, setNoteTitle] = useState('Idea Note'); // State for note title in ProjectPlanTab
    
    const { showLoading, hideLoading } = useLoading();    // Use Loading Context
    const { showSuccess, showError, clearMessage } = useMessage();    // Use Message Context


    const { currentWorkspace, execCreateArtifact,
        execUpdateArtifact, openedArtifacts,
        removeOpenedArtifact, activeArtifactDocumentId,
        selectArtifact,
        addNewEmptyArtifactToOpenedList,
        setActiveArtifactDocumentId,
        updateOpenedArtifactInList,
        activeArtifact
    } = useWorkspace(); // Get context functions

    // console.log("current active artifact is: ", activeArtifact);

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
        clearMessage();
        try {
            if (!noteMarkdownContent.trim()) {
                showError("Content cannot be empty to save."); // Basic validation
                return;
            }

            if (!activeArtifact) {
                showError("Cannot find the active artifact. Please try again.");
                return;
            }

            let artifactData;

            if(activeArtifact && !activeArtifact.isNew) { // Check if activeArtifact exists AND is NOT new
                // Update existing artifact
                artifactData = {
                    title: noteTitle,
                    content: noteMarkdownContent,
                    art_type: activeArtifact.art_type || 'note', // Use existing art_type or default to 'note'
                    dependencies: activeArtifact.dependencies || [] // Get dependencies from current state
                };
                
                await execUpdateArtifact(activeArtifact.document_id, artifactData);
                
                // Update the artifact in the opened list to reflect changes
                const updatedArtifact = {
                    ...activeArtifact,
                    title: noteTitle,
                    content: noteMarkdownContent
                    // Dependencies are preserved from currentActiveArtifact
                };
                updateOpenedArtifactInList(updatedArtifact);
            } else {
                // Create new artifact with properties from inspector
                artifactData = {
                    document_id: activeArtifact.document_id, // Use existing temp ID
                    title: noteTitle,
                    content: noteMarkdownContent,
                    art_type: activeArtifact.art_type || 'note', // Use art_type set in inspector or default
                    dependencies: activeArtifact.dependencies || [], // Use dependencies from current state
                    workspace_id: currentWorkspace.id,
                };
                
                const createdArtifact = await execCreateArtifact(artifactData);
                
                // Make sure we preserve any dependencies that might have been set in the inspector
                const updatedCreatedArtifact = {
                    ...createdArtifact,
                    dependencies: artifactData.dependencies // Ensure dependencies are preserved
                };
                
                updateOpenedArtifactInList(updatedCreatedArtifact); 
                setActiveArtifactDocumentId(createdArtifact.document_id); 
            }
            // Optionally refresh artifact list in sidebar here if needed
            showSuccess("Note saved successfully!"); // Use success message
        } catch (error) {
            console.error("Error saving note:", error);
            showError(`Failed to save note: ${error.message}`); // Include error details
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
        removeOpenedArtifact(documentId); // Call removeOpenedArtifact from WorkspaceContext
    };

    const handleTabChange = (event, newValue) => { // Ensure this function is present
        selectArtifact(newValue); // Call selectArtifact from context to update active tab
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