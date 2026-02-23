import type { Employee } from "./employee.types";

export type FilterType = 
  | 'text' 
  | 'number' 
  | 'date' 
  | 'amount' 
  | 'select' 
  | 'multiselect' 
  | 'boolean';

export interface FieldSchema {
  id: string;
  label: string;
  type: FilterType;
}

export type FilterOperatorMap = {
  text: string[];
  number: string[];
  date: string[];
  amount: string[];
  select: string[];
  multiselect: string[];
  boolean: string[];
};

export interface FieldConfig {
  key: keyof Employee | string;
  label: string;
  type: FilterType;
  operators: Operator[];
  options?: { label: string; value: string }[];
}

export interface Operator {
  value: string;
  label: string;
  inputType: 'text' | 'number' | 'daterange' | 'select' | 'multiselect' | 'boolean';
  apply: (row: any, value: any, fieldKey: string) => boolean;
}

export interface FilterCondition {
  id: string;
  field: string;
  operator: string;
  value: any;
  isValid: boolean;
  error?: string;
}

export type FilterState = FilterCondition[];

export interface FilterBuilderContextValue {
  schema: FieldConfig[];
}

export interface FilterBuilderProps {
  data: Employee[];
  schema: FieldConfig[];
  onFilteredDataChange?: (filteredData: Employee[]) => void;
}

export type FilterValue = 
  | string
  | number
  | boolean
  | { start: string; end: string }
  | { min: number | ''; max: number | '' }
  | string[];
