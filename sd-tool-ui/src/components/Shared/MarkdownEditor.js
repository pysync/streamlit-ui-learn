import React from 'react';
import PropTypes from 'prop-types';
import {
    Box,
    TextField,
    Button,
    Divider,
    Typography,
    Tooltip,
    IconButton
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import MDEditor from '@uiw/react-md-editor';

/**
 * Rich markdown editor component
 */
const MarkdownEditor = ({
    noteTitle,
    markdownContent,
    onContentChange,
    onTitleChange,
    onSave,
    artifactId
}) => {
    const handleEditorChange = (value) => {
        if (onContentChange) {
            onContentChange(value || '');
        }
    };

    const handleTitleChange = (e) => {
        if (onTitleChange) {
            onTitleChange(e.target.value || '');
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <TextField
                    value={noteTitle || ''}
                    onChange={handleTitleChange}
                    variant="outlined"
                    size="small"
                    fullWidth
                    sx={{ mr: 1 }}
                />
                <Tooltip title="Save">
                    <IconButton
                        color="primary"
                        onClick={onSave}
                    >
                        <SaveIcon />
                    </IconButton>
                </Tooltip>
            </Box>

            <Divider sx={{ mb: 2 }} />

            <Box sx={{ flexGrow: 1 }}>
                <MDEditor
                    value={markdownContent || ''}
                    onChange={handleEditorChange}
                    height="100%"
                    preview="edit"
                    data-color-mode="light"
                />
            </Box>
        </Box>
    );
};

MarkdownEditor.propTypes = {
    noteTitle: PropTypes.string,
    markdownContent: PropTypes.string,
    onContentChange: PropTypes.func,
    onTitleChange: PropTypes.func,
    onSave: PropTypes.func,
    artifactId: PropTypes.string
};

export default MarkdownEditor; 