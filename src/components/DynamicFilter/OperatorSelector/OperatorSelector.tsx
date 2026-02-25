import React, { useContext, useMemo, useEffect, useCallback } from 'react';
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
  value: propValue,
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

  const defaultOperator = useMemo(() => {
    if (availableOperators.length === 0) return '';
    if (availableOperators.some(op => op.value === propValue)) return propValue;
    return availableOperators[0].value;
  }, [availableOperators, propValue]);

  useEffect(() => {
    if (propValue !== defaultOperator && defaultOperator) {
      onChange(defaultOperator);
    }
  }, [defaultOperator, propValue, onChange]);

  const handleChange = useCallback((event: SelectChangeEvent<string>) => {
    onChange(event.target.value);
  }, [onChange]);

  if (availableOperators.length === 0) {
    return (
      <FormControl size="small" sx={{ minWidth: 140 }} className={className} disabled>
        <InputLabel>Operator</InputLabel>
        <Select value="" displayEmpty>
          <MenuItem value="" disabled>No operators</MenuItem>
        </Select>
      </FormControl>
    );
  }

  return (
    <FormControl size="small" sx={{ minWidth: 140 }} className={className}>
      <InputLabel id="operator-label">Operator</InputLabel>
      <Select
        labelId="operator-label"
        value={defaultOperator}
        onChange={handleChange}
        label="Operator"
      >
        {availableOperators.map((op) => (
          <MenuItem key={op.value} value={op.value}>
            {op.label || op.value.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
