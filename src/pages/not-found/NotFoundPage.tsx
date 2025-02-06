import React from 'react';

import { Box, Button, Stack, Typography } from '@mui/material';
import { useNavigate } from '@tanstack/react-location';

import { dashboardUrl } from '../../Routing';

export const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#f5f5f5">
      <Box
        sx={{
          p: 4,
          width: '100%',
          maxWidth: '400px',
          backgroundColor: 'white',
          boxShadow: 3,
          borderRadius: 2,
        }}
      >
        <Stack display="flex" alignItems="center" justifyContent="center" height={1} width={1} gap={3}>
          <Typography variant="h4">Page Not Found</Typography>
          <Typography variant="h6">You are here, because of some mistake</Typography>
          <Button
            variant="contained"
            onClick={() => {
              navigate({ to: dashboardUrl, replace: true });
            }}
          >
            Back to dashboard
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};
