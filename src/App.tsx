import React, { useEffect, useState } from 'react';  // ✅ FIXED
import { Container, Typography, Paper, Button, Box, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useFilters } from './hooks/useFilter.types';
import { useFilteredData } from './hooks/useFilteredData.types';
import type { Employee, FilterCondition } from './types';
import { fieldConfigs } from './config/field.config';

function App() {
  const { 
    filters, 
    validFilters, 
    addFilter, 
    updateFilter, 
    removeFilter, 
    clearFilters,
    hasFilters 
  } = useFilters();

  const { data: filteredEmployees, total, filtered } = useFilteredData(validFilters);

  const handleFieldChange = (id: string, value: string) => {
    updateFilter(id, 'field', value);
    const fieldConfig = fieldConfigs[value as keyof typeof fieldConfigs];
    if (fieldConfig) {
      updateFilter(id, 'operator', fieldConfig.operators[0].value);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Dynamic Filter System ✅
        </Typography>
        <Typography>
          Total: {total} | Filtered: {filtered} | Active: {validFilters.length}
        </Typography>
        
        <Box sx={{ mt: 3 }}>
          <Button onClick={addFilter} variant="contained" sx={{ mr: 2 }}>
            + Add Filter
          </Button>
          {hasFilters && (
            <Button onClick={clearFilters} variant="outlined">
              Clear All
            </Button>
          )}
        </Box>

        {filters.map((filter: FilterCondition) => (
          <Box key={filter.id} sx={{ mt: 2, p: 2, border: '1px solid #eee', borderRadius: 1 }}>
            <FormControl sx={{ mr: 2, minWidth: 120 }}>
              <InputLabel>Field</InputLabel>
              <Select 
                value={filter.field} 
                label="Field"
                onChange={(e) => handleFieldChange(filter.id, e.target.value as string)}
              >
                <MenuItem value="">Select Field</MenuItem>
                {Object.entries(fieldConfigs).map(([key, config]) => (
                  <MenuItem key={key} value={key}>{config.label}</MenuItem>
                ))}
              </Select>
            </FormControl>

            {filter.field && (
              <>
                <FormControl sx={{ mr: 2, minWidth: 120 }}>
                  <InputLabel>Operator</InputLabel>
                  <Select 
                    value={filter.operator}
                    label="Operator"
                    onChange={(e) => updateFilter(filter.id, 'operator', e.target.value)}
                  >
                    {fieldConfigs[filter.field as string]?.operators.map((op) => (
                      <MenuItem key={op.value} value={op.value}>{op.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                
                <input
                  value={filter.value || ''}
                  onChange={(e) => updateFilter(filter.id, 'value', e.target.value)}
                  placeholder="Value"
                  style={{ marginRight: 10, padding: 8, border: '1px solid #ccc', borderRadius: 4 }}
                />
              </>
            )}
            
            <Button 
              onClick={() => removeFilter(filter.id)} 
              size="small"
              variant="outlined"
              color="error"
              sx={{ mr: 1 }}
            >
              Remove
            </Button>
            
            <span style={{ color: filter.isValid ? 'green' : 'red' }}>
              {filter.isValid ? 'Valid' : 'Invalid'}
            </span>
          </Box>
        ))}
      </Paper>

      <Paper sx={{ p: 4 }}>
        <Typography variant="h6">Results: {filtered}</Typography>
        <pre style={{ fontSize: 12, maxHeight: 300, overflow: 'auto' }}>
          {JSON.stringify(filteredEmployees.slice(0, 3), null, 2)}
        </pre>
      </Paper>
    </Container>
  );
}

export default App;
