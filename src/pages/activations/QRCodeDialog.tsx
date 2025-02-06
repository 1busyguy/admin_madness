import React from 'react';

import { Close } from '@mui/icons-material';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  IconButton,
  Button,
  Stack,
} from '@mui/material';

import { Activation } from '../../shared/types';

interface QRCodeDialogProps {
  open: boolean;
  onClose: () => void;
  activation: Activation;
}

export const QRCodeDialog = ({ open, onClose, activation }: QRCodeDialogProps) => {
  if (!activation) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>
        {activation.name}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Stack direction="row">
          {activation.qrCodeUrl ? (
            <img
              src={activation.qrCodeUrl}
              alt="QR Code"
              style={{ display: 'block', margin: 'auto', maxWidth: '100%', height: 'auto' }}
            />
          ) : (
            <Typography variant="body2" color="error">
              QR code not available
            </Typography>
          )}
          {/*{activation.triggeringImage ? (*/}
          {/*  <img*/}
          {/*    src={activation.triggeringImage}*/}
          {/*    alt="Triggering item"*/}
          {/*    style={{ display: 'block', margin: 'auto', maxWidth: 'auto', height: '148px' }}*/}
          {/*  />*/}
          {/*) : (*/}
          {/*  <Typography variant="body2" color="error">*/}
          {/*    Triggering item not available*/}
          {/*  </Typography>*/}
          {/*)}*/}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
