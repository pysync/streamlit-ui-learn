// src/components/Artifact/CreateArtifactDialog.js
import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    DialogActions,
    Button,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Box,
    Divider,
    Typography,
    CircularProgress, // Import CircularProgress
} from '@mui/material';
import { useWorkspace } from '../../contexts/WorkspaceContext';
import { useLoading } from '../../contexts/LoadingContext'; // Import Loading Context
import { useMessage } from '../../contexts/MessageContext'; // Import Message Context
import { generateDocumentId } from '../../utils/documentUtils';
import { 
    ARTIFACT_TYPE_OPTIONS, 
    ARTIFACT_TYPE_TO_PHASE, 
    PHASE_LABELS 
} from '../../constants/sdlcConstants';
import { v4 as uuidv4 } from 'uuid';

const CreateArtifactDialog = ({ open, onClose }) => {
    const [title, setTitle] = useState('');
    const [artType, setArtType] = useState('');
    const [textContent, setTextContent] = useState('');
    const [ uploadFile, setUploadFile] = useState(null); // State for uploaded file
    const { currentWorkspace, execCreateArtifact, execUpdateArtifact, uploadArtifact, execSetArtifactMeta} = useWorkspace();
    const { showLoading, hideLoading } = useLoading();    // Use Loading Context
    const { showMessage, showError, clearMessage } = useMessage();    // Use Message Context

    
    const handleCreate = async () => {
        if (!title.trim()) {
            showError('Title is required');
            return;
        }
        if (!artType) {
            showError('Artifact type is required');
            return;
        }

        showLoading();
        try {
            await execCreateArtifact({
                title: title,
                art_type: artType,
                content: textContent,
                dependencies: [],
                document_id: generateDocumentId()
            });
            onClose();
            showMessage('Artifact created successfully', 'success');
        } catch (error) {
            console.error('Error creating artifact:', error);
            showError('Failed to create artifact');
        } finally {
            hideLoading();
        }
    };

    const handleClose = () => {
        setTitle('');
        setArtType('');
        onClose();
        clearMessage(); // Clear messages on dialog close
        // Clear form fields on close if needed
        setTextContent('');
        setUploadFile(null);
    };

    // Group options by phase
    const groupedOptions = ARTIFACT_TYPE_OPTIONS.reduce((acc, option) => {
        const phase = ARTIFACT_TYPE_TO_PHASE[option.value];
        if (!acc[phase]) {
            acc[phase] = [];
        }
        acc[phase].push(option);
        return acc;
    }, {});

    const handleFileChange = (event) => {
        setUploadFile(event.target.files[0]); // Store the selected File object
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle>Create New Artifact</DialogTitle>
            <DialogContent>
                <Box sx={{ pt: 1 }}>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Title"
                        fullWidth
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Artifact Type</InputLabel>
                        <Select
                            value={artType}
                            label="Artifact Type"
                            onChange={(e) => setArtType(e.target.value)}
                        >
                            {Object.entries(groupedOptions).map(([phase, options]) => [
                                <Divider key={`divider-${phase}`}>
                                    <Typography variant="caption" color="text.secondary">
                                        {PHASE_LABELS[phase]}
                                    </Typography>
                                </Divider>,
                                ...options.map(option => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))
                            ])}
                        </Select>
                    </FormControl>
                </Box>

                {/* Text Content Area - Visible when no file uploaded */}
                {!uploadFile && (
                    <TextField
                        margin="dense"
                        id="content"
                        label="Text Content (Optional)"
                        type="text"
                        fullWidth
                        multiline
                        rows={4}
                        variant="outlined"
                        placeholder="Enter artifact text content here..."
                        value={textContent}
                        onChange={(e) => setTextContent(e.target.value)}
                    />
                )}

                <Box mt={2} textAlign="center">
                    <Divider>
                        <Typography variant="body2">Or</Typography>
                    </Divider>
                    <Button variant="outlined" component="label" sx={{ mt: 2 }}>
                        Upload File
                        <input type="file" hidden onChange={handleFileChange} /> {/* File input */}
                    </Button>
                    {uploadFile && (
                        <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 1 }}>
                            Selected file: {uploadFile.name}
                        </Typography>
                    )}
                </Box>

            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleCreate} variant="contained" color="primary">
                    Create
                    {useLoading().loading && <CircularProgress size={20} sx={{ ml: 1, color: 'white' }} />} {/* Loading indicator */}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CreateArtifactDialog;