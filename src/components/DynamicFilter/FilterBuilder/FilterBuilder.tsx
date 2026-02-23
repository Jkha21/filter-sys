import React, { createContext, useCallback, useMemo, useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Chip, 
  Stack
} from '@mui/material';
import { FilterList as FilterIcon } from '@mui/icons-material';
import { FilterList } from '../FilterList/FilterList';
import { ControlsBar } from '../ControlsBar/ControlsBar';
import type { FieldSchema, FilterCondition } from '../../../types/filter.types';
import type { Employee } from '../../../types/employee.types';
import '../../../styles/DynamicFilter/FilterBuilder.scss';

interface FilterBuilderProps {
  data: Employee[];
  schema: FieldSchema[];
  onFilteredDataChange?: (filteredData: Employee[]) => void;
}

export interface FilterBuilderContextValue {
  schema: FieldSchema[];
}

export const FilterBuilderContext = createContext<FilterBuilderContextValue>({ schema: [] });

function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current: any, key) => 
    current?.[key], obj
  );
}

function getFieldLabel(fieldId: string, schema: FieldSchema[]): string {
  const field = schema.find(f => f.id === fieldId);
  return field?.label || fieldId;
}

function getOperatorLabel(operator: string): string {
  const operatorLabels: Record<string, string> = {
    equals: '=',
    contains: 'contains',
    startsWith: 'starts with',
    endsWith: 'ends with',
    greater: '>',
    less: '<',
    greaterOrEqual: '≥',
    lessOrEqual: '≤',
    after: 'after',
    before: 'before'
  };
  return operatorLabels[operator] || operator;
}

function applyFilterLogic(
  value: any, 
  operator: string, 
  filterValue: any, 
  fieldType: string
): boolean {
  if (value === null || value === undefined || filterValue === null || filterValue === undefined) {
    return operator === 'isEmpty' || operator === 'isNull';
  }

  switch (fieldType) {
    case 'string':
    case 'text':
      const strValue = String(value).toLowerCase();
      const strFilter = String(filterValue).toLowerCase();
      
      switch (operator) {
        case 'equals': return strValue === strFilter;
        case 'contains': return strValue.includes(strFilter);
        case 'startsWith': return strValue.startsWith(strFilter);
        case 'endsWith': return strValue.endsWith(strFilter);
        case 'isEmpty': return strValue.trim() === '';
        default: return true;
      }

    case 'number':
    case 'integer':
      const numValue = Number(value);
      const numFilter = Number(filterValue);
      
      if (isNaN(numValue) || isNaN(numFilter)) return false;
      
      switch (operator) {
        case 'equals': return numValue === numFilter;
        case 'greater': return numValue > numFilter;
        case 'less': return numValue < numFilter;
        case 'greaterOrEqual': return numValue >= numFilter;
        case 'lessOrEqual': return numValue <= numFilter;
        default: return true;
      }

    case 'date':
      const dateValue = new Date(value);
      const dateFilter = new Date(filterValue);
      
      if (isNaN(dateValue.getTime()) || isNaN(dateFilter.getTime())) return false;
      
      switch (operator) {
        case 'equals': return dateValue.getTime() === dateFilter.getTime();
        case 'after': return dateValue > dateFilter;
        case 'before': return dateValue < dateFilter;
        default: return true;
      }

    case 'boolean':
      const boolValue = Boolean(value);
      const boolFilter = String(filterValue).toLowerCase() === 'true';
      
      return operator === 'equals' ? boolValue === boolFilter : true;

    case 'select':
    case 'multiSelect':
      const arrayValue = Array.isArray(value) ? value : [value];
      const arrayFilter = Array.isArray(filterValue) ? filterValue : [filterValue];
      return operator === 'containsAny' ? 
        arrayValue.some((v: any) => arrayFilter.includes(v)) : 
        arrayValue.every((v: any) => arrayFilter.includes(v));

    default:
      return String(value) === String(filterValue);
  }
}

interface ActiveFilterChipProps {
  filter: FilterCondition;
  schema: FieldSchema[];
  onRemove: (filterId: string) => void;
}

const ActiveFilterChip: React.FC<ActiveFilterChipProps> = ({ 
  filter, 
  schema, 
  onRemove 
}) => {
  const fieldLabel = getFieldLabel(filter.field, schema);
  const operatorLabel = getOperatorLabel(filter.operator);
  const displayValue = typeof filter.value === 'string' && filter.value.length > 20 
    ? `${filter.value.substring(0, 20)}...` 
    : filter.value;

  return (
    <Chip
      label={
        <Box display="flex" alignItems="center" gap={0.5}>
          <Typography variant="caption" fontWeight={600}>
            {fieldLabel}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {operatorLabel}
          </Typography>
          <Typography variant="caption" fontWeight={500}>
            {displayValue}
          </Typography>
        </Box>
      }
      onDelete={() => onRemove(filter.id)}
      color="primary"
      variant="filled"
      size="small"
      sx={{
        height: 32,
        '& .MuiChip-deleteIcon': {
          fontSize: '16px',
          color: 'white',
          opacity: 0.8,
          '&:hover': { opacity: 1 }
        }
      }}
      aria-label={`Remove filter: ${fieldLabel} ${operatorLabel} ${displayValue}`}
    />
  );
};

export const FilterBuilder: React.FC<FilterBuilderProps> = ({
  data,
  schema,
  onFilteredDataChange
}) => {
  const [filters, setFilters] = useState<FilterCondition[]>([]);
  
  const handleFiltersChange = useCallback((newFilters: FilterCondition[]) => {
    setFilters(newFilters);
    const filtered = data.filter(item => 
      newFilters.every(filter => matchesFilter(item, filter, schema))
    );
    onFilteredDataChange?.(filtered);
  }, [data, schema, onFilteredDataChange]);

  const handleRemoveFilter = useCallback((filterId: string) => {
    handleFiltersChange(filters.filter(f => f.id !== filterId));
  }, [filters, handleFiltersChange]);

  const handleClearAll = useCallback(() => {
    handleFiltersChange([]);
  }, [handleFiltersChange]);

  const filteredCount = useMemo(() => 
    data.filter(item => filters.every(filter => matchesFilter(item, filter, schema))).length
  , [data, filters, schema]);

  const contextValue = useMemo(() => ({ schema }), [schema]);

  return (
    <FilterBuilderContext.Provider value={contextValue}>
      <Paper elevation={3} className="filterBuilderContainer">
        {/* Header */}
        <Box className="filterBuilderHeader">
          <Box display="flex" alignItems="center" gap={2}>
            <FilterIcon color="primary" />
            <Box>
              <Typography variant="h6" className="filterBuilderTitle">
                Dynamic Filters
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {filteredCount} of {data.length} records
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Active Filters - NEW SECTION */}
        {filters.length > 0 && (
          <Box className="activeFiltersSection">
            <Typography variant="subtitle2" className="activeFiltersTitle" gutterBottom>
              Active Filters ({filters.length})
            </Typography>
            <Stack 
              direction="row" 
              spacing={1} 
              flexWrap="wrap" 
              gap={1}
              className="activeFiltersChips"
            >
              {filters.map(filter => (
                <ActiveFilterChip
                  key={filter.id}
                  filter={filter}
                  schema={schema}
                  onRemove={handleRemoveFilter}
                />
              ))}
              <Chip
                label="Clear All"
                onClick={handleClearAll}
                color="secondary"
                variant="outlined"
                size="small"
                sx={{ height: 32 }}
                aria-label="Clear all active filters"
              />
            </Stack>
          </Box>
        )}

        {/* Filter Builder */}
        <FilterList filters={filters} onFiltersChange={handleFiltersChange} />
        <ControlsBar filters={filters} onFiltersChange={handleFiltersChange} />
      </Paper>
    </FilterBuilderContext.Provider>
  );
};

function matchesFilter(item: Employee, filter: FilterCondition, schema: FieldSchema[]): boolean {
  const fieldDef = schema.find(f => f.id === filter.field);
  if (!fieldDef) return true;
  
  const value = getNestedValue(item, filter.field);
  if (value === undefined || value === null) return false;
  
  return applyFilterLogic(value, filter.operator, filter.value, fieldDef.type);
}
