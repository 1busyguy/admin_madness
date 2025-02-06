import React from 'react';

import { Box, CircularProgress } from '@mui/material';

import { CollectionGrid } from './CollectionGrid';
import { useCollections } from './hooks';
import { useGetUserData } from '../../shared/hooks';

export const CollectionsPage = () => {
  const { data: user, isLoading: isLoadingUser } = useGetUserData();
  const { data: collections, isLoading } = useCollections({ partnerId: user?.partner });

  if (isLoading || isLoadingUser) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 64px)', mt: '64px' }}>
        <Box display="flex" justifyContent="center" alignItems="center">
          <CircularProgress />
        </Box>
      </Box>
    );
  }
  return (
    <Box
      bgcolor="#f5f5f5"
      sx={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 64px)', mt: '64px' }}
    >
      <CollectionGrid collections={collections} isLoading={isLoading} />
    </Box>
  );
};
