import React from 'react';

import { Snackbar, Alert } from '@mui/material';
import { SnackbarCloseReason } from '@mui/material/Snackbar/Snackbar';

export const NotificationSnackbar = ({
  message,
  open,
  setOpen,
}: {
  message: string;
  open: boolean;
  setOpen: React.Dispatch<any>;
}) => {
  // Close the Snackbar
  const handleClose = (event: React.SyntheticEvent<any> | Event, reason: SnackbarCloseReason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={8000} // Duration the notification is visible in ms
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }} // Position on the screen
    >
      <Alert severity="success" sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};
