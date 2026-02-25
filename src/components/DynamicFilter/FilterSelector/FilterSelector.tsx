import React, { useContext } from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent
} from '@mui/material';
import { FilterBuilderContext } from '../FilterBuilder/FilterBuilder';
import type { FieldConfig } from '../../../types/filter.types';

interface FieldSelectorProps {
  value: string;
  onChange: (field: string) => void;
  className?: string;
}

export const FieldSelector: React.FC<FieldSelectorProps> = ({
  value,
  onChange
}) => {
  const { schema } = useContext(FilterBuilderContext);

  const handleChange = (event: SelectChangeEvent<string>) => {
    onChange(event.target.value);
  };

  return (
    <FormControl size="small" sx={{ minWidth: 160 }}>
      <InputLabel id="field-select-label">Column</InputLabel>
      <Select
        labelId="field-select-label"
        value={value || ''}
        onChange={handleChange}
        label="Column"
      >
        <MenuItem value="" disabled>Select field...</MenuItem>
        {schema.map((field: FieldConfig) => (
          <MenuItem key={field.id} value={field.id}>
            {field.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
