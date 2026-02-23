import React, { useContext, useCallback } from 'react';
import { Box, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
import { FilterBuilderContext } from '../FilterBuilder/FilterBuilder';
import { FieldSelector } from '../FilterSelector/FilterSelector';
import { OperatorSelector } from '../OperatorSelector/OperatorSelector';
import { ValueInput } from '../ValueInput/ValueInput';
import type { FilterCondition } from '../../../types/filter.types';
import '../../../styles/DynamicFilter/FilterCondition.scss';

interface FilterConditionProps {
  filter: FilterCondition;
  onUpdate: (updated: Partial<FilterCondition>) => void;
  onRemove: () => void;
  className?: string;
}

export const FilterConditionItem: React.FC<FilterConditionProps> = ({
  filter,
  onUpdate,
  onRemove,
  className = ''
}) => {
  const { schema } = useContext(FilterBuilderContext);
  const fieldDef = schema.find(f => f.id === filter.field);
  
  const isActive = !!(filter.field && filter.operator && 
    (filter.value !== '' && filter.value !== null && filter.value !== undefined));

  const handleFieldChange = useCallback((field: string) => {
    schema.find(f => f.id === field);
    onUpdate({ 
      field, 
      operator: '', 
      value: '' 
    });
  }, [schema, onUpdate]);

  const handleOperatorChange = useCallback((operator: string) => {
    onUpdate({ 
      operator,
      value: '' 
    });
  }, [onUpdate]);

  const handleValueChange = useCallback((value: any) => {
    onUpdate({ value });
  }, [onUpdate]);

  const isOperatorDisabled = !filter.field;
  const isValueDisabled = !filter.field || !filter.operator;

  return (
    <Box className={`filter-condition-container ${isActive ? 'is-active' : ''} ${className}`}>
      <div className="filter-condition-content">
        <FieldSelector
          value={filter.field}
          onChange={handleFieldChange}
          className="field-selector"
        />
        
        <div className={`operator-wrapper ${isOperatorDisabled ? 'disabled' : ''}`}>
          <OperatorSelector
            fieldType={fieldDef?.type || 'text'}
            value={filter.operator}
            onChange={handleOperatorChange}
            className="operator-selector"
          />
        </div>
        
        <div className={`value-input-wrapper ${isValueDisabled ? 'disabled' : ''}`}>
          <ValueInput
            type={fieldDef?.type || 'text'}
            operator={filter.operator}
            value={filter.value}
            onChange={handleValueChange}
            className="value-input"
          />
        </div>
      </div>
      
      <IconButton 
        className="remove-button"
        onClick={onRemove}
        size="small"
        aria-label="Remove this filter condition"
      >
        <Close fontSize="small" />
      </IconButton>
    </Box>
  );
};
