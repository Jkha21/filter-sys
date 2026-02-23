import React from 'react';
import {
  Button,
  ButtonGroup,
  Typography,
  Box,
  Tooltip,
  Fade
} from '@mui/material';
import {
  Add as AddIcon,
  FilterListOff as ClearAllIcon
} from '@mui/icons-material';
import type { FilterCondition } from '../../../types/filter.types';
import '../../../styles/DynamicFilter/ControlsBar.scss';

interface ControlsBarProps {
  filters: FilterCondition[];
  onFiltersChange: (filters: FilterCondition[]) => void;
}

export const ControlsBar: React.FC<ControlsBarProps> = ({ 
  filters, 
  onFiltersChange 
}) => {
  const handleAddFilter = () => {
    const newFilter: FilterCondition = {
      id: `filter_${Date.now()}`,
      field: '',
      operator: '',
      value: '',
      isValid: false
    };
    onFiltersChange([...filters, newFilter]);
  };

  const handleClearAll = () => {
    onFiltersChange([]);
  };

  const hasActiveFilters = filters.length > 0 && filters.some(f => 
    f.field && f.operator && f.value && f.isValid
  );

  return (
    <Fade in timeout={300}>
      <Box className="controls-bar-container">
        <Box className="controls-left">
          <Typography variant="body2" className="filters-count">
            {filters.length} {filters.length === 1 ? 'filter' : 'filters'} active
          </Typography>
        </Box>
        
        <ButtonGroup 
          className={`controls-buttons ${hasActiveFilters ? 'has-filters' : ''}`}
          variant="contained"
        >
          <Tooltip title="Add new filter">
            <Button 
              className="add-button"
              onClick={handleAddFilter}
              startIcon={<AddIcon />}
            >
              Add Filter
            </Button>
          </Tooltip>
          
          {hasActiveFilters && (
            <Tooltip title="Clear all filters">
              <Button 
                className="clear-all-button"
                onClick={handleClearAll}
                startIcon={<ClearAllIcon />}
                variant="outlined"
              >
                Clear All
              </Button>
            </Tooltip>
          )}
        </ButtonGroup>
      </Box>
    </Fade>
  );
};
