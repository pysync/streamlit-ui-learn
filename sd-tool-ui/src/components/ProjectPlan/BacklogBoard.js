// src/components/ProjectPlan/BacklogBoard.js
import React from 'react';
import { Box, Typography } from '@mui/material';

const BacklogBoard = () => {
    return (
        <Box style={{ height: '300px', border: '1px dashed gray', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Typography variant="subtitle1" color="textSecondary">
                Backlog Board (Kanban) Placeholder
            </Typography>
            {/* In future, implement the Kanban board here */}
        </Box>
    );
};

export default BacklogBoard;