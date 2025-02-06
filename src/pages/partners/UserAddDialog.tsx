import React from 'react';

import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useQueryClient } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';

import { useAddUser } from '../users/hooks';

export interface CreateUserFormValues {
  name: string;
  email: string;
  password: string;
}

interface AddUserDialogProps {
  open: boolean;
  onClose: () => void;
  partnerId: string;
  partnerName: string;
}

export const UserAddDialog = ({ open, onClose, partnerId, partnerName }: AddUserDialogProps) => {
  const queryClient = useQueryClient();
  const { mutate: addUser, isLoading: isLoadingAddUser } = useAddUser();
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CreateUserFormValues>();

  const onSubmit = (values: CreateUserFormValues) => {
    addUser(
      { ...values, partner: partnerId, role: 'partnerUser' },
      {
        onSuccess: () => {
          reset();
          queryClient.invalidateQueries({ queryKey: ['partners'] });
          onClose();
        },
        onError: () => {
          console.log('Error creating user account');
        },
      },
    );
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        Add user for <b>{partnerName}</b>
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <Controller
                name="name"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="User Name"
                    fullWidth
                    autoComplete="off"
                    error={!!errors.name}
                    helperText={errors.name ? 'User Name is required' : ''}
                  />
                )}
                rules={{ required: true }}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Controller
                name="email"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    autoComplete="off"
                    label="Email"
                    type="email"
                    fullWidth
                    error={!!errors.email}
                    helperText={errors.email ? 'Email is required' : ''}
                  />
                )}
                rules={{ required: true }}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Controller
                name="password"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    autoComplete="off"
                    label="Password"
                    type="password"
                    fullWidth
                    error={!!errors.password}
                    helperText={errors.password ? 'Password is required' : ''}
                    inputProps={{ autoComplete: 'new-password' }}
                  />
                )}
                rules={{ required: true }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" color="primary" disabled={isLoadingAddUser}>
            {isLoadingAddUser ? <CircularProgress size={24} color="inherit" /> : 'Add user'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
