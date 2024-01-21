// components/deleteWorkflowDialog.js
import React from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from '@mui/material';

const DeleteWorkflowDialog = ({ isOpen, onConfirm, onCancel, name }) => {
  return (
    <Dialog
      open={isOpen}
      onClose={onCancel}
      aria-labelledby="delete-dialog-title"
      aria-describedby="delete-dialog-description"
    >
      <DialogTitle id="delete-dialog-title">Delete Confirmation</DialogTitle>
      <DialogContent>
        <DialogContentText id="delete-dialog-description">
          Are you sure you want to delete the workflow with the name {name}?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="primary">
          Cancel
        </Button>
        <Button onClick={onConfirm} color="error">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteWorkflowDialog;
