import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Typography,
  Chip,
  Box
} from '@mui/material';
import type { Employee } from '../../types/employee.types';

interface DataTableProps {
  data: Employee[];
  total: number;
  filtered: number;
}

interface Column {
  key: keyof Employee | string;  // ✅ Support nested fields
  label: string;
  render?: (value: any, row: Employee) => React.ReactNode;  // ✅ ReactNode only
}

const columns: Column[] = [
  { key: 'name', label: 'Name' },
  { key: 'department', label: 'Department' },
  { key: 'role', label: 'Role' },
  { key: 'salary', label: 'Salary', render: (val) => `$${Number(val)?.toLocaleString() || '—'}` },
  { 
    key: 'isActive', 
    label: 'Status', 
    render: (val) => (
      <Chip 
        label={val ? 'Active' : 'Inactive'} 
        color={val ? 'success' : 'default'} 
        size="small" 
      />
    )
  },
  { 
    key: 'performanceRating', 
    label: 'Rating', 
    render: (val) => (
      <Box sx={{ color: Number(val) >= 4 ? 'success.main' : 'warning.main' }}>
        {Number(val) || 0}/5
      </Box>
    )
  },
  { 
    key: 'address.city',  // ✅ Nested field
    label: 'City',
    render: (val) => val || '—'
  },
  { 
    key: 'projects', 
    label: 'Projects',
    render: (val) => val || 0
  }
];

export const DataTable: React.FC<DataTableProps> = ({
  data,
  total,
  filtered
}) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedData = data.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const emptyRows = page > 0 ? Math.max(0, rowsPerPage - paginatedData.length) : 0;

  // ✅ SAFE FIELD ACCESS FUNCTION
  const getFieldValue = (row: Employee, fieldKey: string): any => {
    if (!fieldKey.includes('.')) {
      return row[fieldKey as keyof Employee];
    }
    return fieldKey.split('.').reduce((obj, key) => obj?.[key], row as any);
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <Box sx={{ p: 3, pb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6">Employee Records</Typography>
          <Typography variant="body2" color="text.secondary">
            {filtered} of {total} results
          </Typography>
        </Box>
      </Box>
      
      <TableContainer sx={{ maxHeight: 600 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.key as string} sx={{ fontWeight: 600 }}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row: Employee) => (
                <TableRow hover tabIndex={-1} key={row.id}>
                  {columns.map((column) => {
                    const value = getFieldValue(row, column.key as string);
                    
                    return (
                      <TableCell key={column.key as string} align="left">
                        {column.render 
                          ? column.render(value, row)
                          : String(value || '—')
                        }
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" sx={{ py: 8 }}>
                  <Typography variant="h6" color="text.secondary">
                    No results found
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Try adjusting your filters
                  </Typography>
                </TableCell>
              </TableRow>
            )}
            {emptyRows > 0 && (
              <TableRow>
                <TableCell colSpan={columns.length} sx={{ height: 53 * emptyRows }} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};
