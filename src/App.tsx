import React from 'react';

import { Box } from '@mui/material';
import { Outlet } from '@tanstack/react-location';
import { ReactLocationDevtools } from '@tanstack/react-location-devtools';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { isDev } from './constants/config';

export const App = () => {
  return (
    <Box component="main" height={1} tabIndex={-1} id="main-content" overflow="auto">
      <Outlet />
      {isDev && (
        <>
          <ReactLocationDevtools />
          <ReactQueryDevtools />
        </>
      )}
    </Box>
  );
};
