import React, { useContext } from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Typography
} from '@mui/material';
import { FilterBuilderContext } from '../FilterBuilder/FilterBuilder';

interface FieldSelectorProps {
  value: string;
  onChange: (field: string) => void;
  className?: string;
}

export const FieldSelector: React.FC<FieldSelectorProps> = ({
  value,
  onChange
}) => {
  const context = useContext(FilterBuilderContext);
  
  // 🔥 DEBUG
  console.log('🔍 FieldSelector:', {
    value,
    hasContext: !!context,
    schemaLength: context?.schema?.length,
    firstSchema: context?.schema?.[0]
  });

  if (!context?.schema?.length) {
    return (
      <Typography color="error" variant="caption">
        No schema (check parent component)
      </Typography>
    );
  }

  const { schema } = context;
  const handleChange = (event: SelectChangeEvent<string>) => {
    console.log('🔍 Field changed to:', event.target.value);
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
        {schema.map((field: any) => (
          <MenuItem key={field.id} value={field.id}>
            {field.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
