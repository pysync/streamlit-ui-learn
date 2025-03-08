// src/components/ProjectPlan/MarkdownEditor.js
import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    Toolbar,
    Button,
    Paper,
    Typography,
    IconButton,
    Tooltip,
    TextField,
    Divider,
    ButtonGroup,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import { useWorkspace } from '../../contexts/WorkspaceContext';
import { useLoading } from '../../contexts/LoadingContext';
import { useMessage } from '../../contexts/MessageContext';
import { getContextActions } from '../../services/client';

/**
 * Enhanced Markdown Editor component with fullscreen mode and context actions
 * @param {string} noteTitle - The title of the note
 * @param {string} markdownContent - The content of the note in markdown format
 * @param {function} onContentChange - Callback when content changes
 * @param {function} onTitleChange - Callback when title changes
 * @param {function} onSave - Callback to save the note
 * @param {string} artifactId - The ID of the artifact being edited (optional)
 */
const MarkdownEditor = ({ 
    noteTitle, 
    markdownContent, 
    onContentChange, 
    onTitleChange, 
    onSave,
    artifactId 
}) => {
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [contextActions, setContextActions] = useState([]);
    const editorRef = useRef(null);
    const { showLoading, hideLoading } = useLoading();
    const { showError } = useMessage();
    const [saved, setSaved] = useState(false);

    // Fetch context actions when component mounts
    useEffect(() => {
        const fetchContextActions = async () => {
            try {
                const actions = await getContextActions();
                setContextActions(actions);
            } catch (error) {
                console.error('Failed to fetch context actions:', error);
                // Don't show error to user, just log it
            }
        };

        fetchContextActions();
    }, []);

    const handleTitleEditClick = () => {
        setIsEditingTitle(true);
    };

    const handleTitleBlur = () => {
        setIsEditingTitle(false);
    };

    const toggleFullScreen = () => {
        setIsFullScreen(!isFullScreen);
    };

    const handleContextAction = async (action) => {
        showLoading();
        try {
            // Call the copilot API with the action and current content
            const response = await fetch('/api/copilot', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    context_action_id: action.id,
                    context_action_msg: action.msg,
                    artifact_id: artifactId || null,
                    note_content: markdownContent,
                }),
            });

            if (!response.ok) {
                throw new Error(`API call failed: ${response.statusText}`);
            }

            const data = await response.json();
            // Handle the response - this will be implemented later
            console.log('Copilot response:', data);
        } catch (error) {
            console.error('Error executing context action:', error);
            showError(`Failed to execute action: ${error.message}`);
        } finally {
            hideLoading();
        }
    };

    const handleSave = async () => {
        if (onSave) {
            // Make sure we're using the latest metadata from the active artifact
            // This ensures changes from the inspector are included
            await onSave({
                content: markdownContent,
                title: noteTitle
            });
        }
        setSaved(true);
    };

    return (
        <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            height: isFullScreen ? '100vh' : 'auto',
            position: isFullScreen ? 'fixed' : 'relative',
            top: isFullScreen ? 0 : 'auto',
            left: isFullScreen ? 0 : 'auto',
            right: isFullScreen ? 0 : 'auto',
            bottom: isFullScreen ? 0 : 'auto',
            zIndex: isFullScreen ? 1300 : 'auto',
            bgcolor: 'background.paper',
            p: isFullScreen ? 2 : 0,
        }}>
            {/* Header Toolbar */}
            <Toolbar 
                sx={{ 
                    justifyContent: 'space-between', 
                    paddingLeft: 0, 
                    paddingRight: 0,
                    minHeight: '48px' // Smaller toolbar
                }}
            >
                {/* Title Section */}
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    {isEditingTitle ? (
                        <TextField
                            variant="standard"
                            value={noteTitle}
                            onChange={(e) => onTitleChange && onTitleChange(e.target.value)}
                            onBlur={handleTitleBlur}
                            autoFocus
                            inputRef={editorRef}
                            sx={{ flexGrow: 1 }}
                            placeholder="Note Title"
                            fullWidth
                        />
                    ) : (
                        <Typography 
                            variant="h6" 
                            sx={{ flexGrow: 1 }} 
                            onDoubleClick={handleTitleEditClick} 
                            style={{ cursor: 'pointer' }}
                        >
                            {noteTitle}
                        </Typography>
                    )}
                    
                    {!isEditingTitle && (
                        <>
                            <Tooltip title="Edit Title">
                                <IconButton onClick={handleTitleEditClick} size="small">
                                    <EditIcon />
                                </IconButton>
                            </Tooltip>
                            
                            <Tooltip title={isFullScreen ? "Exit Fullscreen" : "Fullscreen Mode"}>
                                <IconButton onClick={toggleFullScreen} size="small" sx={{ ml: 1 }}>
                                    {isFullScreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
                                </IconButton>
                            </Tooltip>
                            
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSave}
                                sx={{ ml: 1 }}
                                startIcon={<SaveIcon />}
                                size="small"
                            >
                                Save
                            </Button>
                        </>
                    )}
                </Box>
            </Toolbar>

            {/* Main Editor */}
            <TextField
                multiline
                fullWidth
                rows={isFullScreen ? 20 : 15} // Reduced from 30 to 25 to ensure action bar is visible
                placeholder="Start writing your idea notes in Markdown here..."
                variant="outlined"
                value={markdownContent}
                onChange={(e) => onContentChange && onContentChange(e.target.value)}
                sx={{ 
                    //flexGrow: 1,
                    my: 1,
                    '& .MuiOutlinedInput-root': {
                        height: '90%',
                        '& textarea': {
                            height: '100% !important'
                        }
                    }
                }}
            />

            {/* Context Actions Status Bar - Scrollable */}
            {contextActions.length > 0 && (
                <Box 
                    sx={{ 
                        display: 'flex',
                        overflowX: 'auto',
                        borderTop: '1px solid',
                        borderColor: 'divider',
                        py: 0.5,
                        px: 1,
                        backgroundColor: 'background.default',
                        minHeight: '28px',
                        alignItems: 'center',
                        flexShrink: 1, // Prevent the action bar from shrinking
                        whiteSpace: 'nowrap', // Keep all buttons on one line
                        msOverflowStyle: 'none', // Hide scrollbar in IE/Edge
                        scrollbarWidth: 'thin', // Firefox
                        '&::-webkit-scrollbar': {
                            height: '4px',
                        },
                        '&::-webkit-scrollbar-track': {
                            background: '#f1f1f1',
                        },
                        '&::-webkit-scrollbar-thumb': {
                            background: '#888',
                            borderRadius: '4px',
                        },
                        '&::-webkit-scrollbar-thumb:hover': {
                            background: '#555',
                        },
                    }}
                >
                    {contextActions.map((action) => (
                        <Button
                            key={action.id}
                            onClick={() => handleContextAction(action)}
                            sx={{ 
                                minWidth: 'auto', 
                                textTransform: 'none',
                                py: 0,
                                px: 1,
                                mr: 1,
                                fontSize: '0.75rem',
                                color: 'primary.main',
                                '&:hover': {
                                    backgroundColor: 'transparent',
                                    textDecoration: 'underline'
                                }
                            }}
                        >
                            {action.title}
                        </Button>
                    ))}
                </Box>
            )}
        </Box>
    );
};

export default MarkdownEditor;