import type { Employee } from "./employee.types";

export type FieldType = 
  | 'text' 
  | 'number' 
  | 'date' 
  | 'amount' 
  | 'select' 
  | 'multiselect' 
  | 'boolean';

export interface Operator {
  value: string;
  label: string;
  inputType: 'text' | 'number' | 'daterange' | 'select' | 'multiselect' | 'boolean';
  apply: (row: any, value: any, fieldKey: string) => boolean;
}

export interface FieldConfig {
  key: keyof Employee | string; // Support nested: 'address.city'
  label: string;
  type: FieldType;
  operators: Operator[];
  options?: { label: string; value: string }[]; // for select/multiselect
}

export interface FilterCondition {
  id: string; // unique identifier
  field: string;
  operator: string;
  value: any;
  isValid: boolean;
  error?: string;
}

export type FilterState = FilterCondition[];
