import React, { useState } from 'react';

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PreviewIcon from '@mui/icons-material/Preview';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import { Grid, Card, CardContent, CardMedia, Typography, IconButton, CardActions, Stack } from '@mui/material';
import { useNavigate } from '@tanstack/react-location';
import { useQueryClient } from '@tanstack/react-query';

import { useDeleteCollection } from './hooks';
import { createCollectionUrl, editCollectionPath } from '../../Routing';
import { AnalyticStat } from '../../shared/components/AnalyticStat';
import { DeleteConfirmationModal } from '../../shared/components/DeleteConfirmationModal';
import { NotificationSnackbar } from '../../shared/components/NotificationSnackbar';
import { Collection } from '../../shared/types';

interface CollectionGridProps {
  collections: Collection[];
  isLoading?: boolean;
}

export const CollectionGrid = ({ collections }: CollectionGridProps) => {
  const queryClient = useQueryClient();
  const { mutate: deleteCollection } = useDeleteCollection();
  const [showNotification, setShowNotification] = useState(false);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [collectionToDelete, setCollectionToDelete] = useState<Collection>();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleCreateNewCollection = () => {
    navigate({ to: createCollectionUrl });
  };

  const handleEditCollection = (id: string) => {
    navigate({ to: editCollectionPath(id) });
  };

  const handleDeleteCollection = (collection: Collection) => {
    setCollectionToDelete(collection);
    handleOpen();
  };

  const onDeleteCollection = (id: string) => {
    deleteCollection(id, {
      onSuccess: () => {
        setShowNotification(true);
        queryClient.invalidateQueries({ queryKey: ['collections'] });
      },
      onError: () => {
        console.log(`Error deleting collection ${id}`);
      },
    });
    handleClose();
  };

  return (
    <>
      <Grid container spacing={3} sx={{ p: 3 }}>
        {/* New Collection Tile */}
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
              <IconButton color="primary" size="large" onClick={handleCreateNewCollection}>
                <AddCircleOutlineIcon fontSize="large" />
              </IconButton>
              <Typography variant="subtitle1" color="textSecondary">
                Create New Collection
              </Typography>
            </Stack>
          </Card>
        </Grid>

        {/* Collection Tiles */}
        {collections.map((collection: Collection) => (
          <Grid item xs={12} sm={6} md={4} xl={3} key={collection._id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia component="img" height="240" image={collection.thumb} alt={collection.title} />
              <CardContent>
                <Typography variant="h6" component="div">
                  {collection.title}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {collection.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Stack alignItems="center" sx={{ width: '100%', flexDirection: 'row' }}>
                  <Stack direction="row" alignItems="center" gap={2}>
                    <AnalyticStat label="Views" value={collection.totalViews} Icon={PreviewIcon} />
                    <AnalyticStat label="Likes" value={collection.totalLikes} Icon={ThumbUpOffAltIcon} />
                  </Stack>
                  <Stack direction="row" alignItems="center" gap={2} sx={{ ml: 'auto' }}>
                    <IconButton color="primary" onClick={() => handleEditCollection(collection._id)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDeleteCollection(collection)}>
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
        itemName={collectionToDelete?.title ?? ''}
        itemId={collectionToDelete?._id ?? ''}
        title="Delete collection"
      />
      <NotificationSnackbar
        message="Collection has been deleted"
        open={showNotification}
        setOpen={setShowNotification}
      />
    </>
  );
};
