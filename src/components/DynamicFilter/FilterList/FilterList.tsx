import React from 'react';
import { Stack, Typography, Fade, Box, Button } from '@mui/material';
import { Plus, ListFilter } from 'lucide-react'; 
import { FilterConditionItem } from '../FilterCondition/FilterConditonItem';
import type { FilterCondition } from '../../../types/filter.types';

// FUNCTIONALITY FIX: Removed 'onFiltersChange' as it is now handled via Context
interface FilterListProps {
  filters: FilterCondition[];
  onAddFilter: () => void;
}

export const FilterList: React.FC<FilterListProps> = ({ 
  filters, 
  onAddFilter 
}) => {
  const isEmpty = filters.length === 0;

  return (
    <Box sx={{ minHeight: isEmpty ? 180 : 'auto' }}>
      {isEmpty ? (
        <Fade in timeout={400}>
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              py: 4,
              border: '2px dashed',
              borderColor: 'divider',
              borderRadius: 2,
              bgcolor: 'action.hover'
            }}
          >
            <ListFilter size={40} color="#9e9e9e" style={{ marginBottom: 12 }} />
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              No filters applied to this dataset.
            </Typography>
            {/* Unified CTA: This button does the same as the global Add button */}
            <Button 
              variant="contained" 
              size="small"
              startIcon={<Plus size={16} />} 
              onClick={onAddFilter}
              disableElevation
            >
              Add First Filter
            </Button>
          </Box>
        </Fade>
      ) : (
        <Stack spacing={1}>
          {filters.map((filter, index) => (
            <FilterConditionItem
              key={filter.id}
              filter={filter}
              index={index}
            />
          ))}
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
            <Button
              size="small"
              variant="text"
              startIcon={<Plus size={16} />}
              onClick={onAddFilter}
              sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
            >
              Add another condition
            </Button>
          </Box>
        </Stack>
      )}
    </Box>
  );
};