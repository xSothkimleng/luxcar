/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import * as React from 'react';
import { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Alert,
  Avatar,
  Stack,
  CircularProgress,
  Snackbar,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import CloseIcon from '@mui/icons-material/Close';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useCars } from '@/hooks/useCar';
import { useHomepageCars, useAddHomepageCar, useUpdateHomepageCarOrder, useRemoveHomepageCar } from '@/hooks/useHomepageCars';
import Image from 'next/image';

const HomepageContentPage = () => {
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  // Queries and mutations
  const { data: homepageCars, isLoading: isLoadingHomepageCars } = useHomepageCars();
  const { data: allCars, isLoading: isLoadingAllCars } = useCars();
  const { mutateAsync: addHomepageCar, isPending: isAddingCar } = useAddHomepageCar();
  const { mutateAsync: updateOrder } = useUpdateHomepageCarOrder();
  const { mutateAsync: removeCar, isPending: isRemovingCar } = useRemoveHomepageCar();

  // Remove already featured cars from the list of all cars
  const availableCars = React.useMemo(() => {
    if (!allCars || !homepageCars) return [];
    const featuredCarIds = homepageCars.map((item: any) => item.carId);
    return allCars.filter(car => !featuredCarIds.includes(car.id));
  }, [allCars, homepageCars]);

  // Handle drag and drop
  const handleDragEnd = async (result: any) => {
    if (!result.destination || !homepageCars) return;

    const items = Array.from(homepageCars);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    try {
      await updateOrder(items);
      setSnackbarMessage('Homepage car order updated successfully!');
      setSnackbarSeverity('success');
    } catch (error) {
      console.error('Error updating order:', error);
      setSnackbarMessage('Failed to update homepage car order');
      setSnackbarSeverity('error');
    }
  };

  // Handle add car to homepage
  const handleAddCar = async (carId: string) => {
    try {
      await addHomepageCar(carId);
      setOpenAddDialog(false);
      setSnackbarMessage('Car added to homepage successfully!');
      setSnackbarSeverity('success');
    } catch (error) {
      console.error('Error adding car to homepage:', error);
      setSnackbarMessage('Failed to add car to homepage');
      setSnackbarSeverity('error');
    }
  };

  // Handle remove car from homepage
  const handleRemoveCar = async (id: string) => {
    try {
      await removeCar(id);
      setSnackbarMessage('Car removed from homepage successfully!');
      setSnackbarSeverity('success');
    } catch (error) {
      console.error('Error removing car from homepage:', error);
      setSnackbarMessage('Failed to remove car from homepage');
      setSnackbarSeverity('error');
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant='h5' sx={{ fontWeight: 'bold', color: '#2D3748' }}>
            Homepage Featured Cars
          </Typography>
          <Button
            variant='contained'
            startIcon={<AddIcon />}
            onClick={() => setOpenAddDialog(true)}
            sx={{
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #605BFF 0%, #8A84FF 100%)',
              boxShadow: '0 4px 14px rgba(96, 91, 255, 0.3)',
            }}>
            Add Featured Car
          </Button>
        </Box>
        <Typography variant='body1' color='text.secondary'>
          Drag and drop to reorder. These cars will be displayed in the featured section on the homepage.
        </Typography>
      </Box>

      {isLoadingHomepageCars ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : homepageCars?.length > 0 ? (
        <Paper
          elevation={0}
          sx={{
            borderRadius: '16px',
            overflow: 'hidden',
            border: '1px solid rgba(230, 232, 240, 0.8)',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.03)',
          }}>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId='homepage-cars'>
              {provided => (
                <List {...provided.droppableProps} ref={provided.innerRef}>
                  {homepageCars.map((item: any, index: number) => (
                    <Draggable key={item.id} draggableId={item.id} index={index}>
                      {provided => (
                        <ListItem
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          divider={index < homepageCars.length - 1}
                          sx={{
                            '&:hover': {
                              backgroundColor: 'rgba(0,0,0,0.02)',
                            },
                          }}>
                          <Box {...provided.dragHandleProps} sx={{ mr: 2, cursor: 'grab' }}>
                            <DragIndicatorIcon color='action' />
                          </Box>
                          <Avatar
                            src={item.car.thumbnailImage?.url}
                            alt={item.car.name}
                            variant='rounded'
                            sx={{ mr: 2, width: 60, height: 60 }}
                          />
                          <ListItemText
                            primary={
                              <Typography variant='subtitle1' fontWeight='bold'>
                                {item.car.name}
                              </Typography>
                            }
                            secondary={
                              <Stack direction='row' spacing={1} sx={{ mt: 0.5 }}>
                                <Typography variant='body2' color='text.secondary'>
                                  {item.car.brand?.name}
                                </Typography>
                                <Typography variant='body2' color='text.secondary'>
                                  •
                                </Typography>
                                <Typography variant='body2' color='text.secondary'>
                                  {item.car.model?.name}
                                </Typography>
                              </Stack>
                            }
                          />
                          <ListItemSecondaryAction>
                            <IconButton
                              edge='end'
                              color='error'
                              onClick={() => handleRemoveCar(item.id)}
                              disabled={isRemovingCar}>
                              <DeleteIcon />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </List>
              )}
            </Droppable>
          </DragDropContext>
        </Paper>
      ) : (
        <Paper
          elevation={0}
          sx={{
            p: 4,
            textAlign: 'center',
            bgcolor: 'rgba(0,0,0,0.03)',
            borderRadius: '16px',
          }}>
          <Typography variant='h6' color='text.secondary' component='div'>
            No featured cars added yet
          </Typography>
          <Typography variant='body2' color='text.secondary' sx={{ mt: 1, mb: 2 }}>
            Add cars to display in the featured section on the homepage
          </Typography>
          <Button
            variant='contained'
            startIcon={<AddIcon />}
            onClick={() => setOpenAddDialog(true)}
            sx={{
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #605BFF 0%, #8A84FF 100%)',
            }}>
            Add Featured Car
          </Button>
        </Paper>
      )}

      {/* Add Car Dialog */}
      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} maxWidth='md' fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant='h6'>Add Featured Car</Typography>
            <IconButton onClick={() => setOpenAddDialog(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {isLoadingAllCars ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : availableCars.length > 0 ? (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {availableCars.map(car => (
                <Grid item xs={12} sm={6} md={4} key={car.id}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      borderRadius: '8px',
                      border: '1px solid rgba(0,0,0,0.08)',
                      display: 'flex',
                      flexDirection: 'column',
                      height: '100%',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': {
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        transform: 'translateY(-2px)',
                      },
                    }}
                    onClick={() => handleAddCar(car.id)}>
                    <Box
                      sx={{
                        width: '100%',
                        height: 150,
                        position: 'relative',
                        mb: 2,
                        borderRadius: '4px',
                        overflow: 'hidden',
                      }}>
                      <Image
                        unoptimized
                        src={car.thumbnailImage?.url || '/assets/images/placeholder.jpg'}
                        alt={car.name}
                        fill
                        style={{
                          objectFit: 'cover',
                        }}
                      />
                    </Box>
                    <Typography variant='subtitle1' fontWeight='bold' noWrap>
                      {car.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                      <Typography variant='body2' color='text.secondary'>
                        {car.brand?.name}
                      </Typography>
                      <Typography variant='body2' color='text.secondary'>
                        •
                      </Typography>
                      <Typography variant='body2' color='text.secondary'>
                        {car.model?.name}
                      </Typography>
                    </Box>
                    <Button
                      variant='outlined'
                      size='small'
                      startIcon={<AddIcon />}
                      sx={{ mt: 'auto', pt: 1 }}
                      onClick={e => {
                        e.stopPropagation();
                        handleAddCar(car.id);
                      }}>
                      {isAddingCar ? 'Adding...' : 'Add to Homepage'}
                    </Button>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Alert severity='info' sx={{ mt: 2 }}>
              All cars are already featured on the homepage.
            </Alert>
          )}
        </DialogContent>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={!!snackbarMessage}
        autoHideDuration={3000}
        onClose={() => setSnackbarMessage(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity={snackbarSeverity} onClose={() => setSnackbarMessage(null)}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default HomepageContentPage;
