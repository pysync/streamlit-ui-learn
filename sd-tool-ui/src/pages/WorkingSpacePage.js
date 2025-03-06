// src/pages/WorkingSpacePage.js
// src/pages/WorkingSpacePage.js
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    Box,
    Drawer,
    Toolbar,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Divider,
    Tabs,
    Tab,
    AppBar,
    Typography,
    Fab, // Import Fab
    Tooltip, // Import Tooltip for Fab
} from '@mui/material';
import NoteIcon from '@mui/icons-material/Note'; // Example icons, adjust as needed
import CodeIcon from '@mui/icons-material/Code';
import AddIcon from '@mui/icons-material/Add';
import ImageIcon from '@mui/icons-material/Image';
import { WorkspaceProvider, useWorkspace } from '../contexts/WorkspaceContext'; // Adjust path if needed
import ProjectPlanTab from '../components/ProjectPlan/ProjectPlanTab'; // Import ProjectPlanTab
import CreateArtifactDialog from '../components/Artifact/CreateArtifactDialog'; // Import CreateArtifactDialog
import WorkspaceSidebar from '../components/Workspace/WorkspaceSidebar'; // Import WorkspaceSidebar

const drawerWidth = 240;

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const WorkingSpacePage = () => {
    const { workspaceId } = useParams();
    const { currentWorkspace } = useWorkspace(); // Consume only currentWorkspace (artifacts are now in Sidebar)
    const [tabValue, setTabValue] = React.useState(0);
    const [selectedArtifact, setSelectedArtifact] = React.useState(null);
    const [isCreateArtifactDialogOpen, setIsCreateArtifactDialogOpen] = useState(false); // State for dialog
    
    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleArtifactSelect = (artifact) => {
      setSelectedArtifact(artifact); // Set selected artifact state
      // You can trigger actions here when an artifact is selected, like opening it in a tab, etc.
      console.log("Selected Artifact:", artifact); // For testing
    };

    const handleCreateArtifactDialogOpen = () => {
        setIsCreateArtifactDialogOpen(true); // Open dialog
    };

    const handleCreateArtifactDialogClose = () => {
        setIsCreateArtifactDialogOpen(false); // Close dialog
    };

    if (!workspaceId) {
        return <div>Error: No Workspace ID provided.</div>; // Basic error handling
    }

    const workspaceIdNumber = parseInt(workspaceId, 1); // Ensure workspaceId is a number

    return (
        //<WorkspaceProvider workspaceId={workspaceIdNumber}> {/* Wrap with WorkspaceProvider */} -> dont need
        <Box sx={{ display: 'flex' }}>
            <AppBar
                position="fixed"
                sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
            >
                <Toolbar>
                    <Typography variant="h6" noWrap component="div">
                        {currentWorkspace ? currentWorkspace.title : 'Loading Workspace...'}
                    </Typography>
                </Toolbar>
            </AppBar>
            <WorkspaceSidebar /> {/* Render WorkspaceSidebar component */}
            <Box
                component="main"
                sx={{ flexGrow: 1, p: 3, ml: `${drawerWidth}px`, width: `calc(100% - ${drawerWidth}px)` }}
            >
                <Toolbar />
                <AppBar position="static" color="default">
                    <Tabs
                        value={tabValue}
                        onChange={handleTabChange}
                        indicatorColor="primary"
                        textColor="primary"
                        variant="scrollable"
                        scrollButtons="auto"
                        aria-label="scrollable auto tabs"
                    >
                        <Tab label="Project Plan" {...a11yProps(0)} />
                        <Tab label="Requirements" {...a11yProps(1)} />
                        <Tab label="Basic Design" {...a11yProps(2)} />
                    </Tabs>
                </AppBar>
                <TabPanel value={tabValue} index={0}>
                    <ProjectPlanTab />
                </TabPanel>
                <TabPanel value={tabValue} index={1}>
                    Requirements Tab Content (Placeholder)
                </TabPanel>
                <TabPanel value={tabValue} index={2}>
                    Basic Design Tab Content (Placeholder)
                </TabPanel>
            </Box>
        </Box>
    );
};

export default WorkingSpacePage;

// Import necessary Material UI components.

// Import WorkspaceProvider and useWorkspace from your context.

// Import ProjectPlanTab component (which we'll create next).

// Uses useParams to get workspaceId from the URL.

// Wraps the entire page with WorkspaceProvider to provide context.

// Basic Drawer (Sidebar) structure to list artifacts. (Currently just lists titles, you can enhance it later).

// Material UI Tabs to handle tab navigation.

// Renders ProjectPlanTab when the first tab is active.

// Placeholder TabPanel components for other tabs.