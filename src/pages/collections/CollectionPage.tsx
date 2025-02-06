import React, { useEffect, useState } from 'react';

import { Close, DriveFolderUpload, DeleteForever } from '@mui/icons-material';
import ImageIcon from '@mui/icons-material/Image';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  Paper,
  Select,
  OutlinedInput,
  MenuItem,
  SelectChangeEvent,
  CircularProgress,
  Alert,
  IconButton,
  Stack,
} from '@mui/material';
import { useMatch, useNavigate } from '@tanstack/react-location';
import { Controller, useForm } from 'react-hook-form';

import { useCollections, useCreateCollection, useUpdateCollection } from './hooks';
import { CollectionData } from './types';
import { collectionsUrl, loginUrl } from '../../Routing';
import { ActivationsMultiSelect } from './components/ActivationsMultiSelect';
import { VIEW_MODE } from '../../shared/constants';
import { UploadImageResponse, useGetUserData, useUploadImage } from '../../shared/hooks';
import { Activation, Collection, ViewMode } from '../../shared/types';
import { isNilOrEmpty, resizeImage } from '../../shared/utils';
import { isAuthenticated } from '../../shared/utils/auth';
import { GHOST_IMAGE_SIZE } from '../activations/constants';
import { useActivations } from '../activations/hooks';

const tagOptions = ['Education', 'Technology', 'Sports', 'Entertainment', 'Business', 'Art'];

export const CollectionPage = ({ viewMode }: { viewMode: ViewMode }) => {
  const match = useMatch();
  const { collectionId } = match.params;
  const updating = viewMode === VIEW_MODE.UPDATE;

  const {
    mutate: updateCollection,
    isLoading: isLoadingUpdatingCollection,
    isError: isErrorOnUpdatingCollection,
  } = useUpdateCollection();

  const {
    mutate: createCollection,
    isLoading: isLoadingCreatingCollection,
    isError: isErrorOnCreatingCollection,
  } = useCreateCollection();

  const {
    mutate: uploadImage,
    isLoading: isLoadingUploadingImage,
    isError: isErrorOnUploadingImage,
  } = useUploadImage();

  const { data: user, isLoading: isLoadingUser } = useGetUserData();

  const { data: collections, isLoading: isLoadingCollections } = useCollections({ partnerId: user?.partner });
  const collection = collections?.find((c: Collection) => c._id === collectionId) as Collection;
  const { data: activations, isLoading: isLoadingActivations } = useActivations({ partnerId: user?.partner });
  const [selectedActivations, setSelectedActivations] = useState<Activation[]>([]);

  const [error, setError] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate({ to: loginUrl, replace: true });
    }
  }, [navigate]);

  const [formData, setFormData] = useState<CollectionData>({
    thumb: collection?.thumb,
    title: collection?.title,
    description: collection?.description,
    category: collection?.category,
    tags: collection?.tags ?? [],
    externalLinks: collection?.externalLinks ?? [],
    activations: (collection?.activations || []).map((a: Activation) => a._id) ?? [],
  });

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<CollectionData>({
    defaultValues: {
      thumb: collection?.thumb,
      title: collection?.title,
      description: collection?.description,
      category: collection?.category,
      tags: collection?.tags ?? [],
      externalLinks: collection?.externalLinks ?? [],
      activations: (collection?.activations || []).map((a: Activation) => a._id) ?? [],
    },
  });

  useEffect(() => {
    setValue('thumb', collection?.thumb);
    setValue('title', collection?.title, { shouldDirty: updating, shouldValidate: updating });
    setValue('description', collection?.description, { shouldDirty: updating, shouldValidate: updating });
    setValue('category', collection?.category);
    setValue('tags', collection?.tags ?? []);
    setValue('externalLinks', collection?.externalLinks ?? []);
    setValue('activations', (collection?.activations || []).map((a: Activation) => a._id) ?? []);
    setValue('catalogLabel', collection?.catalogLabel ?? 'children');
  }, [collection, setValue, updating]);

  const [previewImage, setPreviewImage] = useState<string | undefined>(collection?.thumb); // For image preview
  const [previewExternalImages, setPreviewExternalImages] = useState<string[]>([]);

  const handleAddExternalLink = () => {
    setFormData({
      ...formData,
      externalLinks: [...formData.externalLinks, { image: '', link: '', name: '' }],
    });
    setPreviewExternalImages([...previewExternalImages, '']);
  };

  const handleRemoveExternalLink = (index: number) => {
    const newLinks = formData.externalLinks.filter((_, i) => i !== index);
    const newPreviews = previewExternalImages.filter((_, i) => i !== index);
    setFormData({ ...formData, externalLinks: newLinks });
    setPreviewExternalImages(newPreviews);
  };

  const handleClose = () => {
    navigate({ to: collectionsUrl, replace: true });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const resizedFile = await resizeImage(file, GHOST_IMAGE_SIZE, GHOST_IMAGE_SIZE);
      uploadImage(resizedFile, {
        onSuccess: (data: UploadImageResponse) => {
          setFormData({ ...formData, thumb: data.url });
          setValue('thumb', data.url);
        },
        onError: () => {},
      });

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string); // Display preview
      };
      reader.readAsDataURL(resizedFile);
    }
  };

  const handleExternalImageUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadImage(file, {
        onSuccess: (data: UploadImageResponse) => {
          const newLinks = [...formData.externalLinks];
          newLinks[index].image = data.url; // Store file instead of URL
          setFormData({ ...formData, externalLinks: newLinks });
        },
        onError: () => {},
      });

      const reader = new FileReader();
      reader.onloadend = () => {
        const newPreviews = [...previewExternalImages];
        newPreviews[index] = reader.result as string;
        setPreviewExternalImages(newPreviews);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTagsChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value as string[];
    setFormData({ ...formData, tags: value });
  };

  const handleLinkChange = (index: number, field: string, value: string) => {
    const newLinks = [...formData.externalLinks];
    newLinks[index][field as keyof (typeof newLinks)[0]] = value;
    setFormData({ ...formData, externalLinks: newLinks });
  };

  const onSubmit = (values: CollectionData) => {
    const data = {
      ...values,
      activations: selectedActivations.map((a) => a._id),
      tags: formData.tags,
      externalLinks: formData.externalLinks,
      catalogLabel: values.catalogLabel ?? 'children',
    };

    const options = {
      onSuccess: () => {
        navigate({ to: collectionsUrl, replace: true });
      },
      onError: () => {},
    };

    updating
      ? updateCollection({ formData: data, collectionId: collectionId }, options)
      : createCollection(data, options);
  };

  const handleSelectionChange = (newSelected: Activation[]) => {
    setSelectedActivations(newSelected);
  };

  const onFormChange = () => {
    setError(false);
  };

  useEffect(() => {
    if (isErrorOnUpdatingCollection || isErrorOnCreatingCollection) {
      setError(true);
    }
  }, [isErrorOnUpdatingCollection, isErrorOnCreatingCollection]);

  useEffect(() => {
    if (!isNilOrEmpty(collection)) {
      setFormData({
        thumb: collection?.thumb,
        title: collection?.title,
        description: collection?.description,
        category: collection?.category,
        tags: collection?.tags ?? [],
        externalLinks: collection?.externalLinks ?? [],
        activations: (collection?.activations || []).map((a: Activation) => a._id) ?? [],
      });
      setPreviewImage(collection?.thumb);
      setPreviewExternalImages(collection?.externalLinks.map((link) => link.image) || []);

      if (!isLoadingActivations) {
        const initialActivations = (collection?.activations || []).map(
          (collectionActivation: Activation) =>
            activations?.find((act: Activation) => act._id === collectionActivation._id) as Activation,
        );
        setSelectedActivations(initialActivations);
      }
    }
  }, [activations, collection, isLoadingActivations]);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate({ to: loginUrl, replace: true });
    }
  }, [navigate]);

  if (isLoadingUser || isLoadingActivations || isLoadingCollections) {
    return (
      <Box
        bgcolor="#f5f5f5"
        sx={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 64px)', mt: '64px', pt: 3 }}
      >
        <Container maxWidth="md">
          <Paper elevation={1} sx={{ p: 3, mb: 2, mx: 2 }}>
            <Stack direction="column" alignItems="center">
              <CircularProgress />
            </Stack>
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      bgcolor="#f5f5f5"
      sx={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 64px)', mt: '64px', pt: 3 }}
    >
      <Container maxWidth="md">
        <Paper elevation={1} sx={{ p: 3, mb: 2, mx: 2 }}>
          <Stack direction="row" alignItems="center">
            <Typography variant="h4" sx={{ display: 'inline-flex', fontWeight: '100' }}>
              {updating ? 'Edit' : 'Create New Collection'}
              <Typography variant="h4" sx={{ ml: 1, fontWeight: '600' }}>
                {collection?.title}
              </Typography>
            </Typography>
            <IconButton onClick={handleClose} sx={{ ml: 'auto' }}>
              <Close fontSize="large" sx={{ color: 'black' }} />
            </IconButton>
          </Stack>
          <form onSubmit={handleSubmit(onSubmit)} onChange={onFormChange}>
            <Typography variant="h6" sx={{ mt: 2 }}>
              Collection cover
            </Typography>
            <Box display="flex" flexDirection="column" alignItems="center" my={2}>
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Thumbnail Preview"
                  style={{ width: '100%', height: 'auto', marginBottom: '8px' }}
                />
              ) : (
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  sx={{ width: 200, height: 150, border: '1px dashed grey', borderRadius: '4px' }}
                >
                  <Typography variant="subtitle1" color="textSecondary">
                    Upload Image
                  </Typography>
                  <ImageIcon fontSize="large" color="action" />
                </Box>
              )}

              <Alert severity="error" sx={{ mt: 1, mb: 1, display: () => (isErrorOnUploadingImage ? 'flex' : 'none') }}>
                Error on uploading image. Please try again with different image.
              </Alert>
              <input
                accept="image/*"
                type="file"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
                id="image-upload"
              />
              <label htmlFor="image-upload">
                <Button variant="contained" color="primary" component="span" sx={{ mt: 1 }}>
                  {isLoadingUploadingImage ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : previewImage ? (
                    'Change Image'
                  ) : (
                    'Choose Image'
                  )}
                </Button>
              </label>
            </Box>

            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Title"
                  inputProps={{ maxLength: 25 }}
                  fullWidth
                  error={!!errors.title}
                  helperText={isNilOrEmpty(errors.title?.message) ? '' : errors.title?.message}
                />
              )}
              rules={{
                required: {
                  value: true,
                  message: 'Title is required',
                },
                maxLength: {
                  value: 25,
                  message: 'Title must not exceed 25 characters',
                },
              }}
            />

            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Description"
                  inputProps={{ maxLength: 250 }}
                  sx={{ mt: 2 }}
                  fullWidth
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
                  value: 250,
                  message: 'Description must not exceed 250 characters',
                },
              }}
            />

            {/* MultiSelect Dropdown for Tags */}
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Tags
            </Typography>
            <Select
              multiple
              value={formData.tags}
              onChange={handleTagsChange}
              input={<OutlinedInput label="Tags" />}
              renderValue={(selected) => (selected as string[]).join(', ')}
              fullWidth
              variant="outlined"
              sx={{ mb: 2 }}
            >
              {tagOptions.map((tag) => (
                <MenuItem key={tag} value={tag}>
                  {tag}
                </MenuItem>
              ))}
            </Select>

            {/* Activations */}
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Activations
            </Typography>
            <ActivationsMultiSelect
              activations={activations || []}
              selectedActivations={selectedActivations}
              onChange={handleSelectionChange}
            />

            {/* External Links */}
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              External Links
            </Typography>
            {formData.externalLinks.map((link, index) => (
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  mb: 2,
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: 'primary',
                  borderRadius: '4px',
                }}
                key={index}
              >
                <Grid container spacing={2}>
                  <Grid item xs={3}>
                    <Box display="flex" flexDirection="row" alignItems="center">
                      {previewExternalImages[index] ? (
                        <img
                          src={previewExternalImages[index]}
                          alt={`External Link ${index} Preview`}
                          style={{ maxHeight: 56, width: 'auto' }}
                        />
                      ) : (
                        <Box
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          sx={{
                            width: 56,
                            height: 56,
                            border: '1px dashed grey',
                            borderRadius: '4px',
                            cursor: 'pointer',
                          }}
                        >
                          <ImageIcon fontSize="large" color="action" />
                        </Box>
                      )}
                      <input
                        accept="image/*"
                        type="file"
                        onChange={(e) => handleExternalImageUpload(index, e)}
                        style={{ display: 'none' }}
                        id={`external-image-upload-${index}`}
                      />
                      <label htmlFor={`external-image-upload-${index}`}>
                        <Button color="primary" component="span">
                          <DriveFolderUpload fontSize="large" color="primary" />
                        </Button>
                      </label>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      label="Link URL"
                      fullWidth
                      value={link.link}
                      onChange={(e) => handleLinkChange(index, 'link', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      label="Name"
                      fullWidth
                      value={link.name}
                      onChange={(e) => handleLinkChange(index, 'name', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={1} sx={{ alignItems: 'center', display: 'flex' }}>
                    <IconButton color="error" size="large" onClick={() => handleRemoveExternalLink(index)}>
                      <DeleteForever fontSize="large" />
                    </IconButton>
                  </Grid>
                </Grid>
              </Paper>
            ))}

            <Box mt={2}>
              <Button variant="outlined" color="primary" onClick={handleAddExternalLink}>
                Add External Link
              </Button>
            </Box>

            <Box mt={3}>
              <Alert severity="error" sx={{ mt: 1, mb: 1, display: () => (error ? 'flex' : 'none') }}>
                {updating ? 'Update' : 'Create'} collection failed. Please try again.
              </Alert>
              <Stack direction="row" gap={2}>
                <Button type="submit" variant="contained" color="primary" disabled={error}>
                  {isLoadingUploadingImage || isLoadingUpdatingCollection || isLoadingCreatingCollection ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : updating ? (
                    'Update'
                  ) : (
                    'Create'
                  )}
                </Button>
                <Button variant="contained" color="secondary" onClick={handleClose}>
                  Cancel
                </Button>
              </Stack>
            </Box>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};
