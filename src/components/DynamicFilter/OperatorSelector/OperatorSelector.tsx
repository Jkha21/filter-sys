import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent
} from '@mui/material';
import type { FilterType } from '../../../types/filter.types';
import '../../../styles/DynamicFilter/OperatorSelector.scss';

interface OperatorSelectorProps {
  fieldType: FilterType;
  value: string;
  onChange: (operator: string) => void;
  className?: string;
}

const OPERATORS: Record<FilterType, string[]> = {
  text: ['equals', 'contains', 'startsWith', 'endsWith', 'notContains'],
  number: ['equals', 'greaterThan', 'lessThan', 'greaterThanEqual', 'lessThanEqual'],
  date: ['between'],
  amount: ['between'],
  select: ['is', 'isNot'],
  multiselect: ['in', 'notIn'],
  boolean: ['is']
};

const OPERATOR_LABELS: Record<string, string> = {
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

export const OperatorSelector: React.FC<OperatorSelectorProps> = ({
  fieldType,
  value,
  onChange,
  className = ''
}) => {
  const availableOperators = OPERATORS[fieldType] || [];

  const handleChange = (event: SelectChangeEvent<string>) => {
    onChange(event.target.value);
  };

  const getLabel = (operator: string) => OPERATOR_LABELS[operator] || operator;

  return (
    <FormControl size="small" className={`operator-selector ${className}`}>
      <InputLabel>Operator</InputLabel>
      <Select
        value={value}
        onChange={handleChange}
        label="Operator"
        displayEmpty
        notched
      >
        {availableOperators.map((operator) => (
          <MenuItem key={operator} value={operator}>
            {getLabel(operator)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
