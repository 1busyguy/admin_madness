import React, { useState } from 'react';

import ImageIcon from '@mui/icons-material/Image';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Box,
  CircularProgress,
  Avatar,
  Stack,
} from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';

import { useCreatePartner } from './hooks';
import { NAME_MAX_LENGTH } from '../../shared/constants';
import { UploadImageResponse, useUploadImage } from '../../shared/hooks';
import { isNilOrEmpty } from '../../shared/utils';

export interface CreatePartnerFormValues {
  name: string;
  description: string;
  logoImage: string;
  firstUser: {
    name: string;
    email: string;
    password: string;
  };
}

interface CreateUserDialogProps {
  open: boolean;
  onClose: () => void;
}

export const CreatePartnerDialog = ({ open, onClose }: CreateUserDialogProps) => {
  const queryClient = useQueryClient();
  const { mutate: uploadImage, isLoading: isLoadingUploadingImage } = useUploadImage();
  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
    reset,
  } = useForm<CreatePartnerFormValues>();
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleOnClose = () => {
    reset();
    setPreviewImage(null);
    onClose();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadImage(file, {
        onSuccess: (data: UploadImageResponse) => {
          setValue('logoImage', data.url);
        },
        onError: () => {},
      });

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const { mutate: createPartner, isLoading: isLoadingCreatingPartner } = useCreatePartner();

  const onSubmit = (values: CreatePartnerFormValues) => {
    createPartner(values, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['partners'] });
        handleOnClose();
      },
      onError: () => {
        console.log('Error creating partner account');
      },
    });
  };

  return (
    <Dialog open={open} onClose={handleOnClose} fullWidth maxWidth="sm">
      <DialogTitle>Create Partner Account</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <DialogContent>
          <Grid container spacing={2}>
            {/* Main Account Info */}
            <Grid item xs={12}>
              <Box display="flex" flexDirection="column" alignItems="center" my={2}>
                {previewImage ? (
                  <Avatar
                    src={previewImage}
                    sx={{ width: 100, height: 100, borderRadius: '50%' }}
                    alt="avatar preview"
                  />
                ) : (
                  <Stack
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    sx={{ width: 100, height: 100, border: '1px dashed grey', borderRadius: 16 }}
                  >
                    <ImageIcon fontSize="large" color="action" />
                  </Stack>
                )}
                <input
                  accept="image/*"
                  type="file"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                  id="image-upload"
                />
                <label htmlFor="image-upload">
                  <Button variant="contained" color="primary" component="span" sx={{ mt: 2 }}>
                    {isLoadingUploadingImage ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : previewImage ? (
                      'Change avatar'
                    ) : (
                      'Upload avatar'
                    )}
                  </Button>
                </label>
              </Box>
              <Controller
                name="name"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Company or Brand Name"
                    inputProps={{ maxLength: NAME_MAX_LENGTH }}
                    fullWidth
                    error={!!errors.name}
                    helperText={isNilOrEmpty(errors.name?.message) ? '' : errors.name?.message}
                  />
                )}
                rules={{
                  required: {
                    value: true,
                    message: 'Company or Brand Name is required',
                  },
                  maxLength: {
                    value: NAME_MAX_LENGTH,
                    message: `Company or Brand Name must not exceed ${NAME_MAX_LENGTH} characters`,
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="description"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Description"
                    inputProps={{ maxLength: 150 }}
                    fullWidth
                    multiline
                    error={!!errors.description}
                    helperText={isNilOrEmpty(errors.description?.message) ? '' : errors.description?.message}
                  />
                )}
                rules={{
                  required: {
                    value: true,
                    message: 'Description is required',
                  },
                  maxLength: {
                    value: 150,
                    message: 'Description must not exceed 150 characters',
                  },
                }}
              />
            </Grid>

            {/* First User Info */}
            <Box mt={2}>
              <DialogTitle>Main user Info</DialogTitle>
            </Box>
            <Grid item xs={12}>
              <Controller
                name="firstUser.name"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="User Name"
                    autoComplete="new-password"
                    fullWidth
                    error={!!errors.firstUser?.name}
                    helperText={errors.firstUser?.name ? 'User Name is required' : ''}
                  />
                )}
                rules={{ required: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="firstUser.email"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Email"
                    autoComplete="off"
                    type="email"
                    fullWidth
                    error={!!errors.firstUser?.email}
                    helperText={errors.firstUser?.email ? 'Email is required' : ''}
                  />
                )}
                rules={{ required: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="firstUser.password"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Password"
                    autoComplete="new-password"
                    type="password"
                    fullWidth
                    error={!!errors.firstUser?.password}
                    helperText={errors.firstUser?.password ? 'Password is required' : ''}
                  />
                )}
                rules={{ required: true }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleOnClose}>Cancel</Button>
          <Button type="submit" color="primary" disabled={isLoadingCreatingPartner}>
            {isLoadingCreatingPartner ? <CircularProgress size={24} color="inherit" /> : 'Create Partner'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
