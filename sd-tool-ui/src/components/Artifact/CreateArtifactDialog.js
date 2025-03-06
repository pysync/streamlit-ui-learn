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
import { useError } from '../../contexts/ErrorContext';     // Import Error Context

const CreateArtifactDialog = ({ open, onClose }) => {
    const [title, setTitle] = useState('');
    const [artType, setArtType] = useState('note');
    const [textContent, setTextContent] = useState('');
    const [ uploadFile, setUploadFile] = useState(null); // State for uploaded file
    const { currentWorkspace, execCreateArtifact, execUpdateArtifact, uploadArtifact, } = useWorkspace();
    const { showLoading, hideLoading } = useLoading();    // Use Loading Context
    const { showError, clearError } = useError();        // Use Error Context

    
    const handleTextArtifactCreate = async () => {
        clearError(); // Clear any previous errors
        showLoading();
        try {
            if (!title || !artType) {
                showError("Please enter title and select artifact type.");
                return;
            }

            const artifactData = {
                document_id: title.toLowerCase().replace(/\s+/g, '-'),
                title: title,
                content: textContent,
                art_type: artType,
            };
            await execCreateArtifact(artifactData);
            onClose();
        } catch (error) {
            console.error("Error creating text artifact:", error);
            showError("Failed to create text artifact.");
        } finally {
            hideLoading();
        }
    };

    const handleFileUploadArtifactCreate = async () => {
        clearError(); // Clear any previous errors
        showLoading();
        if (!title || !artType || !uploadFile) {
            showError("Please enter title, select artifact type, and upload a file.");
            hideLoading();
            return;
        }

        try {
            // Step 1: Upload file
            const uploadResponse = await uploadArtifact(currentWorkspace.id, uploadFile);
            const uploadedArtifact = uploadResponse; // Assuming uploadArtifact returns the created artifact data
            const documentId = uploadedArtifact.document_id;

            // Step 2: Update artifact metadata (title, art_type)
            const updateData = {
                title: title,
                content: null, // Content is already in the uploaded file
                dependencies: null, // No dependencies for now
            };
            await execUpdateArtifact(documentId, updateData, artType); // Pass artType as separate param based on API
            onClose();

        } catch (uploadError) {
            console.error("Error during file upload or metadata update:", uploadError);
            showError("Failed to upload file or update artifact metadata.");
        } finally {
            hideLoading();
        }
    };


    const handleCreate = () => {
        if (uploadFile) {
            handleFileUploadArtifactCreate(); // Call file upload flow
        } else {
            handleTextArtifactCreate();      // Call text creation flow
        }
    };


    const handleClose = () => {
        onClose();
        clearError(); // Clear error on dialog close
        // Clear form fields on close if needed
        setTitle('');
        setArtType('note');
        setTextContent('');
        setUploadFile(null);
    };

    const handleFileChange = (event) => {
        setUploadFile(event.target.files[0]); // Store the selected File object
    };


    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle>Create New Artifact</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    id="title"
                    label="Title"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <FormControl fullWidth margin="dense" variant="standard">
                    <InputLabel id="artifact-type-label">Artifact Type</InputLabel>
                    <Select
                        labelId="artifact-type-label"
                        id="artifact-type-select"
                        value={artType}
                        label="Artifact Type"
                        onChange={(e) => setArtType(e.target.value)}
                    >
                        <MenuItem value="note">Note</MenuItem>
                        <MenuItem value="document">Document (SRS)</MenuItem>
                        <MenuItem value="basic_design">Basic Design</MenuItem>
                        <MenuItem value="detail_design">Detail Design</MenuItem>
                        <MenuItem value="api_list">API List</MenuItem>
                        <MenuItem value="screen_list">Screen List</MenuItem>
                    </Select>
                </FormControl>

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
                <Button onClick={handleCreate} variant="contained" disabled={!title || !artType}>
                    Create
                    {useLoading().loading && <CircularProgress size={20} sx={{ ml: 1, color: 'white' }} />} {/* Loading indicator */}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CreateArtifactDialog;