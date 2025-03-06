// src/components/ProjectPlan/MarkdownEditor.js
import React, { useState, useEffect, useRef } from 'react'; // Import useRef

import {
    Box,
    Toolbar,
    Button,
    Paper,
    Typography,
    IconButton,
    Tooltip,
    CircularProgress,
    TextField,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit'; // Import EditIcon
import SaveIcon from '@mui/icons-material/Save'; // Import SaveIcon
import { aiService } from '../../services/aiService';
import { useWorkspace } from '../../contexts/WorkspaceContext';
import { useLoading } from '../../contexts/LoadingContext'; // Import Loading Context
import { useError } from '../../contexts/ErrorContext';     // Import Error Context
import generateDocumentId from '../../utils/generateDocumentId'; // Import generateDocumentId


const MarkdownEditor = ({ noteTitle, markdownContent, onContentChange, onTitleChange, onSave }) => { // Receive props for data and callbacks
    const [isEditingTitle, setIsEditingTitle] = useState(false); // State for title editing
    const editorRef = useRef(null); // Ref for TextField to focus programmatically


    const handleTitleEditClick = () => {
        setIsEditingTitle(true);
    };

    const handleTitleBlur = () => {
        setIsEditingTitle(false);
    };

    return (
        <Box>
            <Toolbar sx={{ justifyContent: 'space-between', paddingLeft: 0, paddingRight: 0 }}> {/* Toolbar for title */}
                {/* Editable Title Label */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, width: '100%' }}> {/* Take full width */}
                    {isEditingTitle ? (
                        <TextField
                            variant="standard"
                            value={noteTitle}
                            onChange={(e) => onTitleChange && onTitleChange(e.target.value)} // Call onTitleChange callback
                            onBlur={handleTitleBlur}
                            autoFocus
                            inputRef={editorRef} // Attach ref to TextField for autofocus
                            sx={{ ml: 0, flexGrow: 1 }} // Adjust margin-left to 0, keep flex-grow
                            placeholder="Note Title"
                            fullWidth // Ensure TextField takes full width
                        />
                    ) : (
                        <Typography variant="h6" sx={{ ml: 0, flexGrow: 1 }} onDoubleClick={handleTitleEditClick} style={{ cursor: 'pointer' }}> {/* Adjust margin-left to 0, keep flex-grow */}
                            {noteTitle}
                        </Typography>
                    )}
                    {!isEditingTitle && (
                        <Tooltip title="Edit Title">
                            <IconButton onClick={handleTitleEditClick} size="small">
                                <EditIcon />
                            </IconButton>
                        </Tooltip>
                    )}
                    {/* Save Button - Conditionally Rendered */}
                    {!isEditingTitle && (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={onSave} // Call onSave callback prop
                            //disabled={isGenerating || !isContentChangedSinceSave} // You can manage disabled state in ProjectPlanTab if needed
                            sx={{ ml: 1 }} // Add marginLeft for spacing
                            startIcon={<SaveIcon />} // Add SaveIcon
                        >
                            Save
                            {/* {isSavingNote && <CircularProgress size={20} sx={{ ml: 1, color: 'white' }} />}  // No need for loading here, let ProjectPlanTab manage it */}
                        </Button>
                    )}
                </Box>
            </Toolbar>


            <TextField
                multiline
                fullWidth
                rows={15} // Increase rows for more editor space
                placeholder="Start writing your idea notes in Markdown here..."
                variant="outlined"
                value={markdownContent}

                onChange={(e) => onContentChange && onContentChange(e.target.value)} // Call onContentChange callback
            />
        </Box>
    );
};

export default MarkdownEditor;