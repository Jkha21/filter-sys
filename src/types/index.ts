// src/types/index.ts - PROPER BARREL EXPORTS
export * from './employee.types';
export * from './filter.types';
export * from './table.types';

// Explicit re-exports for safety
export type { Employee, Address } from './employee.types';
export type { 
  FieldConfig, 
  Operator, 
  FilterCondition, 
  FilterState, 
  FieldType 
} from './filter.types';
export type { TableColumn, FilterResult } from './table.types';
