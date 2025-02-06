import React, { useEffect } from 'react';

import { Box, Card, CardContent, CircularProgress, Grid, Typography } from '@mui/material';
import { useNavigate } from '@tanstack/react-location';

import { UserStat } from './UserStat';
import { loginUrl } from '../../Routing';
import { useGetUserData, usePartnerStats } from '../../shared/hooks';
import { isAdmin, isAuthenticated } from '../../shared/utils/auth';

export const DashboardPage = () => {
  const { data: user, isLoading: isLoadinUser } = useGetUserData();
  const { data: stats, isLoading: isLoadinUserStats } = usePartnerStats(user?.partner);

  const navigate = useNavigate();
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate({ to: loginUrl, replace: true });
    }
  }, [navigate]);

  if (!isAuthenticated()) {
    return null;
  }

  return (
    <Box
      bgcolor="#f5f5f5"
      sx={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 64px)', mt: '64px' }}
    >
      {/* Main Content */}
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              {isLoadinUser ? (
                <Box display="flex" justifyContent="center" alignItems="center" sx={{ p: 2 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <CardContent>
                  <Typography variant="subtitle1" color="textSecondary">
                    Hello: {user?.name}
                  </Typography>
                </CardContent>
              )}
            </Card>
          </Grid>
        </Grid>

        {!isAdmin(user) && (
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <UserStat title="Collections" isLoading={isLoadinUserStats} count={stats?.collectionsCount ?? 0} />
            <UserStat title="Activations" isLoading={isLoadinUserStats} count={stats?.activationsCount ?? 0} />
            <UserStat title="Total scans" isLoading={isLoadinUserStats} count={stats?.totalActivationScans ?? 0} />
            <UserStat
              title="Total activation views"
              isLoading={isLoadinUserStats}
              count={stats?.totalActivationViews ?? 0}
            />
            <UserStat
              title="Total collection views"
              isLoading={isLoadinUserStats}
              count={stats?.totalCollectionViews ?? 0}
            />
          </Grid>
        )}
      </Box>
    </Box>
  );
};
