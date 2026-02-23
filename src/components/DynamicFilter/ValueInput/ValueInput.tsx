import React, { JSX } from 'react';
import {
  Box,
  ToggleButtonGroup,
  ToggleButton,
  TextField
} from '@mui/material';
import type { FilterType } from '../../../types/filter.types';
import '../../../styles/DynamicFilter/ValueInput.scss';

interface ValueInputProps {
  type: FilterType;
  operator: string;
  value: any;
  onChange: (value: any) => void;
  className?: string;
}

interface DateRangeValue {
  start: string;
  end: string;
}

interface CurrencyRangeValue {
  min: number | '';
  max: number | '';
}

export const ValueInput: React.FC<ValueInputProps> = ({
  type,
  value,
  onChange,
  className = ''
}) => {

  const renderTextInput = () => (
    <TextField
      size="small"
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Enter text"
      className={`text-input ${className}`}
    />
  );

  const renderNumberInput = () => (
    <TextField
      type="number"
      size="small"
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder="0"
      inputProps={{ step: 'any' }}
      className={`number-input ${className}`}
    />
  );

  const renderDateRange = () => (
    <Box className={`date-range ${className}`} sx={{ display: 'flex', gap: 1 }}>
      <TextField
        size="small"
        type="date"
        value={(value as DateRangeValue)?.start || ''}
        onChange={(e) => onChange({
          start: e.target.value,
          end: (value as DateRangeValue)?.end || ''
        })}
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        size="small"
        type="date"
        value={(value as DateRangeValue)?.end || ''}
        onChange={(e) => onChange({
          start: (value as DateRangeValue)?.start || '',
          end: e.target.value
        })}
        InputLabelProps={{ shrink: true }}
      />
    </Box>
  );

  const renderCurrencyRange = () => (
    <Box className={`currency-range ${className}`} sx={{ display: 'flex', gap: 1 }}>
      <TextField
        type="number"
        size="small"
        value={(value as CurrencyRangeValue)?.min || ''}
        onChange={(e) => onChange({
          min: e.target.value === '' ? '' : Number(e.target.value),
          max: (value as CurrencyRangeValue)?.max || ''
        })}
        placeholder="Min"
        inputProps={{ step: '0.01' }}
      />
      <TextField
        type="number"
        size="small"
        value={(value as CurrencyRangeValue)?.max || ''}
        onChange={(e) => onChange({
          min: (value as CurrencyRangeValue)?.min || '',
          max: e.target.value === '' ? '' : Number(e.target.value)
        })}
        placeholder="Max"
        inputProps={{ step: '0.01' }}
      />
    </Box>
  );

  const renderSelect = () => (
    <TextField
      size="small"
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Select value"
      className={`select-input ${className}`}
    />
  );

  const renderBoolean = () => (
    <ToggleButtonGroup
      value={value ? 'true' : 'false'}
      exclusive
      onChange={(_, newValue) => onChange(newValue === 'true')}
      className={`boolean-toggle ${className}`}
    >
      <ToggleButton value="true">True</ToggleButton>
      <ToggleButton value="false">False</ToggleButton>
    </ToggleButtonGroup>
  );

  const renderers: Record<FilterType, JSX.Element> = {
    text: renderTextInput(),
    number: renderNumberInput(),
    date: renderDateRange(),
    amount: renderCurrencyRange(),
    select: renderSelect(),
    multiselect: renderSelect(),
    boolean: renderBoolean()
  };

  return <div className={`value-input ${type} ${className}`}>{renderers[type]}</div>;
};
