import * as React from 'react';
import { useEffect, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import CloseIcon from '@mui/icons-material/Close';
import { Car } from '@/types/car';
import { carBrands } from '@/data/cars';
import {
  Box,
  Button,
  Divider,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  TextField,
  InputAdornment,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  useMediaQuery,
  useTheme,
  Fab,
  Badge,
} from '@mui/material';

interface FilterDrawerProps {
  cars: Car[];
  setFilteredCars: React.Dispatch<React.SetStateAction<Car[]>>;
}

const FilterDrawer: React.FC<FilterDrawerProps> = ({ cars, setFilteredCars }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [openDialog, setOpenDialog] = useState(false);

  const [priceRange, setPriceRange] = useState<number[]>([0, 120000]);
  const [selectedBrand, setSelectedBrand] = useState('All Brands');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  // Get the min and max price from the car data
  const minPrice = Math.min(...cars.map(car => car.price));
  const maxPrice = Math.max(...cars.map(car => car.price));

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handlePriceChange = (event: Event, newValue: number | number[]) => {
    setPriceRange(newValue as number[]);
  };

  const handleBrandSelect = (brand: string) => {
    setSelectedBrand(brand);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setPriceRange([minPrice, maxPrice]);
    setSelectedBrand('All Brands');
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  useEffect(() => {
    // Apply filters when any filter changes
    let filtered = [...cars];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        car =>
          car.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          car.brand?.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Filter by price range
    filtered = filtered.filter(car => car.price >= priceRange[0] && car.price <= priceRange[1]);

    // Filter by brand
    if (selectedBrand !== 'All Brands') {
      filtered = filtered.filter(car => car.brand?.name === selectedBrand);
    }

    setFilteredCars(filtered);

    // Count active filters
    let count = 0;
    if (searchQuery) count++;
    if (priceRange[0] > minPrice || priceRange[1] < maxPrice) count++;
    if (selectedBrand !== 'All Brands') count++;
    setActiveFiltersCount(count);
  }, [searchQuery, priceRange, selectedBrand, cars, setFilteredCars, minPrice, maxPrice]);

  // Filter content that will be used in both desktop and mobile views
  const filterContent = (
    <Box sx={{ p: 3 }}>
      <Typography variant='h6' fontWeight='bold' gutterBottom component='div'>
        Filters
      </Typography>

      {/* Search Box */}
      <TextField
        fullWidth
        placeholder='Search cars...'
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        variant='outlined'
        size='small'
        sx={{ mb: 3, mt: 2 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position='start'>
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      <Divider sx={{ mb: 3 }} />

      {/* Price Range Filter */}
      {/* <Typography variant='subtitle1' fontWeight='bold' gutterBottom component='div'>
        Price Range
      </Typography>
      <Box sx={{ px: 1, mb: 3 }}>
        <Slider
          value={priceRange}
          onChange={handlePriceChange}
          valueLabelDisplay='auto'
          min={minPrice}
          max={maxPrice}
          valueLabelFormat={value => `$${value.toLocaleString()}`}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
          <Typography variant='body2'>${priceRange[0].toLocaleString()}</Typography>
          <Typography variant='body2'>${priceRange[1].toLocaleString()}</Typography>
        </Box>
      </Box> */}

      <Divider sx={{ my: 3 }} />

      {/* Brand Filter */}
      <Typography variant='subtitle1' fontWeight='bold' gutterBottom component='div'>
        Brand
      </Typography>
      <List dense sx={{ mb: 2, maxHeight: '300px', overflowY: 'auto' }}>
        <ListItemButton
          key='all-brands'
          selected={selectedBrand === 'All Brands'}
          onClick={() => handleBrandSelect('All Brands')}
          sx={{
            borderRadius: 1,
            mb: 0.5,
            '&.Mui-selected': {
              backgroundColor: 'primary.light',
              '&:hover': {
                backgroundColor: 'primary.light',
              },
            },
          }}>
          <ListItemText
            primary='All Brands'
            primaryTypographyProps={{
              fontWeight: selectedBrand === 'All Brands' ? 'bold' : 'normal',
            }}
          />
        </ListItemButton>
        {carBrands.map(brand => (
          <ListItemButton
            key={brand}
            selected={selectedBrand === brand}
            onClick={() => handleBrandSelect(brand)}
            sx={{
              borderRadius: 1,
              mb: 0.5,
              '&.Mui-selected': {
                backgroundColor: 'primary.light',
                '&:hover': {
                  backgroundColor: 'primary.light',
                },
              },
            }}>
            <ListItemText
              primary={brand}
              primaryTypographyProps={{
                fontWeight: selectedBrand === brand ? 'bold' : 'normal',
              }}
            />
          </ListItemButton>
        ))}
      </List>
      <Divider sx={{ my: 3 }} />
      {/* Action Buttons */}
      <Button variant='outlined' fullWidth onClick={resetFilters} sx={{ mb: isMobile ? 2 : 0 }}>
        Reset All Filters
      </Button>

      {isMobile && (
        <Button variant='contained' fullWidth onClick={handleCloseDialog} sx={{ mt: 2 }}>
          Apply Filters
        </Button>
      )}
    </Box>
  );

  return (
    <>
      {/* Desktop Layout */}
      {!isMobile && filterContent}

      {/* Mobile Layout - Always render these components regardless of screen size */}
      {/* Filter Button - Visible on mobile only through CSS */}
      <Box
        sx={{
          display: { xs: 'block', md: 'none' },
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 1000,
        }}>
        <Fab color='primary' aria-label='filter' onClick={handleOpenDialog} sx={{ boxShadow: '0 4px 10px rgba(0,0,0,0.2)' }}>
          <Badge
            badgeContent={activeFiltersCount}
            color='error'
            sx={{
              '.MuiBadge-badge': {
                top: 5,
                right: 5,
              },
            }}>
            <FilterAltIcon />
          </Badge>
        </Fab>
      </Box>

      {/* Mobile Filter Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth='xs'
        PaperProps={{
          sx: {
            borderRadius: 2,
            maxHeight: '90vh',
          },
        }}>
        <DialogTitle sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant='h6' fontWeight='bold' component='div'>
            Filters
          </Typography>
          <IconButton edge='end' color='inherit' onClick={handleCloseDialog} aria-label='close'>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>{filterContent}</DialogContent>
      </Dialog>
    </>
  );
};

export default FilterDrawer;
