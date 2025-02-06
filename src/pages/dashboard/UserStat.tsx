import React from 'react';

import { Box, Card, CardContent, CircularProgress, Grid, Stack, Typography } from '@mui/material';

interface UserStatProps {
  isLoading: boolean;
  title: string;
  count: number;
}

export const UserStat = ({ isLoading, title, count }: UserStatProps) => {
  return (
    <Grid item xs={12} sm={6} md={4} lg={3}>
      <Card>
        {isLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" sx={{ p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <CardContent>
            <Stack sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="h2" color="primary" sx={{ mb: 2 }}>
                {count}
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                {title}
              </Typography>
            </Stack>
          </CardContent>
        )}
      </Card>
    </Grid>
  );
};
