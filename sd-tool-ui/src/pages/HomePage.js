import React, { useEffect, useState } from 'react';
import { Box, Button, Stack } from '@mui/material';
import { getWorkspaces, createWorkspace, updateWorkspace, deleteWorkspace } from '../services/client';
import WorkspaceTable from '../components/workspace/WorkspaceTable';
import CreateWorkspaceDialog from '../components/workspace/CreateWorkspaceDialog';
import EditWorkspaceDialog from '../components/workspace/EditWorkspaceDialog';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { useLoading } from '../contexts/LoadingContext';
import { useMessage } from '../contexts/MessageContext';
import LoadingIndicator from '../components/common/LoadingIndicator';
import MessageSnackbar from '../components/common/MessageSnackbar';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const [workspaces, setWorkspaces] = useState([]);
  const [total, setTotal] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false); // Create dialog
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);

  const { showLoading, hideLoading } = useLoading();
  const { showError } = useMessage();

  const navigate = useNavigate();


  const fetchWorkspaces = async () => {
    try {
      showLoading();
      // For demo purposes, fetching the first 100 workspaces
      const response = await getWorkspaces(1, 100);
      setWorkspaces(response.items);
      setTotal(response.total);
      hideLoading();
    } catch (error) {
      hideLoading();
      showError(error.message || 'Error fetching workspaces');
      console.error('Error fetching workspaces:', error);
    }
  };

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  // Update selected rows from WorkspaceTable
  const handleSelectionChange = (selectedIds) => {
    setSelectedIds(selectedIds);
    // If exactly one row is selected, capture that workspace data for editing
    if (selectedIds.length === 1) {
      const ws = workspaces.find((w) => w.id === selectedIds[0]);
      setSelectedWorkspace(ws);
    } else {
      setSelectedWorkspace(null);
    }
  };

  // --- Create Workspace ---
  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setNewTitle('');
    setNewDescription('');
  };

  const handleCreateWorkspace = async () => {
    try {
      showLoading();
      await createWorkspace(newTitle, newDescription);
      hideLoading();
      handleDialogClose();
      fetchWorkspaces();
    } catch (error) {
      hideLoading();
      showError(error.message || 'Error creating workspace');
      console.error('Error creating workspace:', error);
    }
  };

  // --- Edit Workspace ---
  const handleEditOpen = () => {
    if (selectedWorkspace) {
      setNewTitle(selectedWorkspace.title);
      setNewDescription(selectedWorkspace.description || '');
      setEditDialogOpen(true);
    }
  };

  const handleEditClose = () => {
    setEditDialogOpen(false);
    setNewTitle('');
    setNewDescription('');
  };

  const handleEditWorkspace = async () => {
    try {
      showLoading();
      await updateWorkspace(selectedWorkspace.id, newTitle, newDescription);
      hideLoading();
      handleEditClose();
      fetchWorkspaces();
    } catch (error) {
      hideLoading();
      showError(error.message || 'Error updating workspace');
      console.error('Error updating workspace:', error);
    }
  };

  // --- Delete Workspace(s) ---
  const handleDeleteOpen = () => {
    if (selectedIds.length > 0) {
      setConfirmDialogOpen(true);
    }
  };

  const handleDeleteCancel = () => {
    setConfirmDialogOpen(false);
  };

  const handleDeleteConfirm = async () => {
    try {
      showLoading();
      // Delete each selected workspace
      for (const id of selectedIds) {
        await deleteWorkspace(id);
      }
      hideLoading();
      setConfirmDialogOpen(false);
      setSelectedIds([]);
      fetchWorkspaces();
    } catch (error) {
      hideLoading();
      showError(error.message || 'Error deleting workspace(s)');
      console.error('Error deleting workspace(s):', error);
    }
  };

  // Optional: handle row clicks if needed
  const handleRowClick = (row) => {
      navigate(`/workspace/${row.id}`);
  };

  return (
    <Box sx={{ width: '100%', p: 2 }}>
      {/* Global Loading & Message Indicators */}
      <LoadingIndicator />
      <MessageSnackbar />

      <Stack direction="row" spacing={2} sx={{ mb: 2 }} justifyContent="flex-end">
        <Button variant="contained" color="primary" onClick={handleDialogOpen}>
          Create Workspace
        </Button>
        <Button
          variant="contained"
          onClick={handleEditOpen}
          disabled={selectedIds.length !== 1}
        >
          Edit
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={handleDeleteOpen}
          disabled={selectedIds.length === 0}
        >
          Delete{selectedIds.length > 1 ? 's' : ''}
        </Button>
      </Stack>

      <WorkspaceTable
        rows={workspaces}
        total={total}
        onRowClick={handleRowClick}
        onSelectionChange={handleSelectionChange}
      />

      <CreateWorkspaceDialog
        open={dialogOpen}
        handleClose={handleDialogClose}
        newTitle={newTitle}
        setNewTitle={setNewTitle}
        newDescription={newDescription}
        setNewDescription={setNewDescription}
        handleCreateWorkspace={handleCreateWorkspace}
      />

      <EditWorkspaceDialog
        open={editDialogOpen}
        handleClose={handleEditClose}
        newTitle={newTitle}
        setNewTitle={setNewTitle}
        newDescription={newDescription}
        setNewDescription={setNewDescription}
        handleEditWorkspace={handleEditWorkspace}
      />

      <ConfirmDialog
        open={confirmDialogOpen}
        title="Confirm Delete"
        content={`Are you sure you want to delete the selected workspace${selectedIds.length > 1 ? 's' : ''}?`}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </Box>
  );
}


/*

Key Features for WorkspacePage
List Workspaces

Display workspaces in a table or card layout.
Use pagination or lazy loading if necessary.
Create New Workspace

Button to open a dialog for creating a new workspace.
Fields: Name, Description, etc.
Submit button calls API and refreshes the list.
Edit Workspace

When a workspace is selected, show an Edit button.
Clicking edit opens the same dialog as "Create," but pre-filled with existing data.
API call updates the workspace and refreshes the list.
Delete Workspace

When a workspace is selected, show a Delete button.
Clicking delete shows a confirmation dialog.
If confirmed, call the API to delete and refresh the list.
Loading & Error Handling

Show a loading indicator during API calls.
Handle errors with a consistent error notification across the app.
*/