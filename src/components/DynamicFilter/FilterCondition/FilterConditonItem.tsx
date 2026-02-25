import React, { useContext } from 'react';
import { Box, IconButton, Stack, Typography, Tooltip } from '@mui/material';
// Requirement: Use Lucide React
import { Trash2 } from 'lucide-react'; 
import { FilterBuilderContext } from '../FilterBuilder/FilterBuilder';
import { FieldSelector } from '../FilterSelector/FilterSelector';
import { OperatorSelector } from '../OperatorSelector/OperatorSelector';
import { ValueInput } from '../ValueInput/ValueInput';
import { validateFilter, getDefaultValue } from '../FilterUtils/FilterUtils';
import type { FilterCondition, FieldConfig } from '../../../types/filter.types';

interface FilterConditionItemProps {
  filter: FilterCondition;
  index: number;
}

export const FilterConditionItem: React.FC<FilterConditionItemProps> = ({
  filter,
  index
}) => {
  const context = useContext(FilterBuilderContext);
  if (!context) return null;
  
  const { updateFilter, removeFilter, schema } = context;
  const fieldDef = (schema as FieldConfig[]).find(f => f.id === filter.field);

  const handleFieldChange = (field: string) => {
    const newFieldDef = (schema as FieldConfig[]).find(f => f.id === field);
    // FUNCTIONALITY FIX: Reset dependent state to prevent invalid filter combinations
    updateFilter(filter.id, { 
      field, 
      operator: '', 
      value: '', 
      type: newFieldDef?.type || 'text',
      isValid: false 
    });
  };

  const handleOperatorChange = (operator: string) => {
    const defaultValue = getDefaultValue(operator, fieldDef?.type);
    updateFilter(filter.id, { 
      operator,
      value: defaultValue,
      isValid: validateFilter({ ...filter, operator, value: defaultValue }, fieldDef?.type || 'text')
    });
  };

  const handleValueChange = (value: any) => {
    updateFilter(filter.id, { 
      value, 
      isValid: validateFilter({ ...filter, value }, fieldDef?.type || 'text') 
    });
  };

  return (
    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1.5 }}>
      {/* Requirement: Multiple filter logic visibility */}
      <Box sx={{ minWidth: 50 }}>
        <Typography variant="caption" fontWeight="700" color="primary.main" sx={{ textTransform: 'uppercase' }}>
          {index === 0 ? 'Where' : 'And'}
        </Typography>
      </Box>

      <Box 
        sx={{ 
          display: 'flex', 
          flex: 1, 
          gap: 1.5, 
          p: 1, 
          borderRadius: 1, 
          border: '1px solid',
          borderColor: filter.isValid ? 'primary.light' : 'divider',
          bgcolor: 'background.paper',
          alignItems: 'center'
        }}
      >
        <FieldSelector
          value={filter.field}
          onChange={handleFieldChange}
        />
        
        <OperatorSelector
          fieldId={filter.field}
          value={filter.operator}
          onChange={handleOperatorChange}
        />
        
        <Box sx={{ flex: 1 }}>
          <ValueInput
            type={fieldDef?.type || 'text'}
            operator={filter.operator}
            value={filter.value}
            options={fieldDef?.options}
            onChange={handleValueChange}
          />
        </Box>

        <Tooltip title="Remove condition">
          <IconButton 
            onClick={() => removeFilter(filter.id)}
            size="small"
            color="error"
            sx={{ opacity: 0.7, '&:hover': { opacity: 1 } }}
          >
            <Trash2 size={18} />
          </IconButton>
        </Tooltip>
      </Box>
    </Stack>
  );
};