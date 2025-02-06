import React, { useEffect, useState } from 'react';

import { Box, CircularProgress } from '@mui/material';
import { useNavigate } from '@tanstack/react-location';
import { useQueryClient } from '@tanstack/react-query';

import { CreatePartnerDialog } from './CreatePartnerDialog';
import { EditPartnerDialog } from './EditPartnerDialog';
import { useDeletePartner, usePartners } from './hooks';
import { PartnerList } from './PartnersList';
import { UserAddDialog } from './UserAddDialog';
import { dashboardUrl, loginUrl } from '../../Routing';
import { DeleteConfirmationModal } from '../../shared/components/DeleteConfirmationModal';
import { NotificationSnackbar } from '../../shared/components/NotificationSnackbar';
import { useGetUserData } from '../../shared/hooks';
import { Partner, User } from '../../shared/types';
import { isNilOrEmpty } from '../../shared/utils';
import { isAdmin, isAuthenticated } from '../../shared/utils/auth';
import { useDeleteUser } from '../users/hooks';
import { UserEditDialog } from '../users/UserEditDialog';

export const PartnersPage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { data: user, isLoading: isLoadingUser } = useGetUserData();
  const { data: partners, isLoading: isLoadingPartners } = usePartners();
  const { mutate: deletePartner } = useDeletePartner();
  const { mutate: deleteUser } = useDeleteUser();

  const [showNotification, setShowNotification] = useState(false);
  const [showUserDeletedNotification, setShowUserDeletedNotification] = useState(false);
  const [partnerToDelete, setPartnerToDelete] = React.useState<Partner | null>(null);
  const [partnerToEdit, setPartnerToEdit] = React.useState<Partner | null>(null);
  const [partnerToAddUser, setPartnerToAddUser] = React.useState<Partner | null>(null);
  const [userToEdit, setUserToEdit] = React.useState<User | null>(null);
  const [userToDelete, setUserToDelete] = React.useState<User | null>(null);

  const [openAddPartner, setOpenAddPartner] = React.useState(false);
  const [openEditPartner, setOpenEditPartner] = React.useState(false);
  const [openDeletePartner, setOpenDeletePartner] = React.useState(false);
  const [openAddUser, setOpenAddUser] = React.useState(false);
  const [openEditUser, setOpenEditUser] = React.useState(false);
  const [openDeleteUser, setOpenDeleteUser] = React.useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate({ to: loginUrl, replace: true });
    }

    if (!isLoadingUser && !isNilOrEmpty(user) && !isAdmin(user)) {
      navigate({ to: dashboardUrl, replace: true });
    }
  }, [isLoadingUser, navigate, user]);

  if (isLoadingPartners || isLoadingUser) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 64px)', mt: '64px' }}>
        <Box display="flex" justifyContent="center" alignItems="center">
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  const handleOpen = () => {
    setOpenAddPartner(true);
  };

  const handleClose = () => {
    setOpenAddPartner(false);
  };

  const handleOpenAddUser = (partner: Partner) => () => {
    setPartnerToAddUser(partner);
    setOpenAddUser(true);
  };

  const handleCloseAddUser = () => {
    setOpenAddUser(false);
  };

  const handleCloseEditUserModal = () => {
    setOpenEditUser(false);
  };

  const handleCloseDeleteModal = () => {
    setOpenDeletePartner(false);
  };

  const handleCloseDeleteUserModal = () => {
    setOpenDeleteUser(false);
  };

  const handleCloseEditModal = () => {
    setOpenEditPartner(false);
  };

  const handleDelete = (partner: Partner) => {
    setPartnerToDelete(partner);
    setOpenDeletePartner(true);
  };

  const handleEditPartner = (partner: Partner) => {
    setPartnerToEdit(partner);
    setOpenEditPartner(true);
  };

  const handleEditUser = (user: User) => {
    setUserToEdit(user);
    setOpenEditUser(true);
  };

  const handleDeleteUser = (user: User) => {
    setUserToDelete(user);
    setOpenDeleteUser(true);
  };

  const onDeletePartner = (id: string) => {
    deletePartner(id, {
      onSuccess: () => {
        setPartnerToDelete(null);
        queryClient.invalidateQueries({ queryKey: ['partners'] });
      },
      onError: () => {
        console.log(`Error deleting partner ${id}`);
      },
    });
    handleCloseDeleteModal();
  };

  const onDeleteUser = (id: string) => {
    deleteUser(id, {
      onSuccess: () => {
        setUserToDelete(null);
        queryClient.invalidateQueries({ queryKey: ['partners'] });
      },
      onError: () => {
        console.log(`Error deleting user ${id}`);
      },
    });
    handleCloseDeleteUserModal();
  };

  return (
    <Box
      bgcolor="#f5f5f5"
      sx={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 64px)', mt: '64px' }}
    >
      <PartnerList
        partners={partners || []}
        onAdd={handleOpen}
        onDeletePartner={handleDelete}
        onEditPartner={handleEditPartner}
        onEditUser={handleEditUser}
        onDeleteUser={handleDeleteUser}
        onAddUser={handleOpenAddUser}
      />
      <DeleteConfirmationModal
        open={openDeletePartner}
        onClose={handleCloseDeleteModal}
        onDelete={onDeletePartner}
        itemName={partnerToDelete?.name ?? ''}
        itemId={partnerToDelete?._id ?? ''}
        title="Delete partner account?"
      />
      <DeleteConfirmationModal
        open={openDeleteUser}
        onClose={handleCloseDeleteUserModal}
        onDelete={onDeleteUser}
        itemName={userToDelete?.name ?? ''}
        itemId={userToDelete?._id ?? ''}
        title="Delete user account?"
      />

      <CreatePartnerDialog open={openAddPartner} onClose={handleClose} />
      {openEditPartner && partnerToEdit && (
        <EditPartnerDialog partner={partnerToEdit} open={openEditPartner} onClose={handleCloseEditModal} />
      )}
      {openAddUser && partnerToAddUser && (
        <UserAddDialog
          open={openAddUser}
          onClose={handleCloseAddUser}
          partnerId={partnerToAddUser?._id}
          partnerName={partnerToAddUser?.name}
        />
      )}
      {userToEdit && openEditUser && (
        <UserEditDialog user={userToEdit} open={openEditUser} onClose={handleCloseEditUserModal} />
      )}

      <NotificationSnackbar message="Partner has been deleted" open={showNotification} setOpen={setShowNotification} />
      <NotificationSnackbar
        message="User has been deleted"
        open={showUserDeletedNotification}
        setOpen={setShowUserDeletedNotification}
      />
    </Box>
  );
};
