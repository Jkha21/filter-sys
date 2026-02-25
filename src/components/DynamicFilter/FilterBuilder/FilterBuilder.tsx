import React, { createContext, useCallback, useMemo, useState, useEffect } from 'react';
import { Box, Paper, Typography, Divider } from '@mui/material';
import { Filter } from 'lucide-react'; 
import { FilterList } from '../FilterList/FilterList';
import { ControlsBar } from '../ControlsBar/ControlsBar';
import { applyFilters } from '../FilterUtils/FilterUtils';

import type { 
  FieldConfig, 
  FilterCondition, 
  FilterBuilderContextValue 
} from '../../../types/filter.types';
import type { Employee } from '../../../types/employee.types';

export const FilterBuilderContext = createContext<FilterBuilderContextValue | null>(null);

interface FilterBuilderProps {
  data: Employee[];
  schema: FieldConfig[]; // ✅ REQUIRED - NO FALLBACK
  onFilteredDataChange?: (filteredData: Employee[]) => void;
}

export const FilterBuilder: React.FC<FilterBuilderProps> = ({ 
  data, 
  schema, 
  onFilteredDataChange 
}) => {
  console.log('✅ Schema received:', schema.length, 'fields'); // Verify prop

  const [filters, setFilters] = useState<FilterCondition[]>([]);

  const updateFilter = useCallback((id: string, updates: Partial<FilterCondition>) => {
    setFilters(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
  }, []);

  const removeFilter = useCallback((id: string) => {
    setFilters(prev => prev.filter(f => f.id !== id));
  }, []);

  const addFilter = useCallback(() => {
    setFilters(prev => [...prev, { 
      id: `f_${Date.now()}`, 
      field: '', 
      operator: '', 
      value: '', 
      type: 'text', 
      isValid: false 
    }]);
  }, []);

  const clearAll = useCallback(() => setFilters([]), []);

  const filteredData = useMemo(() => 
    applyFilters(data, filters.filter(f => f.isValid), schema), 
  [data, filters, schema]);

  useEffect(() => { 
    onFilteredDataChange?.(filteredData); 
  }, [filteredData, onFilteredDataChange]);

  const contextValue = useMemo(() => ({
    schema,        // ✅ Original schema from parent
    updateFilter,
    removeFilter
  }), [schema, updateFilter, removeFilter]);

  return (
    <FilterBuilderContext.Provider value={contextValue}>
      <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden', mb: 3 }}>
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, bgcolor: 'grey.50' }}>
          <Filter size={20} color="#1976d2" />
          <Box>
            <Typography variant="subtitle1" fontWeight="600">Dynamic Filters</Typography>
            <Typography variant="caption" color="text.secondary">
              Advanced filtering enabled
            </Typography>
          </Box>
        </Box>
        
        <Divider />
        
        <Box sx={{ p: 2 }}>
          <FilterList filters={filters} onAddFilter={addFilter} />
        </Box>
        
        <ControlsBar 
          filters={filters} 
          onAddFilter={addFilter} 
          onClearAll={clearAll} 
          filteredCount={filteredData.length} 
          totalCount={data.length} 
        />
      </Paper>
    </FilterBuilderContext.Provider>
  );
};
