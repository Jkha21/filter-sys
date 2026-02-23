import React from 'react';
import { Paper } from '@mui/material';
import Header from './components/Header';
import { FilterBuilder } from './components/DynamicFilter/FilterBuilder/FilterBuilder';
import { DataTable } from './components/DataTable/DataTable';
import type { FieldSchema } from './types/filter.types';
import type { Employee } from './types/employee.types';
import { fieldConfigs } from './config/field.config';

function App() {
  const fieldSchema: FieldSchema[] = Array.isArray(fieldConfigs) 
    ? fieldConfigs.map((config) => ({
        id: String(config.key),
        label: config.label,
        type: config.type
      }))
    : [];

  const [employees ] = React.useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = React.useState<Employee[]>([]);
  const [totalEmployees, setTotalEmployees] = React.useState(0);

  const handleFilteredDataChange = (filteredData: Employee[]) => {
    setFilteredEmployees(filteredData);
  };

  React.useEffect(() => {
    setTotalEmployees(1000);
  }, []);

  const handleClearFilters = () => {
    setFilteredEmployees(employees);
  };

  const handleExportData = () => {
    const headers = [
      'ID', 'Name', 'Email', 'Department', 'Role', 'Salary', 
      'Join Date', 'Active', 'Skills', 'City', 'Projects', 'Rating'
    ];
    const csvContent = [
      headers.join(','),
      ...filteredEmployees.map(emp => [
        emp.id, 
        `"${emp.name}"`, 
        `"${emp.email}"`, 
        emp.department, 
        emp.role, 
        emp.salary, 
        emp.joinDate, 
        emp.isActive ? 'Yes' : 'No',
        Array.isArray(emp.skills) ? `"${emp.skills.join('; ')}"` : '',
        emp.address?.city || '', 
        emp.projects, 
        emp.performanceRating
      ].join(','))
    ].join('\n');
  
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `employees_${filteredEmployees.length === totalEmployees ? 'all' : 'filtered'}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRefreshData = () => {
    window.location.reload();
  };

  return (
    <>
      <Header
        filteredCount={filteredEmployees.length}
        totalCount={totalEmployees}
        onClearFilters={handleClearFilters}
        onExportData={handleExportData}
        onRefreshData={handleRefreshData}
      />

      <Paper 
        elevation={3}
        sx={{ 
          mx: 2, 
          mt: 4, 
          mb: 2,
          p: 3,
          borderRadius: 2
        }}
      >
        <FilterBuilder
          data={employees}
          schema={fieldSchema}
          onFilteredDataChange={handleFilteredDataChange}
        />
      </Paper>

      <div style={{ margin: '0 16px' }}>
        <DataTable 
          data={filteredEmployees}
          total={totalEmployees}
          filtered={filteredEmployees.length}
        />
      </div>
    </>
  );
}

export default App;
