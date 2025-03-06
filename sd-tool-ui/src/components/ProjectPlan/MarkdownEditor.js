// src/components/ProjectPlan/MarkdownEditor.js
import React, { useState } from 'react';
import { TextField, Button, Box, CircularProgress , Typography} from '@mui/material';
import aiService  from '../../services/aiService'; // Adjust path if needed

const MarkdownEditor = () => {
    const [markdownContent, setMarkdownContent] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleAIImprove = async () => {
        setIsGenerating(true);
        setErrorMessage('');
        try {
            const improvedText = await aiService.generateText(`Improve the following text: ${markdownContent}`);
            setMarkdownContent(improvedText);
        } catch (error) {
            console.error("AI Error:", error);
            setErrorMessage("Failed to generate text. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <Box>
            <TextField
                multiline
                fullWidth
                rows={10}
                placeholder="Start writing your idea notes in Markdown here..."
                variant="outlined"
                value={markdownContent}
                onChange={(e) => setMarkdownContent(e.target.value)}
            />
            <Box mt={2} display="flex" justifyContent="space-between" alignItems="center">
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAIImprove}
                    disabled={isGenerating}
                >
                    {isGenerating ? (
                        <>Generating <CircularProgress size={20} sx={{ ml: 1, color: 'white' }} /></>
                    ) : (
                        "AI Gen / Improve"
                    )}
                </Button>
                {errorMessage && <Typography color="error">{errorMessage}</Typography>}
            </Box>
        </Box>
    );
};

export default MarkdownEditor;

// markdownContent state: Stores the content of the editor.

// isGenerating state: Tracks whether the AI is currently generating text (for loading indicator and button disabling).

// errorMessage state: Displays error messages from AI calls.

// handleAIImprove function:

// Sets isGenerating to true before calling aiService.generateText.

// Calls aiService.generateText with a prompt to improve the current markdownContent.

// Updates markdownContent state with the AI-generated text.

// Handles errors and sets errorMessage if the AI call fails.

// Sets isGenerating to false in finally block to end loading state.

// Loading Indicator: Uses CircularProgress from Material UI to show a loading animation in the "AI Gen / Improve" button when generating.

// Error Message Display: Displays the errorMessage using Typography with color="error".