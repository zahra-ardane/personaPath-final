// components/DeleteTestDialog.js
import React from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Typography,
} from '@mui/material';

const DeleteTestDialog = ({ isOpen, onConfirm, onCancel, questionName }) => {
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
          <Typography variant="body2" style={{ height: 'auto', overflow: 'hidden' }}>
            Are you sure you want to delete the question with the name {questionName}?
          </Typography>
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

export default DeleteTestDialog;
