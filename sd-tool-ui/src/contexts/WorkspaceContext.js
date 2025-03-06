// src/contexts/WorkspaceContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { getWorkspace,
        getArtifactById,
        listArtifacts,
        createArtifact,
        updateArtifactVersion,
        deleteArtifactById,
        uploadArtifact
      } from '../services/client';
import { useLoading } from './LoadingContext';
import { useError } from './ErrorContext';

const WorkspaceContext = createContext();

export const WorkspaceProvider = ({ children, workspaceId }) => {
    const [currentWorkspace, setCurrentWorkspace] = useState(null);
    const [artifacts, setArtifacts] = useState(null);

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
            return updatedArtifact;
        } catch (error) {
            console.error("Error updating artifact:", error);
            showError("Failed to update artifact.");
            throw error;
        } finally {
           hideLoading();
        }
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
    };

    return (
        <WorkspaceContext.Provider value={value}>
            {children}
        </WorkspaceContext.Provider>
    );
};

export const useWorkspace = () => useContext(WorkspaceContext);