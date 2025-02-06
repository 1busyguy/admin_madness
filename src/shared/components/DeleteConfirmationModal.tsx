import React from 'react';

import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography } from '@mui/material';

interface DeleteConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onDelete: (id: string) => void;
  itemName: string;
  itemId: string;
  title: string;
}

export const DeleteConfirmationModal = ({
  open,
  onClose,
  onDelete,
  itemName,
  itemId,
  title,
}: DeleteConfirmationModalProps) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="delete-confirmation-title"
      aria-describedby="delete-confirmation-description"
    >
      <DialogTitle id="delete-confirmation-title">{title}</DialogTitle>
      <DialogContent sx={{ minWidth: '300px' }}>
        <Typography variant="body1" component="span">
          Are you sure you want to delete
          <Typography variant="body1" component="span" sx={{ ml: 0.5, fontWeight: '900' }}>
            {itemName}
          </Typography>
          ? This action cannot be undone.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={() => onDelete(itemId)} color="error" variant="contained">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};
