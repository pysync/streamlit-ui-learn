import React from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from '@mui/material';

export default function CreateWorkspaceDialog({
  open,
  handleClose,
  newTitle,
  setNewTitle,
  newDescription,
  setNewDescription,
  handleCreateWorkspace,
}) {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Create New Workspace</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Title"
          type="text"
          fullWidth
          variant="standard"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Description"
          type="text"
          fullWidth
          variant="standard"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleCreateWorkspace}>Create</Button>
      </DialogActions>
    </Dialog>
  );
}
