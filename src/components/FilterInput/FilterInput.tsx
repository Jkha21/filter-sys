// src/components/FilterInput/FilterInput.tsx
import React from 'react';
import {
  TextField,
  FormControl,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  InputLabel,
  Chip,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import type { FieldType, Operator } from '../../types/filter.types';
import { fieldConfigs } from '../../config/field.config';

interface FilterInputProps {
  field: string;
  operator: string;
  value: any;
  onChange: (value: any) => void;
}

export const FilterInput: React.FC<FilterInputProps> = ({
  field,
  operator,
  value,
  onChange
}) => {
  const fieldConfig = fieldConfigs[field as string];
  if (!fieldConfig) return null;

  const InputComponent = getInputComponent(fieldConfig.type, operator);
  
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <FormControl sx={{ minWidth: 150, mr: 2 }}>
        {InputComponent({ value, onChange, fieldConfig })}
      </FormControl>
    </LocalizationProvider>
  );
};

// Map field types to input components
const getInputComponent = (type: FieldType, operator: string) => {
  switch (type) {
    case 'text':
      return ({ value, onChange }: any) => (
        <TextField
          size="small"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter text"
        />
      );
    
    case 'number':
    case 'amount':
      return ({ value, onChange }: any) => (
        <TextField
          size="small"
          type="number"
          value={value || ''}
          onChange={(e) => onChange(Number(e.target.value) || null)}
          placeholder="0"
          inputProps={{ step: '0.01' }}
        />
      );
    
    case 'boolean':
      return ({ value, onChange }: any) => (
        <FormControlLabel
          control={
            <Switch
              checked={value || false}
              onChange={(e) => onChange(e.target.checked)}
            />
          }
          label="Active"
          sx={{ margin: 0 }}
        />
      );
    
    case 'date':
      return ({ value, onChange }: any) => (
        <DatePicker
          value={value ? new Date(value) : null}
          onChange={(date) => onChange(date ? date.toISOString().split('T')[0] : null)}
          slotProps={{ 
            textField: { 
              size: 'small',
              sx: { minWidth: 150 }
            } 
          }}
        />
      );
    
    case 'select':
      return ({ value, onChange, fieldConfig }: any) => {
        const options = fieldConfig?.options || [];
        return (
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>{fieldConfig?.label || 'Select'}</InputLabel>
            <Select 
              value={value || ''} 
              onChange={(e) => onChange(e.target.value)}
              label={fieldConfig?.label || 'Select'}
            >
              {options.map((option: any) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      };

    default:
      return ({ value, onChange }: any) => (
        <TextField 
          size="small" 
          value={value || ''} 
          onChange={(e) => onChange(e.target.value)} 
        />
      );
  }
};
