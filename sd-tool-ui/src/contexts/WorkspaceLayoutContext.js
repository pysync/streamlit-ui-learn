import React, { createContext, useContext, useState } from 'react';

// Create the context
const WorkspaceLayoutContext = createContext();

// Provider component that wraps your app and makes layout mode available to any
// child component that calls useWorkspaceLayout().
export const WorkspaceLayoutProvider = ({ children }) => {
  // State for layout mode with default value 'single'
  const [layoutMode, setLayoutMode] = useState('single'); // 'single', 'vertical', 'horizontal'
  
  // The context value that will be supplied to any descendants of this provider
  const contextValue = {
    layoutMode,     // Current layout mode state
    setLayoutMode,  // Function to update layout mode
  };
  
  return (
    <WorkspaceLayoutContext.Provider value={contextValue}>
      {children}
    </WorkspaceLayoutContext.Provider>
  );
};

// Custom hook that shorthands the context!
export const useWorkspaceLayout = () => {
  const context = useContext(WorkspaceLayoutContext);
  
  if (!context) {
    throw new Error('useWorkspaceLayout must be used within a WorkspaceLayoutProvider');
  }
  
  return context; // Returns { layoutMode, setLayoutMode }
}; 