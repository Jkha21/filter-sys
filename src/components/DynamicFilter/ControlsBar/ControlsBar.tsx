import React from 'react';
import { Button, Typography, Box, Fade, Stack, Divider } from '@mui/material';
import { Plus, FilterX } from 'lucide-react'; 
import type { FilterCondition } from '../../../types/filter.types';

interface ControlsBarProps {
  filters: FilterCondition[];
  onAddFilter: () => void;
  onClearAll: () => void;
  filteredCount: number;
  totalCount: number;
}

export const ControlsBar: React.FC<ControlsBarProps> = ({ 
  filters, 
  onAddFilter,
  onClearAll,
  filteredCount,
  totalCount
}) => {
  const hasActiveFilters = filters.length > 0;

  return (
    <Fade in timeout={300}>
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'background.paper' }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="body2" color="text.secondary">
            {hasActiveFilters ? (
              <span>Found <b>{filteredCount}</b> of <b>{totalCount}</b> records</span>
            ) : (
              <span>Total records: <b>{totalCount}</b></span>
            )}
          </Typography>
        </Stack>
        
        <Stack direction="row" spacing={1}>
          {hasActiveFilters && (
            <Button 
              size="small"
              color="inherit"
              onClick={onClearAll}
              startIcon={<FilterX size={16} />}
              sx={{ textTransform: 'none' }}
            >
              Clear All
            </Button>
          )}

          <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

          <Button 
            variant="contained" 
            size="small"
            onClick={onAddFilter}
            startIcon={<Plus size={16} />}
            disableElevation
          >
            Add Filter
          </Button>
        </Stack>
      </Box>
    </Fade>
  );
};