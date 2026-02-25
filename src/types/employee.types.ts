import type { FieldConfig } from '../types/filter.types';
import { DEFAULT_OPERATORS } from '../types/filter.types'; 

export interface Address {
  city: string;
  state: string;
  country: string;
}

export interface Employee {
  id: number;
  name: string;
  email: string | null;
  department: string;
  role: string;
  salary: number;
  joinDate: string; // ISO date string
  isActive: boolean;
  skills: string[];
  address: Address;
  projects: number;
  lastReview: string | null;
  performanceRating: number;
}

// ✅ EXPORTED SCHEMA - Your FilterBuilder DROPDOWNS WORK!
export const EMPLOYEE_SCHEMA: FieldConfig[] = [
  // Core fields
  {
    id: 'id',
    label: 'ID',
    type: 'number',
    key: 'id',
    operators: DEFAULT_OPERATORS.number
  },
  {
    id: 'name',
    label: 'Name',
    type: 'text',
    key: 'name',
    operators: DEFAULT_OPERATORS.text
  },
  {
    id: 'email',
    label: 'Email',
    type: 'text',
    key: 'email',
    operators: DEFAULT_OPERATORS.text
  },
  {
    id: 'department',
    label: 'Department',
    type: 'select',
    key: 'department',
    operators: DEFAULT_OPERATORS.select
  },
  {
    id: 'role',
    label: 'Role',
    type: 'text',
    key: 'role',
    operators: DEFAULT_OPERATORS.text
  },
  {
    id: 'salary',
    label: 'Salary',
    type: 'amount',
    key: 'salary',
    operators: DEFAULT_OPERATORS.amount
  },
  {
    id: 'joinDate',
    label: 'Join Date',
    type: 'date',
    key: 'joinDate',
    operators: DEFAULT_OPERATORS.date
  },
  {
    id: 'isActive',
    label: 'Active',
    type: 'boolean',
    key: 'isActive',
    operators: DEFAULT_OPERATORS.boolean
  },
  {
    id: 'projects',
    label: 'Projects',
    type: 'number',
    key: 'projects',
    operators: DEFAULT_OPERATORS.number
  },
  {
    id: 'performanceRating',
    label: 'Performance',
    type: 'number',
    key: 'performanceRating',
    operators: DEFAULT_OPERATORS.number
  },
  {
    id: 'skills',
    label: 'Skills',
    type: 'multiselect',
    key: 'skills',
    operators: DEFAULT_OPERATORS.multiselect
  },
  // Nested address
  {
    id: 'address.city',
    label: 'City',
    type: 'text',
    key: 'address.city',
    operators: DEFAULT_OPERATORS.text
  },
  {
    id: 'address.state',
    label: 'State',
    type: 'text',
    key: 'address.state',
    operators: DEFAULT_OPERATORS.text
  },
  {
    id: 'address.country',
    label: 'Country',
    type: 'text',
    key: 'address.country',
    operators: DEFAULT_OPERATORS.text
  },
  {
    id: 'lastReview',
    label: 'Last Review',
    type: 'date',
    key: 'lastReview',
    operators: DEFAULT_OPERATORS.date
  }
];
