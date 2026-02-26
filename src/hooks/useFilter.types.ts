// src/hooks/useFilters.ts
import { useState, useCallback } from 'react';
import type { FilterCondition, FilterState } from '../types';
import { fieldConfigs } from '../config/field.config';

export const useFilters = () => {
  const [filters, setFilters] = useState<FilterState>([]);

  // Generate unique ID for filter rows
  const generateId = useCallback(() => 
    `filter-${Math.random().toString(36).substr(2, 9)}`, []);

  // Add new empty filter
  const addFilter = useCallback(() => {
    const newFilter: FilterCondition = {
      id: generateId(),
      field: '',
      operator: '',
      value: '',
      isValid: false
    };
    setFilters(prev => [...prev, newFilter]);
  }, [generateId]);

  // Update specific filter field
  const updateFilter = useCallback((
    id: string, 
    field: keyof FilterCondition, 
    value: any
  ) => {
    setFilters(prev => prev.map(f => 
      f.id === id 
        ? { 
            ...f, 
            [field]: value,
            isValid: validateFilter({ ...f, [field]: value })
          }
        : f
    ));
  }, []);

  // Remove filter by ID
  const removeFilter = useCallback((id: string) => {
    setFilters(prev => prev.filter(f => f.id !== id));
  }, []);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setFilters([]);
  }, []);

  // Validate single filter condition
  const validateFilter = useCallback((filter: FilterCondition): boolean => {
    const fieldConfig = fieldConfigs[filter.field as string];
    if (!fieldConfig) return false;
    
    const operator = fieldConfig.operators.find(op => op.value === filter.operator);
    if (!operator) return false;
    
    // Basic value validation
    if (!filter.value && filter.value !== false && filter.value !== 0) {
      return false;
    }
    
    return true;
  }, []);

  // Get valid filters only
  const validFilters = filters.filter(f => f.isValid);

  return {
    filters,
    validFilters,
    addFilter,
    updateFilter,
    removeFilter,
    clearFilters,
    hasFilters: validFilters.length > 0,
    count: validFilters.length
  };
};
