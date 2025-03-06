// src/components/ProjectPlan/ExcalidrawComponent.js
import React from 'react';
import { Box, Typography } from '@mui/material';

const ExcalidrawComponent = () => {
    return (
        <Box style={{ height: '400px', border: '1px dashed gray', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Typography variant="subtitle1" color="textSecondary">
                Excalidraw Component Placeholder
            </Typography>
            {/* In future, integrate the actual Excalidraw library here */}
        </Box>
    );
};

export default ExcalidrawComponent;