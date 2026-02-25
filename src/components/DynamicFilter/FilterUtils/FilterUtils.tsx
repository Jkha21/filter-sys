import type { Employee } from '../../../types/employee.types';
import type { FieldConfig, FilterCondition } from '../../../types/filter.types';

export function getNestedValue(obj: any, path: string): any {
  if (!path || !obj) return obj;
  return path.split('.').reduce((current, key) => {
    return (current && typeof current === 'object' && key in current) ? current[key] : undefined;
  }, obj);
}

export function applyFilters(
  data: Employee[], 
  filters: FilterCondition[], 
  schema: FieldConfig[]
): Employee[] {
  if (filters.length === 0) return data;

  return data.filter(item => 
    filters.every(filter => {
      const fieldDef = schema.find(f => f.id === filter.field);
      if (!fieldDef) return true;

      let value = getNestedValue(item, fieldDef.key);
      
      if (value === null || value === undefined) {
        value = '';
      }

      const filterValue = filter.value;
      
      console.log(`🔍 Filter: ${filter.field} ${filter.operator} "${filterValue}" | Value: "${value}"`);

      switch (filter.operator) {
        case 'contains':
        case 'like':
          return String(value).toLowerCase().includes(String(filterValue).toLowerCase());
          
        case 'equals':
        case '=':
          return String(value).toLowerCase() === String(filterValue).toLowerCase();
          
        case 'not_equals':
        case '!=':
          return String(value).toLowerCase() !== String(filterValue).toLowerCase();
          
        case 'starts_with':
          return String(value).toLowerCase().startsWith(String(filterValue).toLowerCase());
          
        case 'ends_with':
          return String(value).toLowerCase().endsWith(String(filterValue).toLowerCase());
          
        case 'greater_than':
        case '>':
          return Number(value || 0) > Number(filterValue || 0);
          
        case 'less_than':
        case '<':
          return Number(value || 0) < Number(filterValue || 0);
          
        case 'between':
          if (typeof filterValue === 'object' && filterValue !== null) {
            const rangeValue = filterValue as any;
            const start = Number(rangeValue?.start ?? rangeValue?.min ?? 0) || 0;
            const end = Number(rangeValue?.end ?? rangeValue?.max ?? 0) || 0;
            
            const numValue = Number(value || 0);
            return numValue >= start && numValue <= end;
          }
          return false;
          
        case 'is':
          if (filterValue === 'true' || filterValue === true) {
            return Boolean(value) === true;
          }
          return Boolean(value) === false;
          
        case 'in':
          if (Array.isArray(filterValue)) {
            return filterValue.some((v: any) => String(v).toLowerCase() === String(value).toLowerCase());
          }
          return false;
          
        default:
          return true;
      }
    })
  );
}

export function getDefaultValue(operator: string, type?: string): any {
  if (operator === 'between') return { start: '', end: '' };
  if (type === 'multiselect') return [];
  if (type === 'boolean') return true;
  return '';
}

export function getDefaultOperator(type: string): string {
  const defaults: Record<string, string> = {
    text: 'contains',
    number: 'equals',
    date: 'between',
    amount: 'between',
    boolean: 'is',
    multiselect: 'in'
  };
  return defaults[type] || 'equals';
}

export function validateFilter(filter: Partial<FilterCondition>, type: string): boolean {
  if (!filter.field || !filter.operator) return false;

  if (filter.operator === 'between') {
    const val = filter.value as any;
    return !!(val?.start && val?.end && val.start !== '' && val.end !== '') ||
           !!(val?.min && val?.max && val.min !== '' && val.max !== '');
  }

  if (type === 'multiselect') {
    return Array.isArray(filter.value) && filter.value.length > 0;
  }

  if (type === 'boolean') return typeof filter.value === 'boolean';

  return filter.value !== undefined && filter.value !== null && String(filter.value).trim() !== '';
}

export function getFieldLabel(fieldId: string, schema: FieldConfig[]): string {
  return schema.find(f => f.id === fieldId)?.label || fieldId;
}
