import type { Employee } from '../../../types/employee.types';
import type { FieldSchema, FilterCondition, FilterOperator } from '../../../types/filter.types';

export function getNestedValue(obj: any, path: string): any {
  if (!path) return obj;
  return path.split('.').reduce((current, key) => 
    (current && typeof current === 'object') ? current[key] : undefined, 
    obj
  );
}

export function applyFilters(
  data: Employee[], 
  filters: FilterCondition[], 
  schema: FieldSchema[]
): Employee[] {
  const validFilters = filters.filter(f => f.isValid);
  
  if (validFilters.length === 0) return data;

  return data.filter(item => 
    validFilters.every(filter => {
      const fieldDef = schema.find(f => f.id === filter.field);
      if (!fieldDef) return true;

      const value = getNestedValue(item, filter.field);
      return evaluateCondition(value, filter, fieldDef.type);
    })
  );
}

function evaluateCondition(
  value: any, 
  filter: FilterCondition, 
  fieldType: FieldSchema['type']
): boolean {
  if (value === null || value === undefined) return false;

  switch (fieldType) {
    case 'text':
      return evaluateTextCondition(value, filter);
    case 'number':
    case 'amount':
      return evaluateNumberCondition(value, filter);
    case 'date':
      return evaluateDateCondition(value, filter);
    case 'boolean':
      return evaluateBooleanCondition(value, filter);
    case 'multiselect':
      return evaluateMultiSelectCondition(value, filter);
    default:
      return String(value).toLowerCase() === String(filter.value).toLowerCase();
  }
}

function evaluateTextCondition(value: any, filter: FilterCondition): boolean {
  const strValue = String(value).toLowerCase().trim();
  const strFilter = String(filter.value).toLowerCase().trim();
  
  switch (filter.operator) {
    case 'contains': return strValue.includes(strFilter);
    case 'startsWith': return strValue.startsWith(strFilter);
    case 'endsWith': return strValue.endsWith(strFilter);
    case 'notContains': return !strValue.includes(strFilter);
    default: return strValue === strFilter;
  }
}

function evaluateNumberCondition(value: any, filter: FilterCondition): boolean {
  const numValue = Number(value);
  if (isNaN(numValue)) return false;

  if (filter.operator === 'between') {
    const range = filter.value as { start: string | number; end: string | number };
    return numValue >= Number(range.start) && numValue <= Number(range.end);
  }

  const filterNum = Number(filter.value);
  switch (filter.operator) {
    case 'greaterThan': return numValue > filterNum;
    case 'lessThan': return numValue < filterNum;
    case 'greaterThanEqual': return numValue >= filterNum;
    case 'lessThanEqual': return numValue <= filterNum;
    default: return numValue === filterNum;
  }
}

function evaluateDateCondition(value: any, filter: FilterCondition): boolean {
  const dateValue = new Date(value).getTime();
  if (isNaN(dateValue)) return false;

  const range = filter.value as { start: string; end: string };
  const startTime = new Date(range.start).getTime();
  const endTime = new Date(range.end).setHours(23, 59, 59, 999);

  return dateValue >= startTime && dateValue <= endTime;
}

function evaluateBooleanCondition(value: any, filter: FilterCondition): boolean {
  return Boolean(value) === Boolean(filter.value);
}

function evaluateMultiSelectCondition(value: any, filter: FilterCondition): boolean {
  const recordValues = Array.isArray(value) ? value : [value];
  const selectedOptions = Array.isArray(filter.value) ? filter.value : [];
  const hasOverlap = recordValues.some(val => selectedOptions.includes(val));
  return filter.operator === 'in' ? hasOverlap : !hasOverlap;
}

export function getDefaultValue(operator: string, type?: string): any {
  if (operator === 'between') return { start: '', end: '' };
  if (type === 'multiselect') return [];
  if (type === 'boolean') return true;
  return '';
}

export function getDefaultOperator(type: FieldSchema['type']): FilterOperator {
  const defaults: Record<string, FilterOperator> = {
    text: 'contains',
    number: 'equals',
    date: 'between',
    amount: 'between',
    boolean: 'equals',
    multiselect: 'in'
  };
  return defaults[type] || 'equals';
}

export function validateFilter(filter: Partial<FilterCondition>, type: string): boolean {
  if (!filter.field || !filter.operator) return false;

  if (filter.operator === 'between') {
    const val = filter.value as any;
    return !!(val?.start && val?.end && val.start !== '' && val.end !== '');
  }

  if (type === 'multiselect') {
    return Array.isArray(filter.value) && filter.value.length > 0;
  }

  if (type === 'boolean') return typeof filter.value === 'boolean';

  return filter.value !== undefined && filter.value !== null && String(filter.value).trim() !== '';
}

export function getFieldLabel(fieldId: string, schema: FieldSchema[]): string {
  return schema.find(f => f.id === fieldId)?.label || fieldId;
}

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
  in: 'in',
  notIn: 'not in'
};