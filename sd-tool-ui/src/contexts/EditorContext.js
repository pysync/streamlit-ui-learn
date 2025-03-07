import React, { createContext, useContext, useState, useCallback } from 'react';

const EditorContext = createContext();

export const EditorProvider = ({ children }) => {
    const [saveHandler, setSaveHandler] = useState(null);
    const [fullscreenHandler, setFullscreenHandler] = useState(null);
    
    const registerSaveHandler = useCallback((handler) => {
        setSaveHandler(() => handler);
    }, []);
    
    const registerFullscreenHandler = useCallback((handler) => {
        setFullscreenHandler(() => handler);
    }, []);
    
    const triggerSave = useCallback(() => {
        if (typeof saveHandler === 'function') {
            saveHandler();
        }
    }, [saveHandler]);
    
    const triggerFullscreen = useCallback(() => {
        if (typeof fullscreenHandler === 'function') {
            fullscreenHandler();
        }
    }, [fullscreenHandler]);
    
    return (
        <EditorContext.Provider value={{
            registerSaveHandler,
            registerFullscreenHandler,
            triggerSave,
            triggerFullscreen
        }}>
            {children}
        </EditorContext.Provider>
    );
};

export const useEditor = () => useContext(EditorContext); 