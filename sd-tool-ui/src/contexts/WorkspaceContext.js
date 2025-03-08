// src/contexts/WorkspaceContext.js
import React, { createContext, useState, useContext, useEffect, useCallback} from 'react';
import { getWorkspace,
        getArtifactById,
        listArtifacts,
        createArtifact,
        updateArtifactVersion,
        setArtifactMeta,
        deleteArtifactById,
        uploadArtifact,
        getCurrentArtifact as getArtifactFromAPI
      } from '../services/client';
import { useLoading } from './LoadingContext';
import { useMessage } from './MessageContext';
import { v4 as uuidv4 } from 'uuid'; // Import UUID generator
import { ARTIFACT_TYPE_OPTIONS } from '../constants/sdlcConstants';
import { generateDocumentId } from '../utils/documentUtils';

const WorkspaceContext = createContext();

export const WorkspaceProvider = ({ children, workspaceId }) => {
    const [currentWorkspace, setCurrentWorkspace] = useState(null);
    const [artifacts, setArtifacts] = useState(null);
    const [openedArtifacts, setOpenedArtifacts] = useState([]); // Opened artifacts state
    const [activeArtifactDocumentId, setActiveArtifactDocumentId] = useState(null); // Active tab state
    const [activeArtifact, setActiveArtifact] = useState(null); // The active artifact object
    const [isLoading, setIsLoading] = useState(false);
    const [artifactTypeSettings, setArtifactTypeSettings] = useState(
        ARTIFACT_TYPE_OPTIONS.reduce((acc, type) => ({
            ...acc,
            [type.value]: { isSticky: false }
        }), {})
    );
    const [showArtifactTypeList, setShowArtifactTypeList] = useState(null);

    const { loading, showLoading, hideLoading } = useLoading()
    const { showError, clearMessage } = useMessage()

    // Effect to update activeArtifact when activeArtifactDocumentId changes
    useEffect(() => {
        if (activeArtifactDocumentId) {
            // First check in opened artifacts (which includes unsaved new artifacts)
            const openedArtifact = openedArtifacts.find(
                art => art.document_id === activeArtifactDocumentId
            );
            
            if (openedArtifact) {
                setActiveArtifact(openedArtifact);
            } else if (artifacts && artifacts.items) {
                // If not found in opened artifacts, check in all artifacts
                const foundArtifact = artifacts.items.find(
                    art => art.document_id === activeArtifactDocumentId
                );
                
                if (foundArtifact) {
                    setActiveArtifact(foundArtifact);
                }
            }
        } else {
            setActiveArtifact(null);
        }
    }, [activeArtifactDocumentId, openedArtifacts, artifacts]);

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
        showLoading();
        try {
            // Ensure we have a document_id
            const documentId = artifactData.document_id || generateDocumentId();
            
            // First check if we already have an active artifact with this document_id
            // This handles the case of a "New Note" being saved
            if (activeArtifact && activeArtifact.document_id === documentId) {
                // Merge the current active artifact data with the provided data
                // This ensures we use the latest values from both sidebar and editor
                artifactData = {
                    ...activeArtifact,
                    ...artifactData,
                    document_id: documentId,
                    workspace_id: currentWorkspace.id
                };
            }
            
            const newArtifact = await createArtifact(currentWorkspace.id, {
                ...artifactData,
                document_id: documentId,
                content: artifactData.content || '',
                dependencies: artifactData.dependencies || []
            });

            // Update artifacts list
            setArtifacts(currentArtifacts => {
                if (!currentArtifacts || !currentArtifacts.items) {
                    return { items: [newArtifact] };
                }
                return {
                    ...currentArtifacts,
                    items: [newArtifact, ...currentArtifacts.items] // add to top
                };
            });

            // Update opened artifacts if this was a temp one
            if (artifactData.isNew) {
                // add to top and remove flag isNew
                setOpenedArtifacts(current => 
                    current.map(art => 
                        art.document_id === artifactData.document_id ? {
                            ...newArtifact,
                            isNew: false
                        } : art
                    )
                );
            } else {
                // Add to opened artifacts if not already there
                addOpenedArtifact(newArtifact);
            }

            // Set as active
            setActiveArtifactDocumentId(documentId);
            
            return newArtifact;
        } catch (error) {
            console.error("Error creating artifact:", error);
            showError("Failed to create artifact.");
            throw error;
        } finally {
            hideLoading();
        }
    };

    const execUpdateArtifact = async (documentId, artifactData) => {
        showLoading();
        try {
            console.log("execUpdateArtifact: artifactData = ", artifactData);
            
            const updatedArtifact = await updateArtifactVersion(documentId, artifactData);
            
            // Update the artifact in the artifacts list without reloading everything
            setArtifacts(currentArtifacts => {
                if (!currentArtifacts || !currentArtifacts.items) return currentArtifacts;
                
                return {
                    ...currentArtifacts,
                    items: currentArtifacts.items.map(artifact => {
                        if (artifact.document_id === documentId) {
                            return updatedArtifact; // Replace with updated artifact
                        }
                        return artifact;
                    })
                };
            });
            
            // Also update in opened artifacts list
            updateOpenedArtifactInList(updatedArtifact);
            
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
        
        // Update openedArtifacts state
        setOpenedArtifacts(currentArtifacts => {
            return currentArtifacts.map(openedArtifact => {
                if (openedArtifact.document_id === updatedArtifact.document_id) {
                    return updatedArtifact; // Replace with updated artifact
                }
                return openedArtifact; // Keep existing artifact
            });
        });
        
        // If it's already in the artifacts list, update it there too
        setArtifacts(currentArtifacts => { 
            if (!currentArtifacts || !currentArtifacts.items) return currentArtifacts;
            
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
        
        // If this is the active artifact, update activeArtifact directly too
        if (activeArtifactDocumentId === updatedArtifact.document_id) {
            setActiveArtifact(updatedArtifact);
        }
    }, [setOpenedArtifacts, setArtifacts, activeArtifactDocumentId]);


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

    const selectArtifact = (documentId) => {
        setActiveArtifactDocumentId(documentId);
        
        // Also update the activeArtifact object
        if (documentId) {
            const found = openedArtifacts.find(a => a.document_id === documentId);
            if (found) {
                setActiveArtifact(found);
            }
        }
    };

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

    const fetchArtifacts = async (workspaceId) => {
        try {
            setIsLoading(true);
            const artifactsData = await listArtifacts(workspaceId);
            setArtifacts(artifactsData);
        } catch (error) {
            console.error('Error fetching artifacts:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const getCurrentArtifact = async (documentId) => {
        try {
            const artifact = await getArtifactFromAPI(documentId);
            return artifact;
        } catch (error) {
            console.error('Error getting current artifact:', error);
            throw error;
        }
    };

    const toggleSticky = (typeValue) => {
        setArtifactTypeSettings(current => ({
            ...current,
            [typeValue]: {
                ...current[typeValue],
                isSticky: !current[typeValue]?.isSticky
            }
        }));
    };

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
        openedArtifacts,       // Opened artifacts list
        addOpenedArtifact,     // Add artifact to opened list  
        removeOpenedArtifact,  // Remove artifact from opened list
        activeArtifactDocumentId, // Document ID of active artifact
        activeArtifact,        // The active artifact object (can be an opened artifact or a new unsaved one)
        selectArtifact,        // Select artifact by document ID
        updateOpenedArtifactInList, // Update an artifact in the opened list
        addNewEmptyArtifactToOpenedList, // Add a new empty artifact
        setActiveArtifactDocumentId, // Set active artifact by document ID
        fetchArtifacts,
        getCurrentArtifact,
        artifactTypeSettings,
        toggleSticky,
        showArtifactTypeList,
        setShowArtifactTypeList,
        setActiveArtifact,
    };

    return (
        <WorkspaceContext.Provider value={value}>
            {children}
        </WorkspaceContext.Provider>
    );
};

export const useWorkspace = () => useContext(WorkspaceContext);