import React, { useEffect, useState } from 'react';

import { Close, DeleteForever, DriveFolderUpload } from '@mui/icons-material';
import ImageIcon from '@mui/icons-material/Image';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useMatch, useNavigate } from '@tanstack/react-location';
import { useQueryClient } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';

import { AR_IMAGE_SIZE, GHOST_IMAGE_SIZE, THUMB_IMAGE_SIZE } from './constants';
import { useActivation, useCreateActivation, useUpdateActivation } from './hooks';
import { QRCodeDialog } from './QRCodeDialog';
import { ActivationData } from './types';
import { buildVideoUrl } from './utils';
import { activationsUrl, loginUrl } from '../../Routing';
import { Errors, ErrorType } from '../../shared/components/Errors';
import { VIEW_MODE } from '../../shared/constants';
import { UploadImageResponse, useUploadImage } from '../../shared/hooks';
import { Activation, ViewMode } from '../../shared/types';
import { isNilOrEmpty, resizeImage } from '../../shared/utils';
import { isAuthenticated } from '../../shared/utils/auth';

export const VIDEO_SIZE = 25000000;

export const ActivationPage = ({ viewMode }: { viewMode: ViewMode }) => {
  const match = useMatch();
  const { activationId } = match.params;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const updating = viewMode === VIEW_MODE.UPDATE;

  const {
    mutate: uploadImage,
    isLoading: isLoadingUploadingImage,
    isError: isErrorOnUploadingImage,
  } = useUploadImage();
  const {
    mutate: uploadVideo,
    isLoading: isLoadingUploadingVideo,
    isError: isErrorOnUploadingVideo,
  } = useUploadImage();
  const {
    mutate: updateActivation,
    isLoading: isLoadingUpdatingActivation,
    isError: isErrorOnUpdatingActivation,
  } = useUpdateActivation();
  const {
    mutate: createActivation,
    isLoading: isLoadingCreatingActivation,
    isError: isErrorOnCreatingActivation,
  } = useCreateActivation();

  const { data: activation, isFetching: isFetchingActivation } = useActivation(activationId);

  const [formData, setFormData] = useState<ActivationData>(null as unknown as ActivationData);

  const [previewImage, setPreviewImage] = useState<string | null>(activation?.triggeringImageGhost ?? null);
  const [videoPreview, setVideoPreview] = useState<string | null>(activation?.videoResource ?? null);
  const [previewExternalImages, setPreviewExternalImages] = useState<string[]>([]);
  const [activationToQRCode, setActivationToQRCode] = useState<Activation>();

  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isResourceError, setResourceError] = useState(false);
  const [errorType, setErrorType] = useState<ErrorType | null>(null);

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<ActivationData>({
    defaultValues: {
      name: activation?.name,
      description: activation?.description,
      triggeringImage: activation?.triggeringImage,
      triggeringImageThumb: activation?.triggeringImageThumb,
      triggeringImageGhost: activation?.triggeringImageGhost,
      triggeringImageAr: activation?.triggeringImageAr,
      videoResource: activation?.videoResource,
      externalLinks: activation?.externalLinks ?? [],
      collection: activation?.collection,
    },
  });

  useEffect(() => {
    setValue('name', activation?.name ?? '');
    setValue('description', activation?.description ?? '');
    setValue('triggeringImage', activation?.triggeringImage ?? '');
    setValue('triggeringImageThumb', activation?.triggeringImageThumb ?? '');
    setValue('triggeringImageGhost', activation?.triggeringImageGhost ?? '');
    setValue('triggeringImageAr', activation?.triggeringImageAr ?? '');
    setValue('videoResource', activation?.videoResource ?? '');
    setValue('externalLinks', activation?.externalLinks ?? []);
    setValue('collection', activation?.collection ?? '');
  }, [activation, setValue, updating]);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate({ to: loginUrl, replace: true });
    }
  }, [navigate]);

  const handleClose = () => {
    navigate({ to: activationsUrl, replace: true });
  };

  const uploadThumbImage = async (file: File) => {
    const resizedFile = await resizeImage(file, THUMB_IMAGE_SIZE, THUMB_IMAGE_SIZE);
    uploadImage(resizedFile, {
      onSuccess: (data: UploadImageResponse) => {
        setFormData((prevFormData) => ({ ...prevFormData, triggeringImageThumb: data.url }));
        setValue('triggeringImageThumb', data.url);
      },
      onError: () => {},
    });
  };

  const uploadGhostImage = async (file: File) => {
    const resizedFile = await resizeImage(file, GHOST_IMAGE_SIZE, GHOST_IMAGE_SIZE);
    uploadImage(resizedFile, {
      onSuccess: (data: UploadImageResponse) => {
        setFormData((prevFormData) => ({ ...prevFormData, triggeringImageGhost: data.url }));
        setValue('triggeringImageGhost', data.url);
        uploadThumbImage(file);
      },
      onError: () => {},
    });

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result as string); // Display preview
    };
    reader.readAsDataURL(file);
  };

  const uploadARImage = async (file: File) => {
    const resizedFile = await resizeImage(file, AR_IMAGE_SIZE, AR_IMAGE_SIZE);
    uploadImage(resizedFile, {
      onSuccess: (data: UploadImageResponse) => {
        setFormData((prevFormData) => ({ ...prevFormData, triggeringImageAr: data.url }));
        setValue('triggeringImageAr', data.url);
        uploadGhostImage(file);
      },
      onError: () => {},
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadImage(file, {
        onSuccess: (data: UploadImageResponse) => {
          setFormData((prevFormData) => ({ ...prevFormData, triggeringImage: data.url }));
          setValue('triggeringImage', data.url);
          uploadARImage(file);
        },
        onError: () => {},
      });
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const upload = () => {
      const file = e.target.files?.[0];
      if (file) {
        if (file.size >= VIDEO_SIZE) {
          setResourceError(true);
          setErrorType('VIDEO_TOO_BIG');
          return;
        }

        uploadVideo(file, {
          onSuccess: (data: UploadImageResponse) => {
            setFormData((prevFormData) => ({ ...prevFormData, videoResource: data.url }));
            setValue('videoResource', data.url);
          },
          onError: () => {},
        });

        const reader = new FileReader();
        reader.onloadend = () => {
          setVideoPreview(reader.result as string); // Display preview
        };
        reader.readAsDataURL(file);
      }
    };

    setTimeout(upload, 500);
  };

  const handleExternalImageUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadImage(file, {
        onSuccess: (data: UploadImageResponse) => {
          const newLinks = [...formData.externalLinks];
          newLinks[index].image = data.url; // Store file instead of URL
          setFormData((prevFormData) => ({ ...prevFormData, externalLinks: newLinks }));
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleLinkChange = (index: number, field: string, value: string) => {
    const newLinks = [...formData.externalLinks];
    newLinks[index][field as keyof (typeof newLinks)[0]] = value;
    setFormData({ ...formData, externalLinks: newLinks });
  };

  useEffect(() => {
    if (isErrorOnUploadingImage) {
      setResourceError(true);
      setErrorType('UPLOAD_IMAGE');
    }
    if (isErrorOnUploadingVideo) {
      setResourceError(true);
      setErrorType('UPLOAD_VIDEO');
    }
  }, [isErrorOnUploadingImage, isErrorOnUploadingVideo]);

  const handleOnChange = () => {
    setResourceError(false);
    setErrorType(null);
  };

  const onSubmit = (values: ActivationData) => {
    const data = {
      ...values,
      collection: formData?.collection ?? null,
      externalLinks: formData?.externalLinks ?? [],
    };

    if (isNilOrEmpty(data.triggeringImage)) {
      setResourceError(true);
      setErrorType('MISSING_IMAGE');
      return;
    }

    if (isNilOrEmpty(data.videoResource)) {
      setResourceError(true);
      setErrorType('MISSING_VIDEO');
      return;
    }

    const options = {
      onSuccess: (activation: Activation) => {
        queryClient.invalidateQueries(['activation', { activationId }]);
        setActivationToQRCode(activation);
        setDialogOpen(true);
        navigate({ to: activationsUrl, replace: true });
      },
      onError: () => {},
    };

    updating ? updateActivation({ activationId, formData: data }, options) : createActivation(data, options);
  };

  useEffect(() => {
    if (!isNilOrEmpty(activation) && isNilOrEmpty(formData)) {
      setFormData({
        name: activation.name,
        description: activation.description,
        triggeringImage: activation.triggeringImage,
        triggeringImageThumb: activation.triggeringImageThumb,
        triggeringImageGhost: activation.triggeringImageGhost,
        triggeringImageAr: activation.triggeringImageAr,
        videoResource: activation.videoResource,
        externalLinks: activation.externalLinks,
        collection: activation.collection,
      });
      setPreviewImage(() => activation.triggeringImageGhost);
      setVideoPreview(() => activation.videoResource);
      setPreviewExternalImages(() => activation.externalLinks.map((activation) => activation.image));
    }
  }, [activation, formData]);

  if (isFetchingActivation) {
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
              {updating ? 'Edit' : 'Create New Activation'}
              <Typography variant="h4" sx={{ ml: 1, fontWeight: '600' }}>
                {activation?.name}
              </Typography>
            </Typography>
            <IconButton onClick={handleClose} sx={{ ml: 'auto' }}>
              <Close fontSize="large" sx={{ color: 'black' }} />
            </IconButton>
          </Stack>
          <form onSubmit={handleSubmit(onSubmit)} onChange={handleOnChange}>
            <Stack direction="row" alignContent="center" justifyContent="center" gap={2}>
              <Box display="flex" flexDirection="column" alignItems="center" my={2}>
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Triggering item preview"
                    style={{ width: '100%', maxHeight: 200, height: 'auto', marginBottom: '8px' }}
                  />
                ) : (
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    sx={{ width: 200, height: 150, border: '1px dashed grey', borderRadius: '4px' }}
                  >
                    <Typography variant="subtitle1" color="textSecondary">
                      Upload trigger image
                    </Typography>
                    <ImageIcon fontSize="large" color="action" />
                  </Box>
                )}
                <input
                  accept="image/*"
                  type="file"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                  id="image-upload"
                />
                <label htmlFor="image-upload">
                  <Button variant="contained" color="primary" component="span" sx={{ mt: 1 }}>
                    {isLoadingUploadingImage ? <CircularProgress size={24} color="inherit" /> : 'Choose Image'}
                  </Button>
                </label>
              </Box>
              <Box display="flex" flexDirection="column" alignItems="center" my={2}>
                {videoPreview ? (
                  <video
                    controls
                    muted
                    preload="auto"
                    style={{ width: '100%', maxHeight: 200, height: 'auto', marginBottom: '8px' }}
                  >
                    <source src={updating ? buildVideoUrl(videoPreview) : videoPreview} type="video/mp4" />
                  </video>
                ) : (
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    sx={{ width: 200, height: 150, border: '1px dashed grey', borderRadius: '4px' }}
                  >
                    <Typography variant="subtitle1" color="textSecondary">
                      Upload video resource
                    </Typography>
                    <ImageIcon fontSize="large" color="action" />
                  </Box>
                )}
                <input
                  accept="video/*"
                  type="file"
                  onChange={handleVideoUpload}
                  style={{ display: 'none' }}
                  id="video-upload"
                />
                <label htmlFor="video-upload">
                  <Button variant="contained" color="primary" component="span" sx={{ mt: 1 }}>
                    {isLoadingUploadingVideo ? <CircularProgress size={24} color="inherit" /> : 'Choose Video'}
                  </Button>
                </label>
              </Box>
            </Stack>

            <Errors show={isResourceError} error={errorType} />

            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Title"
                  inputProps={{ maxLength: 25 }}
                  fullWidth
                  error={!!errors.name}
                  helperText={isNilOrEmpty(errors.name?.message) ? '' : errors.name?.message}
                />
              )}
              rules={{
                required: {
                  value: true,
                  message: 'Name is required',
                },
                maxLength: {
                  value: 25,
                  message: 'Name must not exceed 25 characters',
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

            {/* External Links */}
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              External Links
            </Typography>
            {(formData?.externalLinks || []).map((link, index) => (
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
              <Alert
                severity="error"
                sx={{
                  mt: 1,
                  mb: 1,
                  display: () => (isErrorOnUpdatingActivation || isErrorOnCreatingActivation ? 'flex' : 'none'),
                }}
              >
                Error on {updating ? 'updating' : 'creating'} activation. Please validate the data and try again.
              </Alert>
              <Stack direction="row" gap={2}>
                <Button type="submit" variant="contained" color="primary" disabled={isResourceError}>
                  {isLoadingUploadingImage ||
                  isLoadingUploadingVideo ||
                  isLoadingUpdatingActivation ||
                  isLoadingCreatingActivation ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : updating ? (
                    'Update'
                  ) : (
                    'Create Activation'
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

      <QRCodeDialog
        open={isDialogOpen}
        onClose={() => setDialogOpen(false)}
        activation={activationToQRCode as Activation}
      />
    </Box>
  );
};
