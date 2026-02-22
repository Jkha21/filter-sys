import { useMemo, useCallback, useRef } from 'react';
import { getEmployeesSync } from '../data/mockApi';
import type { Employee, FilterState, FilterResult } from '../types';
import { fieldConfigs } from '../config/field.config';

function useDebounceCallback<T extends (...args: any[]) => any>(
  callback: T, 
  delay: number
) {
  const timeoutRef = useRef<number | null>(null);
  
  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = window.setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );
}

export const useFilteredData = (filters: FilterState) => {
  const rawData = getEmployeesSync();

  const filterData = useCallback((data: Employee[], activeFilters: FilterState): Employee[] => {
    return data.filter((employee) => {
      return activeFilters.every((filter) => {
        const fieldConfig = fieldConfigs[filter.field as keyof typeof fieldConfigs];
        if (!fieldConfig) return true;

        const operator = fieldConfig.operators.find(op => op.value === filter.operator);
        if (!operator) return true;

        let fieldValue: any = employee;
        const keys = (filter.field as string).split('.');
        
        for (const key of keys) {
          fieldValue = fieldValue?.[key];
          if (fieldValue === undefined || fieldValue === null) return false;
        }

        return operator.apply(fieldValue, filter.value, filter.field);
      });
    });
  }, []);

  
  const result: FilterResult = useMemo(() => {
    const validFilters = filters.filter(f => f.isValid);
    
    if (validFilters.length === 0) {
      return {
        data: rawData,
        total: rawData.length,
        filtered: rawData.length
      };
    }

    const filteredData = filterData(rawData, validFilters);
    
    return {
      data: filteredData,
      total: rawData.length,
      filtered: filteredData.length
    };
  }, [filters, rawData, filterData]);

  return result;
};
