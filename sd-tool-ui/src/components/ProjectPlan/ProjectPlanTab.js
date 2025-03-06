// src/components/ProjectPlan/ProjectPlanTab.js
import React from 'react';
import {
    Box,
    Toolbar,
    Button,
    Grid, // or SplitPane library if you prefer
    Paper,
    Typography,
} from '@mui/material';
import MarkdownEditor from './MarkdownEditor'; // Import MarkdownEditor placeholder
import ExcalidrawComponent from './ExcalidrawComponent'; // Import Excalidraw placeholder
import BacklogBoard from './BacklogBoard'; // Import BacklogBoard placeholder

const ProjectPlanTab = () => {
    return (
        <Box>
            <Toolbar>
                <Button variant="contained" color="primary">
                    AI Gen / Improve
                </Button>
                {/* Add more toolbar buttons if needed */}
            </Toolbar>

            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <Paper elevation={2} sx={{ p: 2, height: 'calc(100vh - 200px)' }}> {/* Adjust height as needed */}
                        <Typography variant="h6" gutterBottom>Idea Notes (Markdown Editor)</Typography>
                        <MarkdownEditor /> {/* Placeholder */}
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper elevation={2} sx={{ p: 2, height: 'calc(100vh - 200px)' }}> {/* Adjust height as needed */}
                        <Typography variant="h6" gutterBottom>Draft Wireframe (Excalidraw)</Typography>
                        <ExcalidrawComponent /> {/* Placeholder */}
                    </Paper>
                </Grid>
            </Grid>

            <Box mt={2}>
                <Paper elevation={2} sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>Project Backlog (Trello-style)</Typography>
                    <BacklogBoard /> {/* Placeholder */}
                </Paper>
            </Box>
        </Box>
    );
};

export default ProjectPlanTab;
// Import necessary Material UI components.

// Import placeholder components: MarkdownEditor, ExcalidrawComponent, BacklogBoard (which we'll create next).

// Toolbar at the top with "AI Gen / Improve" button.

// Uses Material UI Grid to create a split-pane layout for Markdown Editor and Excalidraw. (You can use a dedicated split-pane library later if needed).

// Uses Material UI Paper to visually separate sections.

// Placeholder components are rendered in their respective sections.

// Basic layout structure for Idea Notes (Markdown), Wireframe (Excalidraw), and Project Backlog.