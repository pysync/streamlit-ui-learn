// src/routes/AppRoutes.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import WorkingSpacePage from '../pages/WorkingSpacePage';
import { WorkspaceProvider } from '../contexts/WorkspaceContext'; // Import WorkspaceProvider

const WorkingSpaceRoute = () => { // Wrapper Component
  const { workspaceId } = useParams(); // Get workspaceId from URL
  return (
    <WorkspaceProvider workspaceId={workspaceId}> {/* Explicitly pass workspaceId as prop */}
      <WorkingSpacePage />
    </WorkspaceProvider>
  );
};

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/workspace/:workspaceId" element={<WorkingSpaceRoute />} /> {/* Use WorkingSpaceRoute */}
      </Routes>
    </Router>
  );
};

export default AppRoutes;