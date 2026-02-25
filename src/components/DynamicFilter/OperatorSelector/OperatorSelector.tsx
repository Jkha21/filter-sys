import React, { useContext, useMemo, useEffect } from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent
} from '@mui/material';
import { FilterBuilderContext } from '../FilterBuilder/FilterBuilder';
import type { FieldConfig } from '../../../types/filter.types';

interface OperatorSelectorProps {
  fieldId: string;
  value: string;
  onChange: (operator: string) => void;
  className?: string;
}

export const OperatorSelector: React.FC<OperatorSelectorProps> = ({
  fieldId,
  value,
  onChange,
  className = ''
}) => {
  const context = useContext(FilterBuilderContext);
  if (!context) return null;
  const { schema } = context;

  const availableOperators = useMemo(() => {
    const fieldConfig = (schema as FieldConfig[]).find(f => f.id === fieldId);
    return fieldConfig?.operators || [];
  }, [schema, fieldId]);

  useEffect(() => {
    const isValid = availableOperators.some(op => op.value === value);
    if (!isValid && availableOperators.length > 0) {
      onChange(availableOperators[0].value);
    }
  }, [availableOperators, value, onChange]);

  const handleChange = (event: SelectChangeEvent<string>) => {
    onChange(event.target.value);
  };

  return (
    <FormControl size="small" sx={{ minWidth: 140 }} className={className}>
      <InputLabel id="operator-label">Operator</InputLabel>
      <Select
        labelId="operator-label"  // ✅ Matches InputLabel id exactly
        value={value || ''}  // ✅ FIX: Ensure string value
        onChange={handleChange}
        label="Operator"
      >
        {availableOperators.map((op) => (
          <MenuItem key={op.value} value={op.value}>
            {op.label || op.value.replace(/([A-Z])/g, ' $1').toLowerCase()}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
