import React, { useCallback, useEffect, useState } from 'react';

import { Button, TextField, Box, Typography, CircularProgress, Alert } from '@mui/material';
import { useNavigate } from '@tanstack/react-location';

import { useLogin } from './hooks';
import { dashboardUrl } from '../../Routing';
import { isAuthenticated, persistToken } from '../../shared/utils/auth';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const { mutate: loginMutation, isLoading } = useLogin();

  useEffect(() => {
    if (isAuthenticated()) {
      navigate({ to: dashboardUrl, replace: true });
    }
  }, [navigate]);

  const onChangeHandle = useCallback(
    (_e: React.ChangeEvent<HTMLFormElement>) => {
      if (error) setError(false);
    },
    [error],
  );

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation(
      { email, password },
      {
        onSuccess: (data) => {
          persistToken(data.token);
          navigate({ to: dashboardUrl, replace: true });
        },
        onError: () => {
          setError(true);
        },
      },
    );
  };

  if (isAuthenticated()) {
    return null;
  }

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#f5f5f5">
      <Box
        component="form"
        onSubmit={handleLogin}
        onChange={onChangeHandle}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: '400px',
          backgroundColor: 'white',
          boxShadow: 3,
          borderRadius: 2,
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Login
        </Typography>
        <TextField
          fullWidth
          id="email"
          label="Email"
          margin="normal"
          autoComplete="email"
          value={email || null}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextField
          fullWidth
          id="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          margin="normal"
          value={password || null}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Alert severity="error" sx={{ mt: 1, display: () => (error ? 'flex' : 'none') }}>
          Please check your credentials and try again.
        </Alert>
        <Box mt={2} textAlign="center">
          <Button type="submit" variant="contained" color="primary" disabled={isLoading} fullWidth>
            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
