// src/contexts/WorkspaceContext.js
import React, { createContext, useState, useContext, useEffect, useCallback} from 'react';
import { getWorkspace,
        getArtifactById,
        listArtifacts,
        createArtifact,
        updateArtifactVersion,
        setArtifactMeta,
        deleteArtifactById,
        uploadArtifact
      } from '../services/client';
import { useLoading } from './LoadingContext';
import { useError } from './ErrorContext';
import { v4 as uuidv4 } from 'uuid'; // Import UUID generator

const WorkspaceContext = createContext();

export const WorkspaceProvider = ({ children, workspaceId }) => {
    const [currentWorkspace, setCurrentWorkspace] = useState(null);
    const [artifacts, setArtifacts] = useState(null);
    const [openedArtifacts, setOpenedArtifacts] = useState([]); // Opened artifacts state - moved here
    const [activeArtifactDocumentId, setActiveArtifactDocumentId] = useState(null); // Active tab state - moved here


    const { loading, showLoading, hideLoading } = useLoading()
    const { showError, clearError } = useError()

    console.log("working on: ", workspaceId, "have data: ", currentWorkspace);
    console.log("working on artifacts: ", artifacts);

    useEffect(() => {
        if (workspaceId) {
            console.log("START>..... loading for workspaceId:", workspaceId) // Log workspaceId at start
            const fetchWorkspaceAndArtifacts = async () => {
                if (workspaceId) {
                  showLoading();
                    try {
                        const workspaceData = await getWorkspace(workspaceId);
                        console.log("Set current work space: ", workspaceData);
                        setCurrentWorkspace(workspaceData);
                        const artifactsData = await listArtifacts(workspaceId);
                        setArtifacts(artifactsData);
                
                    } catch (error) {
                        console.error("Error fetching workspace or artifacts:", error);
                        showError("Failed to load workspace data. Please try again.");
                    } finally {
                      hideLoading();
                      console.log("FINISH>..... load for workspace"); // Log at the end of fetch
                    }
                }
            };
    
            fetchWorkspaceAndArtifacts();
        }
    }, [workspaceId, ]);

    const execLoadArtifacts = async () => {
        if (currentWorkspace) {
          showLoading();
            try {
                const artifactsData = await listArtifacts(currentWorkspace.id);
                setArtifacts(artifactsData);
            } catch (error) {
                console.error("Error fetching artifacts:", error);
                showError("Failed to refresh artifact list.");
            } finally {
              hideLoading();
            }
        }
    };

    const execCreateArtifact = async (artifactData) => {
        console.log("currentWorkspace: ", currentWorkspace);
        showLoading();
        try {
            const newArtifact = await createArtifact(currentWorkspace.id, artifactData);
            await execLoadArtifacts();
            return newArtifact;
        } catch (error) {
            console.error("Error creating artifact:", error);
            showError("Failed to create new artifact.");
            throw error;
        } finally {
            hideLoading();
        }
    };

    const execUpdateArtifact = async (documentId, artifactData) => {
        showLoading();
        try {
            const updatedArtifact = await updateArtifactVersion(documentId, artifactData);
            await execLoadArtifacts();
            updateOpenedArtifactInList(updatedArtifact); // Update opened artifacts list
            return updatedArtifact;
        } catch (error) {
            console.error("Error updating artifact:", error);
            showError("Failed to update artifact.");
            throw error;
        } finally {
           hideLoading();
        }
    };

    const execSetArtifactMeta = async (documentId, artifactData) => {
        showLoading();
        try {
            const updatedArtifact = await setArtifactMeta(documentId, artifactData);
            await execLoadArtifacts();
            return updatedArtifact;
        } catch (error) {
            console.error("Error setmeta data for artifact:", error);
            showError("Failed to setmeta data for artifact.");
            throw error;
        } finally {
           hideLoading();
        }
    };

    const updateOpenedArtifactInList = useCallback((updatedArtifact) => {
        setOpenedArtifacts(currentArtifacts => {
            return currentArtifacts.map(openedArtifact => {
                if (openedArtifact.document_id === updatedArtifact.document_id) {
                    return updatedArtifact; // Replace with updated artifact
                }
                return openedArtifact; // Keep existing artifact
            });
        });
        setArtifacts(currentArtifacts => { // Update artifacts list too for sidebar sync
            if (!currentArtifacts || !currentArtifacts.items) return currentArtifacts; // Check if artifacts or artifacts.items is null
            return {
                ...currentArtifacts,
                items: currentArtifacts.items.map(artifact => {
                    if (artifact.document_id === updatedArtifact.document_id) {
                        return updatedArtifact; // Replace in artifacts list
                    }
                    return artifact;
                })
            };
        });
    }, [setOpenedArtifacts, setArtifacts]);


    const addOpenedArtifact = useCallback((artifact) => { // Moved from OpenedArtifactsContext
        setOpenedArtifacts(currentArtifacts => {
            if (currentArtifacts.some(art => art.document_id === artifact.document_id)) {
                return currentArtifacts;
            }
            return [...currentArtifacts, artifact];
        });
        setActiveArtifactDocumentId(artifact.document_id);
    }, []);

    const removeOpenedArtifact = useCallback((documentId) => { // Moved from OpenedArtifactsContext
        setOpenedArtifacts(currentArtifacts => {
            return currentArtifacts.filter(artifact => artifact.document_id !== documentId);
        });
        setActiveArtifactDocumentId(null);
    }, []);

    const setActiveArtifact = useCallback((documentId) => { // Moved from OpenedArtifactsContext
        setActiveArtifactDocumentId(documentId);
    }, []);

    const addNewEmptyArtifactToOpenedList = useCallback(() => {
        const tempDocumentId = uuidv4(); // Generate a temporary document_id
        const newArtifact = {
            document_id: tempDocumentId, // Use temp document_id
            title: "New Note",           // Default title
            content: "",                // Empty content
            art_type: "note",           // Default art_type
            isNew: true,                // Flag to indicate it's a new, unsaved artifact
        };

        setOpenedArtifacts(currentArtifacts => [...currentArtifacts, newArtifact]);
        setActiveArtifactDocumentId(tempDocumentId); // Set the new artifact as active
    }, [setOpenedArtifacts, setActiveArtifactDocumentId]);

    const value = {
        currentWorkspace,
        setCurrentWorkspace,
        artifacts,
        setArtifacts,
        execLoadArtifacts,
        execCreateArtifact,
        execUpdateArtifact,
        uploadArtifact,
        execSetArtifactMeta,
        updateArtifactVersion,

        openedArtifacts,       // Include openedArtifacts in context value
        addOpenedArtifact,     // Include addOpenedArtifact in context value
        removeOpenedArtifact,  // Include removeOpenedArtifact in context value
        activeArtifactDocumentId, // Include activeArtifactDocumentId in context value
        setActiveArtifact,     // Include setActiveArtifact in context value
        updateOpenedArtifactInList, 
        addNewEmptyArtifactToOpenedList,
        setActiveArtifactDocumentId,
    };

    return (
        <WorkspaceContext.Provider value={value}>
            {children}
        </WorkspaceContext.Provider>
    );
};

export const useWorkspace = () => useContext(WorkspaceContext);