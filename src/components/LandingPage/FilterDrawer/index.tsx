import * as React from 'react';
import { useEffect, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { Car } from '@/types/car';
import { carBrands } from '@/data/cars';
import {
  Box,
  Button,
  Divider,
  Typography,
  Slider,
  List,
  ListItemButton,
  ListItemText,
  TextField,
  InputAdornment,
} from '@mui/material';

interface FilterDrawerProps {
  cars: Car[];
  setFilteredCars: React.Dispatch<React.SetStateAction<Car[]>>;
}

const FilterDrawer: React.FC<FilterDrawerProps> = ({ cars, setFilteredCars }) => {
  const [priceRange, setPriceRange] = useState<number[]>([0, 120000]);
  const [selectedBrand, setSelectedBrand] = useState('All Brands');

  const [searchQuery, setSearchQuery] = useState('');

  // Get the min and max price from the car data
  const minPrice = Math.min(...cars.map(car => car.price));
  const maxPrice = Math.max(...cars.map(car => car.price));

  const handlePriceChange = (event: Event, newValue: number | number[]) => {
    setPriceRange(newValue as number[]);
  };

  const handleBrandSelect = (brand: string) => {
    setSelectedBrand(brand);
  };

  useEffect(() => {
    // Apply filters when any filter changes
    let filtered = [...cars];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        car =>
          car.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          car.brand?.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Filter by price range
    filtered = filtered.filter(car => car.price >= priceRange[0] && car.price <= priceRange[1]);

    // Filter by brand
    if (selectedBrand !== 'All Brands') {
      filtered = filtered.filter(car => car.brand === selectedBrand);
    }

    setFilteredCars(filtered);
  }, [searchQuery, priceRange, selectedBrand, cars, setFilteredCars]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant='h6' fontWeight='bold' gutterBottom>
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
      <Typography variant='subtitle1' fontWeight='bold' gutterBottom>
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
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Brand Filter */}
      <Typography variant='subtitle1' fontWeight='bold' gutterBottom>
        Brand
      </Typography>
      <List dense sx={{ mb: 2 }}>
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
      <Button
        variant='outlined'
        fullWidth
        onClick={() => {
          setSearchQuery('');
          setPriceRange([minPrice, maxPrice]);
          setSelectedBrand('All Brands');
        }}
        sx={{ mb: 2 }}>
        Reset All Filters
      </Button>
    </Box>
  );
};

export default FilterDrawer;
