import React from 'react';
import { Stack, IconButton, Chip, Fade } from '@mui/material';
import { Add as AddIcon, FilterList as FilterIcon } from '@mui/icons-material';
import { FilterConditionItem } from '../FilterCondition/FilterConditonItem';
import type { FilterCondition } from '../../../types/filter.types';
import '../../../styles/DynamicFilter/FilterList.scss';

interface FilterListProps {
  filters: FilterCondition[];
  onFiltersChange: (filters: FilterCondition[]) => void;
}

export const FilterList: React.FC<FilterListProps> = ({ filters, onFiltersChange }) => {
  const addFilter = () => {
    const newFilter: FilterCondition = {
      id: `filter-${Date.now()}`,
      field: '',
      operator: '',
      value: '',
      isValid: false
    };
    onFiltersChange([...filters, newFilter]);
  };

  const removeFilter = (id: string) => {
    onFiltersChange(filters.filter(f => f.id !== id));
  };

  const updateFilter = (id: string, updated: Partial<FilterCondition>) => {
    onFiltersChange(
      filters.map(f => 
        f.id === id ? { ...f, ...updated } : f
      )
    );
  };

  return (
    <Stack className="filter-list-container" spacing={1.5}>
      <Fade in={filters.length === 0}>
        <Chip
          className="empty-filter-chip"
          label="Add your first filter to get started"
          icon={<FilterIcon />}
          variant="outlined"
          onClick={addFilter}
          clickable
        />
      </Fade>

      <Stack spacing={1.5} className="filters-stack">
        {filters.map((filter) => (
          <FilterConditionItem
            key={filter.id}
            filter={filter}
            onUpdate={(updated) => updateFilter(filter.id, updated)}
            onRemove={() => removeFilter(filter.id)}
          />
        ))}
      </Stack>

      {filters.length > 0 && (
        <IconButton 
          className="add-filter-button"
          onClick={addFilter}
          size="small"
        >
          <AddIcon />
        </IconButton>
      )}
    </Stack>
  );
};
