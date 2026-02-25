import React from 'react';
import { 
  Box, 
  TextField, 
  Autocomplete, 
  Checkbox, 
  ToggleButtonGroup, 
  ToggleButton, 
  Typography 
} from '@mui/material';
import { CheckBox as CheckBoxIcon, CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon } from '@mui/icons-material';
import type { FilterType } from '../../../types/filter.types';

interface ValueInputProps {
  type: FilterType;
  operator: string;
  value: any;
  onChange: (v: any) => void;
  options?: { label: string; value: any }[];
}

export const ValueInput: React.FC<ValueInputProps> = ({ 
  type, 
  operator, 
  value, 
  onChange, 
  options = [] 
}) => {
  const isRange = operator === 'between';

  // Optimized Switch-Case to prevent redundant component initialization
  switch (type) {
    case 'text':
      return (
        <TextField 
          size="small" 
          fullWidth 
          value={value || ''} 
          onChange={(e) => onChange(e.target.value)} 
          placeholder="Enter text..." 
        />
      );
    
    case 'number':
    case 'amount':
    case 'date':
      if (isRange) {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TextField 
              size="small" 
              type={type === 'date' ? 'date' : 'number'} 
              value={value?.start || ''} 
              onChange={(e) => onChange({ ...value, start: e.target.value })} 
              InputLabelProps={{ shrink: true }}
            />
            <Typography variant="caption" color="text.secondary">to</Typography>
            <TextField 
              size="small" 
              type={type === 'date' ? 'date' : 'number'} 
              value={value?.end || ''} 
              onChange={(e) => onChange({ ...value, end: e.target.value })} 
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        );
      }
      return (
        <TextField 
          size="small" 
          fullWidth 
          type={type === 'number' ? 'number' : 'text'} 
          value={value || ''} 
          onChange={(e) => onChange(e.target.value)} 
          placeholder="Enter value..."
        />
      );

    case 'multiselect':
      return (
        <Autocomplete 
          multiple 
          size="small" 
          options={options} 
          disableCloseOnSelect 
          getOptionLabel={(o) => o.label}
          value={options.filter(o => value?.includes(o.value))}
          onChange={(_, newValue) => onChange(newValue.map(v => v.value))}
          renderInput={(params) => <TextField {...params} placeholder="Select options..." />}
          renderOption={(props, option, { selected }) => (
            <li {...props}>
              <Checkbox 
                icon={<CheckBoxOutlineBlankIcon fontSize="small" />} 
                checkedIcon={<CheckBoxIcon fontSize="small" />} 
                checked={selected} 
              />
              {option.label}
            </li>
          )}
          sx={{ minWidth: 220 }}
        />
      );

    case 'boolean':
      return (
        <ToggleButtonGroup 
          size="small" 
          value={value === true ? 'true' : value === false ? 'false' : null} 
          exclusive 
          onChange={(_, val) => onChange(val === 'true')} 
          fullWidth
        >
          <ToggleButton value="true" sx={{ textTransform: 'none' }}>True</ToggleButton>
          <ToggleButton value="false" sx={{ textTransform: 'none' }}>False</ToggleButton>
        </ToggleButtonGroup>
      );
      
    default:
      return null;
  }
};