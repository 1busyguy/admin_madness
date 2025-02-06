import React, { useState } from 'react';

import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Avatar,
  IconButton,
  Typography,
  Box,
  Chip,
  Menu,
  MenuItem,
  Tooltip,
} from '@mui/material';

import { Partner, User } from '../../shared/types';

export interface PartnersListProps {
  partners: Partner[];
  onAdd: () => void;
  onEditPartner: (partner: Partner) => void;
  onDeletePartner: (partner: Partner) => void;
  onEditUser: (user: User) => void;
  onDeleteUser: (user: User) => void;
  onAddUser: (partner: Partner) => () => void;
}

export const PartnerList = ({
  partners,
  onAdd,
  onEditPartner,
  onDeletePartner,
  onEditUser,
  onDeleteUser,
  onAddUser,
}: PartnersListProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleUserClick = (event: React.MouseEvent<HTMLElement>, user: User) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };

  const handleEditUser = () => {
    onEditUser(selectedUser as User);
    handleUserMenuClose();
  };

  const handleDeleteUser = () => {
    onDeleteUser(selectedUser as User);
    handleUserMenuClose();
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 800, bgcolor: 'background.paper', mx: 'auto', mt: 2, mb: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ p: 2 }}>
        <Typography variant="h6">Partners ({partners?.length || 0})</Typography>
        <Tooltip arrow title="Add new partner">
          <IconButton color="primary" onClick={onAdd}>
            <AddIcon />
          </IconButton>
        </Tooltip>
      </Box>
      <List sx={{ pt: 0 }}>
        {partners.map((partner: Partner, idx: number) => (
          <ListItem
            key={partner._id}
            sx={{
              borderBottom: idx < partners.length - 1 ? '1px solid #ddd' : '',
              borderTop: idx === 0 ? '1px solid #ddd' : '',
            }}
          >
            <ListItemAvatar>
              <Avatar src={partner.logoImage} alt={partner.name} sx={{ width: '56px', height: '56px', mr: 2 }} />
            </ListItemAvatar>
            <ListItemText
              primary={partner.name}
              secondary={
                <>
                  <Typography component="span" variant="body2" color="text.secondary">
                    {partner.description}
                  </Typography>
                  {partner.users && partner.users.length > 0 && (
                    <Box mt={1} display="flex" gap={1} flexWrap="wrap" alignItems="center">
                      {partner.users.map((user) => (
                        <Chip
                          key={user._id}
                          label={user.name || user.email}
                          onClick={(event) => handleUserClick(event, user)}
                          sx={{ cursor: 'pointer' }}
                        />
                      ))}
                      <Tooltip arrow title="Add new user">
                        <IconButton color="primary" onClick={onAddUser(partner)}>
                          <AddIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  )}
                </>
              }
            />
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="edit" onClick={() => onEditPartner(partner)}>
                <EditIcon color="primary" />
              </IconButton>
              <IconButton edge="end" aria-label="delete" onClick={() => onDeletePartner(partner)}>
                <DeleteIcon color="error" />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      {/* User options menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleUserMenuClose}>
        <MenuItem onClick={handleEditUser}>Edit</MenuItem>
        <MenuItem onClick={handleDeleteUser}>Delete</MenuItem>
      </Menu>
    </Box>
  );
};
