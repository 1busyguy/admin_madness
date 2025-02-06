import React, { useState } from 'react';

import MenuIcon from '@mui/icons-material/Menu';
import {
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Stack,
  Skeleton,
} from '@mui/material';
import { Link, useMatchRoute, useNavigate } from '@tanstack/react-location';

import { activationsUrl, collectionsUrl, dashboardUrl, partnersUrl } from '../../Routing';
import { useGetUserData } from '../hooks';
import { User } from '../types';
import { isAdmin, isAuthenticated, logout } from '../utils/auth';

export const TopNavigation = () => {
  const { data: user, isLoading: isLoadingUser } = useGetUserData();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const matchRoute = useMatchRoute();
  const dashboardMatch = matchRoute({ to: dashboardUrl, fuzzy: true });
  const collectionsMatch = matchRoute({ to: collectionsUrl, fuzzy: true });
  const activitiesMatch = matchRoute({ to: activationsUrl, fuzzy: true });
  const partnersMatch = matchRoute({ to: partnersUrl, fuzzy: true });

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate({ to: '/login', replace: true });
    handleClose();
  };

  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };

  const activeStyle = {
    backgroundColor: '#1976d2', // Primary color for active button
    color: '#ffffff',
    active: '#ff9800',
  };

  const drawerStyle = {
    color: '#000000de',
    active: '#ff9800',
  };

  if (!isAuthenticated()) {
    return null;
  }

  return (
    <AppBar>
      <Toolbar>
        <Stack direction="row" alignItems="center">
          {/* App Title */}
          <IconButton edge="start" color="inherit" aria-label="app-logo" sx={{ mr: 1 }}>
            {/*<HomeIcon />*/}
            <img
              src="/app-logo-banner.png" // Replace with the path to your logo image
              alt="App Logo"
              style={{ width: 128, height: 45 }} // Adjust size as needed
            />
          </IconButton>

          {/* Desktop Navigation Links */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2, ml: 3 }}>
            {isLoadingUser ? (
              <Skeleton
                variant="rounded"
                animation="wave"
                width={600}
                height={28}
                sx={{ backgroundColor: '#00000033' }}
              />
            ) : (
              <>
                <Button
                  component={Link}
                  to={dashboardUrl}
                  sx={{ color: dashboardMatch ? activeStyle.active : activeStyle.color }}
                >
                  Dashboard
                </Button>
                {!isAdmin(user as User) && (
                  <>
                    <Button
                      component={Link}
                      to={collectionsUrl}
                      sx={{ color: collectionsMatch ? activeStyle.active : activeStyle.color }}
                    >
                      Collections
                    </Button>
                    <Button
                      component={Link}
                      to={activationsUrl}
                      sx={{ color: activitiesMatch ? activeStyle.active : activeStyle.color }}
                    >
                      Activations
                    </Button>
                  </>
                )}
                {isAdmin(user as User) && (
                  <Button
                    component={Link}
                    to={partnersUrl}
                    sx={{ color: partnersMatch ? activeStyle.active : activeStyle.color }}
                  >
                    Partners
                  </Button>
                )}
              </>
            )}
          </Box>

          {/* Mobile Menu Icon */}
          <IconButton
            color="inherit"
            edge="start"
            onClick={toggleDrawer(true)}
            sx={{ display: { xs: 'flex', md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
        </Stack>
        {/* User Avatar with Context Menu */}
        <IconButton color="inherit" onClick={handleAvatarClick} sx={{ ml: 'auto' }}>
          <Avatar alt="User Avatar" />
        </IconButton>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Toolbar>

      {/* Mobile Drawer */}
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
          <List>
            <ListItem>
              <ListItemText
                primary={
                  <Button
                    component={Link}
                    to={dashboardUrl}
                    sx={{ color: dashboardMatch ? drawerStyle.active : drawerStyle.color }}
                  >
                    Dashboard
                  </Button>
                }
              />
            </ListItem>
            {!isAdmin(user as User) && (
              <>
                <ListItem>
                  <ListItemText
                    primary={
                      <Button
                        component={Link}
                        to={collectionsUrl}
                        sx={{ color: collectionsMatch ? drawerStyle.active : drawerStyle.color }}
                      >
                        Collections
                      </Button>
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary={
                      <Button
                        component={Link}
                        to={activationsUrl}
                        sx={{ color: activitiesMatch ? drawerStyle.active : drawerStyle.color }}
                      >
                        Activations
                      </Button>
                    }
                  />
                </ListItem>
              </>
            )}
            {isAdmin(user as User) && (
              <ListItem>
                <ListItemText
                  primary={
                    <Button
                      component={Link}
                      to={partnersUrl}
                      sx={{ color: partnersMatch ? drawerStyle.active : drawerStyle.color }}
                    >
                      Partners
                    </Button>
                  }
                />
              </ListItem>
            )}
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
};
