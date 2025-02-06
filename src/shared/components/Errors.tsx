import React from 'react';

import { Alert } from '@mui/material';

import { isNilOrEmpty } from '../utils';

export const ErrorTypes = ['MISSING_IMAGE', 'MISSING_VIDEO', 'VIDEO_TOO_BIG', 'UPLOAD_ERROR'];

export type ErrorType = (typeof ErrorTypes)[number];

const getErrorMessage = (error: ErrorType) => {
  switch (error) {
    case 'MISSING_IMAGE':
      return 'Image is missing - please upload an trigger image';
    case 'MISSING_VIDEO':
      return 'Video is missing - please upload an animation video';
    case 'VIDEO_TOO_BIG':
      return 'Video is too big - please limit the size of video to 25MB';
    case 'UPLOAD_ERROR':
      return 'Error on uploading resources. Please try again.';
    default:
      return 'Error on uploading resources. Please try again.';
  }
};

interface ErrorsProps {
  show: boolean;
  error: ErrorType | null;
}

export const Errors = ({ show, error }: ErrorsProps) => {
  return isNilOrEmpty(error) ? null : (
    <Alert severity="error" sx={{ mt: 1, mb: 1, display: () => (show ? 'flex' : 'none') }}>
      {getErrorMessage(error)}
    </Alert>
  );
};
