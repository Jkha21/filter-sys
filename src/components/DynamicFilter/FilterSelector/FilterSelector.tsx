import React, { useContext } from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent
} from '@mui/material';
import { FilterBuilderContext } from '../FilterBuilder/FilterBuilder';
import '../../../styles/DynamicFilter/FilterSelector.scss'

interface FieldSelectorProps {
  value: string;
  onChange: (field: string) => void;
  className?: string;
}

export const FieldSelector: React.FC<FieldSelectorProps> = ({
  value,
  onChange,
  className = ''
}) => {
  const { schema } = useContext(FilterBuilderContext);

  const handleChange = (event: SelectChangeEvent<string>) => {
    onChange(event.target.value);
  };

  return (
    <FormControl size="small" className={`field-selector ${className}`}>
      <InputLabel>Field</InputLabel>
      <Select
        value={value}
        onChange={handleChange}
        label="Field"
        displayEmpty
        notched
      >
        {schema.map((field) => (
          <MenuItem key={field.id} value={field.id}>
            {field.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
