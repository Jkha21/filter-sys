import { FieldConfig, FieldType, Operator } from '../types';

// Base operator factories
const createTextOperators = (): Operator[] => [
  { value: 'equals', label: 'Equals', inputType: 'text', apply: (row, val, key) => 
    row[key]?.toString().toLowerCase() === val?.toString().toLowerCase() },
  { value: 'contains', label: 'Contains', inputType: 'text', apply: (row, val, key) => 
    row[key]?.toString().toLowerCase().includes(val?.toString().toLowerCase() || '') },
  { value: 'startsWith', label: 'Starts With', inputType: 'text', apply: (row, val, key) => 
    row[key]?.toString().toLowerCase().startsWith(val?.toString().toLowerCase() || '') },
  { value: 'endsWith', label: 'Ends With', inputType: 'text', apply: (row, val, key) => 
    row[key]?.toString().toLowerCase().endsWith(val?.toString().toLowerCase() || '') },
  { value: 'notContains', label: 'Does Not Contain', inputType: 'text', apply: (row, val, key) => 
    !row[key]?.toString().toLowerCase().includes(val?.toString().toLowerCase() || '') }
];

const createNumberOperators = (): Operator[] => [
  { value: 'equals', label: 'Equals', inputType: 'number', apply: (row, val, key) => row[key] === val },
  { value: 'greater', label: 'Greater Than', inputType: 'number', apply: (row, val, key) => row[key] > val },
  { value: 'less', label: 'Less Than', inputType: 'number', apply: (row, val, key) => row[key] < val },
  { value: 'greaterEqual', label: 'Greater or Equal', inputType: 'number', apply: (row, val, key) => row[key] >= val },
  { value: 'lessEqual', label: 'Less or Equal', inputType: 'number', apply: (row, val, key) => row[key] <= val },
  { value: 'between', label: 'Between', inputType: 'daterange', apply: (row, [min, max], key) => 
    row[key] >= min && row[key] <= max }
];

const createBooleanOperators = (): Operator[] => [
  { value: 'is', label: 'Is', inputType: 'boolean', apply: (row, val, key) => row[key] === val }
];

const createSelectOperators = (): Operator[] => [
  { value: 'is', label: 'Is', inputType: 'select', apply: (row, val, key) => row[key] === val },
  { value: 'isNot', label: 'Is Not', inputType: 'select', apply: (row, val, key) => row[key] !== val }
];

// const createMultiSelectOperators = (): Operator[] => [
//   { value: 'in', label: 'Is In', inputType: 'multiselect', apply: (row, vals, key) => 
//     vals.some((val: string) => row[key]?.includes(val)) },
//   { value: 'notIn', label: 'Is Not In', inputType: 'multiselect', apply: (row, vals, key) => 
//     !vals.some((val: string) => row[key]?.includes(val)) }
// ];

// Complete field configurations
export const fieldConfigs: Record<string, FieldConfig> = {
  // Text fields
  name: {
    key: 'name',
    label: 'Name',
    type: 'text' as FieldType,
    operators: createTextOperators()
  },
  email: {
    key: 'email',
    label: 'Email',
    type: 'text' as FieldType,
    operators: createTextOperators()
  },
  
  // Nested text field
  'address.city': {
    key: 'address.city',
    label: 'City',
    type: 'text' as FieldType,
    operators: createTextOperators()
  },
  
  // Select fields
  department: {
    key: 'department',
    label: 'Department',
    type: 'select' as FieldType,
    operators: createSelectOperators(),
    options: [
      { label: 'Engineering', value: 'Engineering' },
      { label: 'Marketing', value: 'Marketing' },
      { label: 'Sales', value: 'Sales' },
      { label: 'HR', value: 'HR' },
      { label: 'Finance', value: 'Finance' },
      { label: 'Design', value: 'Design' },
      { label: 'Operations', value: 'Operations' }
    ]
  },
  
  // Number/Amount fields
  salary: {
    key: 'salary',
    label: 'Salary',
    type: 'amount' as FieldType,
    operators: createNumberOperators()
  },
  projects: {
    key: 'projects',
    label: 'Projects',
    type: 'number' as FieldType,
    operators: createNumberOperators()
  },
  performanceRating: {
    key: 'performanceRating',
    label: 'Performance Rating',
    type: 'number' as FieldType,
    operators: createNumberOperators()
  },
  
  // Date fields
  joinDate: {
    key: 'joinDate',
    label: 'Join Date',
    type: 'date' as FieldType,
    operators: [{ 
      value: 'between', 
      label: 'Between', 
      inputType: 'daterange',
      apply: (row, [start, end]: string[], key) => {
        const rowDate = new Date(row[key]);
        const startDate = new Date(start);
        const endDate = new Date(end);
        return rowDate >= startDate && rowDate <= endDate;
      }
    }]
  },
  lastReview: {
    key: 'lastReview',
    label: 'Last Review',
    type: 'date' as FieldType,
    operators: [{ 
      value: 'between', 
      label: 'Between', 
      inputType: 'daterange',
      apply: (row, [start, end]: string[], key) => {
        if (!row[key]) return false;
        const rowDate = new Date(row[key]);
        const startDate = new Date(start);
        const endDate = new Date(end);
        return rowDate >= startDate && rowDate <= endDate;
      }
    }]
  },
  
  // Boolean field
  isActive: {
    key: 'isActive',
    label: 'Active Status',
    type: 'boolean' as FieldType,
    operators: createBooleanOperators()
  }
};

// All available fields for dropdown
export const availableFields = Object.values(fieldConfigs);
