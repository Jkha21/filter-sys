import type { Employee } from "./employee.types";

export type FilterType = 
  | 'text' 
  | 'number' 
  | 'date' 
  | 'amount' 
  | 'select' 
  | 'multiselect' 
  | 'boolean';

export type FieldType = FilterType;

export interface FieldSchema {
  id: string;
  label: string;
  type: FilterType;
  options?: { label: string; value: string }[];
}

export interface FieldConfig extends FieldSchema {
  key: keyof Employee | string;
  operators: Operator[];
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
  value: FilterValue;
  isValid: boolean;
  error?: string;
  type?: FilterType;
}

export type FilterState = FilterCondition[];

export interface FilterBuilderContextValue {
  schema: FieldConfig[];
  updateFilter: (id: string, updates: Partial<FilterCondition>) => void;
  removeFilter: (id: string) => void; // ✅ Added
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

// ✅ UTILITY FUNCTIONS (Moved here from filterUtils to avoid circular imports)
export function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current: any, key) => current?.[key], obj);
}

// ✅ OPERATOR FUNCTIONS (Required by DEFAULT_OPERATORS)
export function textEquals(row: any, value: any, fieldKey: string): boolean {
  const fieldValue = getNestedValue(row, fieldKey);
  return String(fieldValue).toLowerCase() === String(value).toLowerCase();
}

export function textContains(row: any, value: any, fieldKey: string): boolean {
  const fieldValue = getNestedValue(row, fieldKey);
  return String(fieldValue).toLowerCase().includes(String(value).toLowerCase());
}

export function textStartsWith(row: any, value: any, fieldKey: string): boolean {
  const fieldValue = getNestedValue(row, fieldKey);
  return String(fieldValue).toLowerCase().startsWith(String(value).toLowerCase());
}

export function textEndsWith(row: any, value: any, fieldKey: string): boolean {
  const fieldValue = getNestedValue(row, fieldKey);
  return String(fieldValue).toLowerCase().endsWith(String(value).toLowerCase());
}

export function textNotContains(row: any, value: any, fieldKey: string): boolean {
  return !textContains(row, value, fieldKey);
}

export function numberEquals(row: any, value: any, fieldKey: string): boolean {
  const fieldValue = Number(getNestedValue(row, fieldKey));
  return !isNaN(fieldValue) && fieldValue === Number(value);
}

export function numberGreaterThan(row: any, value: any, fieldKey: string): boolean {
  const fieldValue = Number(getNestedValue(row, fieldKey));
  return !isNaN(fieldValue) && fieldValue > Number(value);
}

export function numberLessThan(row: any, value: any, fieldKey: string): boolean {
  const fieldValue = Number(getNestedValue(row, fieldKey));
  return !isNaN(fieldValue) && fieldValue < Number(value);
}

export function numberGreaterThanEqual(row: any, value: any, fieldKey: string): boolean {
  const fieldValue = Number(getNestedValue(row, fieldKey));
  return !isNaN(fieldValue) && fieldValue >= Number(value);
}

export function numberLessThanEqual(row: any, value: any, fieldKey: string): boolean {
  const fieldValue = Number(getNestedValue(row, fieldKey));
  return !isNaN(fieldValue) && fieldValue <= Number(value);
}

export function dateBetween(row: any, value: any, fieldKey: string): boolean {
  const fieldValue = new Date(getNestedValue(row, fieldKey));
  if (isNaN(fieldValue.getTime())) return false;
  
  const startDate = new Date((value as any).start);
  const endDate = new Date((value as any).end + 'T23:59:59');
  
  return fieldValue >= startDate && fieldValue <= endDate;
}

export function amountBetween(row: any, value: any, fieldKey: string): boolean {
  const fieldValue = Number(getNestedValue(row, fieldKey));
  if (isNaN(fieldValue)) return false;
  
  const min = Number((value as any).start);
  const max = Number((value as any).end);
  
  return fieldValue >= min && fieldValue <= max;
}

export function selectEquals(row: any, value: any, fieldKey: string): boolean {
  return String(getNestedValue(row, fieldKey)) === String(value);
}

export function selectNotEquals(row: any, value: any, fieldKey: string): boolean {
  return !selectEquals(row, value, fieldKey);
}

export function multiSelectIn(row: any, value: any, fieldKey: string): boolean {
  const fieldValue = getNestedValue(row, fieldKey);
  const arrayValue = Array.isArray(fieldValue) ? fieldValue : [fieldValue];
  const filterValues = (value as string[]).map(String);
  
  return arrayValue.some((v: any) => filterValues.includes(String(v)));
}

export type FilterOperator = 
  | 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'notContains'
  | 'greaterThan' | 'lessThan' | 'greaterThanEqual' | 'lessThanEqual'
  | 'between' | 'is' | 'isNot' | 'in' | 'notIn';


export function multiSelectNotIn(row: any, value: any, fieldKey: string): boolean {
  return !multiSelectIn(row, value, fieldKey);
}

export function booleanEquals(row: any, value: any, fieldKey: string): boolean {
  return Boolean(getNestedValue(row, fieldKey)) === Boolean(value);
}

// ✅ BACKWARD COMPATIBILITY
export const OPERATORS: Record<FilterType, string[]> = {
  text: ['equals', 'contains', 'startsWith', 'endsWith', 'notContains'],
  number: ['equals', 'greaterThan', 'lessThan', 'greaterThanEqual', 'lessThanEqual'],
  date: ['between'],
  amount: ['between'],
  select: ['is', 'isNot'],
  multiselect: ['in', 'notIn'],
  boolean: ['is']
};

export const OPERATOR_LABELS: Record<string, string> = {
  equals: '=',
  contains: 'contains',
  startsWith: 'starts with',
  endsWith: 'ends with',
  notContains: 'not contains',
  greaterThan: '>',
  lessThan: '<',
  greaterThanEqual: '≥',
  lessThanEqual: '≤',
  between: 'between',
  is: 'is',
  isNot: 'is not',
  in: 'in',
  notIn: 'not in'
};

// ✅ DEFAULT OPERATORS BY TYPE (Now works without errors)
export const DEFAULT_OPERATORS: Record<FilterType, Operator[]> = {
  text: [
    { value: 'equals', label: '=', inputType: 'text', apply: textEquals },
    { value: 'contains', label: 'contains', inputType: 'text', apply: textContains },
    { value: 'startsWith', label: 'starts with', inputType: 'text', apply: textStartsWith },
    { value: 'endsWith', label: 'ends with', inputType: 'text', apply: textEndsWith },
    { value: 'notContains', label: 'not contains', inputType: 'text', apply: textNotContains }
  ],
  number: [
    { value: 'equals', label: '=', inputType: 'number', apply: numberEquals },
    { value: 'greaterThan', label: '>', inputType: 'number', apply: numberGreaterThan },
    { value: 'lessThan', label: '<', inputType: 'number', apply: numberLessThan },
    { value: 'greaterThanEqual', label: '≥', inputType: 'number', apply: numberGreaterThanEqual },
    { value: 'lessThanEqual', label: '≤', inputType: 'number', apply: numberLessThanEqual }
  ],
  date: [
    { value: 'between', label: 'between', inputType: 'daterange', apply: dateBetween }
  ],
  amount: [
    { value: 'between', label: 'between', inputType: 'daterange', apply: amountBetween }
  ],
  select: [
    { value: 'is', label: 'is', inputType: 'select', apply: selectEquals },
    { value: 'isNot', label: 'is not', inputType: 'select', apply: selectNotEquals }
  ],
  multiselect: [
    { value: 'in', label: 'in', inputType: 'multiselect', apply: multiSelectIn },
    { value: 'notIn', label: 'not in', inputType: 'multiselect', apply: multiSelectNotIn }
  ],
  boolean: [
    { value: 'is', label: 'is', inputType: 'boolean', apply: booleanEquals }
  ]
};
