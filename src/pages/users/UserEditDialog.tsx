import React, { useEffect } from 'react';

import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  TextField,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useQueryClient } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';

import { useEditUser } from './hooks';
import { User } from '../../shared/types';
import { isNilOrEmpty } from '../../shared/utils';

export interface UpdateUserFormValues {
  name: string;
  email: string;
  password: string;
  passwordNew: string;
  passwordConfirmation: string;
  role: string;
  partner: string;
}

interface UserEditDialogProps {
  open: boolean;
  onClose: () => void;
  user: User;
}

export const UserEditDialog = ({ open, onClose, user }: UserEditDialogProps) => {
  const queryClient = useQueryClient();
  const { mutate: updateUser, isLoading: isLoadingUpdatingUser } = useEditUser();
  const {
    handleSubmit,
    control,
    formState: { errors },
    getValues,
    reset,
  } = useForm<UpdateUserFormValues>({
    defaultValues: {
      name: user?.name,
      email: user?.email,
      password: user?.password,
      passwordNew: '',
      passwordConfirmation: '',
      role: user?.role,
      partner: user?.partner,
    },
  });

  useEffect(() => {
    reset({
      name: user?.name,
      email: user?.email,
      password: user?.password,
      role: user?.role,
      partner: user?.partner,
      passwordNew: '',
      passwordConfirmation: '',
    });
  }, [reset, user]);

  const onSubmit = (values: UpdateUserFormValues) => {
    const newPassword = values.passwordNew;
    const newPasswordConfirmation = values.passwordConfirmation;
    let password = values.password;
    if (
      newPassword &&
      newPasswordConfirmation &&
      !isNilOrEmpty(newPassword) &&
      !isNilOrEmpty(newPasswordConfirmation)
    ) {
      if (newPassword === newPasswordConfirmation) {
        password = newPassword;
      }
    }

    updateUser(
      { userId: user._id, data: { ...values, password } },
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
        Edit <b>{user.name}</b>
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
              <Divider component="div" />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Controller
                name="passwordNew"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="New password"
                    type="password"
                    fullWidth
                    error={!!errors.passwordNew}
                    helperText={errors.passwordNew?.message}
                  />
                )}
                rules={{
                  validate: (value) => {
                    const passwordConfirmation = getValues().passwordConfirmation;
                    if (isNilOrEmpty(passwordConfirmation)) {
                      return true;
                    }
                    if (isNilOrEmpty(value)) {
                      return 'New password is required';
                    }
                    return value === passwordConfirmation || 'Passwords do not match';
                  },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Controller
                name="passwordConfirmation"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Confirm new password"
                    type="password"
                    fullWidth
                    error={!!errors.passwordConfirmation}
                    helperText={errors.passwordConfirmation?.message}
                  />
                )}
                rules={{
                  validate: (value) => {
                    const newPassword = getValues().passwordNew;
                    if (isNilOrEmpty(newPassword)) {
                      return true;
                    }
                    if (isNilOrEmpty(value)) {
                      return 'Password confirmation is required';
                    }
                    return value === newPassword || 'Passwords do not match';
                  },
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" color="primary" disabled={isLoadingUpdatingUser}>
            {isLoadingUpdatingUser ? <CircularProgress size={24} color="inherit" /> : 'Update user'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
