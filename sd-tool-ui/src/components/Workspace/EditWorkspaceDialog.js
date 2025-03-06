import React from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from '@mui/material';

export default function EditWorkspaceDialog({
  open,
  handleClose,
  newTitle,
  setNewTitle,
  newDescription,
  setNewDescription,
  handleEditWorkspace,
}) {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Edit Workspace</DialogTitle>
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
        <Button onClick={handleEditWorkspace}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}
