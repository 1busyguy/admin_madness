import React, { useState } from 'react';

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PreviewIcon from '@mui/icons-material/Preview';
import QrCode from '@mui/icons-material/QrCode';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import { Grid, Card, CardContent, CardMedia, Typography, IconButton, CardActions, Stack } from '@mui/material';
import { useNavigate } from '@tanstack/react-location';
import { useQueryClient } from '@tanstack/react-query';

import { useDeleteActivation } from './hooks';
import { QRCodeDialog } from './QRCodeDialog';
import { createActivationUrl, editActivationPath } from '../../Routing';
import { AnalyticStat } from '../../shared/components/AnalyticStat';
import { DeleteConfirmationModal } from '../../shared/components/DeleteConfirmationModal';
import { NotificationSnackbar } from '../../shared/components/NotificationSnackbar';
import { Activation } from '../../shared/types';

interface ActivationsGridProps {
  activations: Activation[] | undefined;
  isLoading?: boolean;
}

export const ActivationsGrid = ({ activations }: ActivationsGridProps) => {
  const queryClient = useQueryClient();
  const { mutate: deleteActivation } = useDeleteActivation();
  const [showNotification, setShowNotification] = useState(false);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [activationToDelete, setActivationToDelete] = useState<Activation>();
  const [activationToQRCode, setActivationToQRCode] = useState<Activation>();

  const [isDialogOpen, setDialogOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleCreateNewActivation = () => {
    navigate({ to: createActivationUrl });
  };

  const handleShowDetails = (id: string) => {
    navigate({ to: editActivationPath(id) });
  };

  const handleShowQRCode = (activation: Activation) => {
    setActivationToQRCode(activation);
    setDialogOpen(true);
  };

  const handleDeleteCollection = (activation: Activation) => {
    setActivationToDelete(activation);
    handleOpen();
  };

  const onDeleteCollection = (id: string) => {
    deleteActivation(id, {
      onSuccess: () => {
        setShowNotification(true);
        queryClient.invalidateQueries({ queryKey: ['activations'] });
      },
      onError: () => {
        console.log(`Error deleting activation ${id}`);
      },
    });
    handleClose();
  };

  return (
    <>
      <Grid container spacing={3} sx={{ p: 3 }}>
        <Grid item xs={12} sm={6} md={4} xl={3}>
          <Card
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Stack sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <IconButton color="primary" size="large" onClick={handleCreateNewActivation}>
                <AddCircleOutlineIcon fontSize="large" />
              </IconButton>
              <Typography variant="subtitle1" color="textSecondary">
                Create New Activation
              </Typography>
            </Stack>
          </Card>
        </Grid>

        {/* Collection Tiles */}
        {(activations ?? []).map((activation: Activation) => (
          <Grid item xs={12} sm={6} md={4} xl={3} key={activation._id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia component="img" height="240" image={activation.triggeringImageGhost} alt={activation.name} />
              <CardContent>
                <Typography variant="h6" component="div">
                  {activation.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {activation.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Stack
                  alignItems="center"
                  sx={{ width: '100%', flexDirection: 'row', overflow: 'hidden', flexWrap: 'wrap' }}
                >
                  <Stack direction="row" alignItems="center" gap={2}>
                    <AnalyticStat label="Views" value={activation.totalViews} Icon={PreviewIcon} />
                    <AnalyticStat label="Scans" value={activation.totalScans} Icon={ViewInArIcon} />
                    <AnalyticStat label="Likes" value={activation.totalLikes} Icon={ThumbUpOffAltIcon} />
                  </Stack>
                  <Stack direction="row" alignItems="center" gap={2} sx={{ ml: 'auto' }}>
                    <IconButton color="primary" onClick={() => handleShowDetails(activation._id)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="primary" onClick={() => handleShowQRCode(activation)}>
                      <QrCode />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDeleteCollection(activation)}>
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                </Stack>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      <DeleteConfirmationModal
        open={open}
        onClose={handleClose}
        onDelete={onDeleteCollection}
        itemName={activationToDelete?.name ?? ''}
        itemId={activationToDelete?._id ?? ''}
        title="Delete Activation"
      />
      <NotificationSnackbar
        message="Activation has been deleted"
        open={showNotification}
        setOpen={setShowNotification}
      />
      <QRCodeDialog
        open={isDialogOpen}
        onClose={() => setDialogOpen(false)}
        activation={activationToQRCode as Activation}
      />
    </>
  );
};
