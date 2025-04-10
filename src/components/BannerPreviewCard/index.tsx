'use client';
import { useState } from 'react';
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  Button,
  IconButton,
  DialogActions,
  CircularProgress,
  Grid,
  Chip,
  Paper,
  Divider,
} from '@mui/material';
import Image from 'next/image';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import BannerSlideForm from '@/components/Form/BannerForm';
import { useDeleteBannerSlide } from '@/hooks/useBanner';
import { BannerSlide, BannerSlideFormData } from '@/types/banner';

interface BannerPreviewCardProps {
  slide: BannerSlide;
  onDelete?: () => void;
  onEdit?: () => void;
}

const BannerPreviewCard = ({ slide, onDelete, onEdit }: BannerPreviewCardProps) => {
  const [openDetail, setOpenDetail] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);

  const { mutateAsync: deleteSlide, isPending: isDeleting } = useDeleteBannerSlide();

  const handleOpenDetail = () => {
    setOpenDetail(true);
  };

  const handleCloseDetail = () => {
    setOpenDetail(false);
  };

  const handleOpenEdit = () => {
    setOpenEdit(true);
    setOpenDetail(false);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
    if (onEdit) onEdit();
  };

  const handleOpenDeleteConfirm = () => {
    setOpenDeleteConfirm(true);
  };

  const handleCloseDeleteConfirm = () => {
    setOpenDeleteConfirm(false);
  };

  const handleDelete = async () => {
    try {
      await deleteSlide(slide.id);
      handleCloseDeleteConfirm();
      handleCloseDetail();
      if (onDelete) onDelete();
    } catch (error) {
      console.error('Error deleting slide:', error);
    }
  };

  // Convert to form data for the editor
  const initialFormData: BannerSlideFormData = {
    title: slide.title,
    subtitle: slide.subtitle,
    mainImage: slide.mainImage,
    bgImage: slide.bgImage,
  };

  return (
    <>
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: '#f5f5f5',
          borderRadius: 2,
          overflow: 'hidden',
          cursor: 'pointer',
          '&:hover': {
            bgcolor: '#e0e0e0',
            '& .overlay': {
              opacity: 1,
            },
          },
        }}
        onClick={handleOpenDetail}>
        {/* Background image */}
        {slide.bgImage ? (
          <Image unoptimized src={slide.bgImage.url} alt={slide.title} fill style={{ objectFit: 'cover' }} quality={80} />
        ) : (
          <Box sx={{ p: 2, height: '100%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant='body2' color='text.secondary' align='center'>
              No background image
            </Typography>
          </Box>
        )}

        {/* Title overlay */}
        <Box
          className='overlay'
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            bgcolor: 'rgba(0,0,0,0.6)',
            color: 'white',
            p: 1,
            opacity: 0.8,
            transition: 'opacity 0.3s ease',
          }}>
          <Typography
            variant='body1'
            sx={{ fontWeight: 'bold', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
            {slide.title}
          </Typography>
        </Box>
      </Box>

      {/* Detail Dialog */}
      <Dialog open={openDetail} onClose={handleCloseDetail} maxWidth='md' fullWidth>
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid rgba(0,0,0,0.12)',
            py: 1,
          }}>
          <Typography variant='h6' sx={{ fontWeight: 500 }}>
            Slide Detail
          </Typography>
          <IconButton edge='end' onClick={handleCloseDetail} sx={{ color: 'text.secondary' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <Box sx={{ mb: 4, borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <Grid container spacing={1} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={3}>
                <Typography variant='body1' color='text.secondary'>
                  Title
                </Typography>
              </Grid>
              <Grid item xs={12} sm={9}>
                <Typography variant='body1' fontWeight={500}>
                  {slide.title}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={3}>
                <Typography variant='body1' color='text.secondary'>
                  Subtitle
                </Typography>
              </Grid>
              <Grid item xs={12} sm={9}>
                <Typography variant='body1'>{slide.subtitle}</Typography>
              </Grid>

              <Grid item xs={12} sm={3}>
                <Typography variant='body1' color='text.secondary'>
                  Collection
                </Typography>
              </Grid>
              <Grid item xs={12} sm={9}>
                {slide.model ? (
                  <Chip label={slide.model.name} size='small' color='primary' variant='outlined' />
                ) : (
                  <Typography variant='body2' color='text.secondary' fontStyle='italic'>
                    No Go To Model Collection
                  </Typography>
                )}
              </Grid>
            </Grid>
            <Divider sx={{ my: 2 }} />
            <Box>
              <Typography variant='body1'>Background Image</Typography>
              <Paper elevation={0} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                <Box sx={{ position: 'relative', width: '100%', height: 250, borderRadius: 1, overflow: 'hidden' }}>
                  {slide.bgImage ? (
                    <Image unoptimized src={slide.bgImage.url} alt='Background' fill style={{ objectFit: 'cover' }} />
                  ) : (
                    <Box
                      sx={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: '#f5f5f5',
                      }}>
                      <Typography color='text.secondary'>No background image</Typography>
                    </Box>
                  )}
                </Box>
              </Paper>
            </Box>

            <Box sx={{ mt: 2 }}>
              <Typography variant='body1'>Main Image</Typography>
              <Paper elevation={0} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                <Box sx={{ position: 'relative', width: '100%', height: 250, borderRadius: 1, overflow: 'hidden' }}>
                  {slide.mainImage ? (
                    <Image
                      unoptimized
                      src={slide.mainImage.url}
                      alt='Main'
                      fill
                      style={{ objectFit: 'contain', backgroundColor: '#f8f9fa' }}
                    />
                  ) : (
                    <Box
                      sx={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: '#f5f5f5',
                      }}>
                      <Typography color='text.secondary'>No main image</Typography>
                    </Box>
                  )}
                </Box>
              </Paper>
            </Box>
          </Box>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 2,
              pt: 2,
              borderTop: '1px solid rgba(0,0,0,0.08)',
            }}>
            <Button
              startIcon={<DeleteIcon />}
              color='error'
              variant='outlined'
              onClick={handleOpenDeleteConfirm}
              sx={{
                borderRadius: 2,
                '&:hover': { bgcolor: 'rgba(211, 47, 47, 0.04)' },
              }}>
              Delete
            </Button>
            <Button
              startIcon={<EditIcon />}
              color='primary'
              variant='contained'
              onClick={handleOpenEdit}
              sx={{
                borderRadius: 2,
                boxShadow: 2,
              }}>
              Edit
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={openEdit} onClose={handleCloseEdit} maxWidth='md' fullWidth>
        <DialogTitle>Edit Slide</DialogTitle>
        <DialogContent>
          <BannerSlideForm
            slideId={slide.id}
            initialData={initialFormData}
            onClose={handleCloseEdit}
            onSuccess={handleCloseEdit}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteConfirm} onClose={handleCloseDeleteConfirm}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete the slide {slide.title}? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteConfirm} disabled={isDeleting}>
            Cancel
          </Button>
          <Button onClick={handleDelete} color='error' disabled={isDeleting}>
            {isDeleting ? (
              <>
                <CircularProgress size={20} color='inherit' sx={{ mr: 1 }} />
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default BannerPreviewCard;
