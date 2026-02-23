// src/components/DataTable/DataTable.tsx
import React, { useState } from 'react';
import '../../styles/DataTable/DataTable.scss';
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
import type { Employee } from '../../types';

interface DataTableProps {
  data: Employee[];
  total: number;
  filtered: number;
}

interface Column {
  key: keyof Employee | string;
  label: string;
  render?: (value: any, row: Employee) => React.ReactNode;
}

const columns: Column[] = [
  { key: 'name', label: 'Name' },
  { key: 'department', label: 'Department' },
  { key: 'role', label: 'Role' }, 
  { 
    key: 'salary', 
    label: 'Salary', 
    render: (val) => `$${Number(val)?.toLocaleString() || '—'}` 
  },
  { 
    key: 'isActive', 
    label: 'Status', 
    render: (val) => (
      <Chip 
        className={`data-table-chip ${val ? 'data-table-chip--active' : ''}`}
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
      <Box className={`data-table-cell--rating ${Number(val) < 4 ? 'data-table-rating-low' : ''}`} sx={{ 
        color: Number(val) >= 4 ? 'success.main' : 'warning.main',
        fontWeight: 600,
        padding: '4px 12px',
        borderRadius: '16px',
        minWidth: '56px',
        textAlign: 'center' as const
      }}>
        {Number(val) || 0}/5
      </Box>
    )
  },
  { 
    key: 'address.city',
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
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (_ : unknown, newPage: number) => {
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

  const getFieldValue = (row: Employee, fieldKey: string): any => {
    if (!fieldKey.includes('.')) {
      return row[fieldKey as keyof Employee];
    }
    return fieldKey.split('.').reduce((obj, key) => obj?.[key], row as any);
  };

  return (
    <Paper className="data-table-paper" sx={{ width: '100%', overflow: 'hidden' }}>
      {/* Pure Table Header - No Filter Controls */}
      <Box className="data-table-header">
        <Box className="data-table-header-content">
          <Typography className="data-table-title" variant="h6">
            Employee Records
          </Typography>
          <Typography className="data-table-stats" variant="body2" color="text.secondary">
            {filtered} of {total} results
          </Typography>
        </Box>
      </Box>
      
      <TableContainer className="data-table-table-container" sx={{ maxHeight: 600 }}>
        <Table className="data-table-table" stickyHeader>
          <TableHead>
            <TableRow className="data-table-header-row">
              {columns.map((column) => (
                <TableCell 
                  key={column.key as string} 
                  className="data-table-head-cell"
                  sx={{ fontWeight: 700 }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row: Employee) => (
                <TableRow 
                  className="data-table-body-row"
                  hover 
                  tabIndex={-1} 
                  key={row.id}
                >
                  {columns.map((column) => {
                    const value = getFieldValue(row, column.key as string);
                    return (
                      <TableCell 
                        key={column.key as string} 
                        className="data-table-body-cell"
                        align="left"
                      >
                        <div className="data-table-cell">
                          {column.render 
                            ? column.render(value, row)
                            : <span className="data-table-cell-text">{String(value || '—')}</span>
                          }
                        </div>
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" className="data-table-no-results">
                  <Typography variant="h6" color="text.secondary">
                    No results found
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Try adjusting your filters above
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
      
      <div className="data-table-pagination">
        <TablePagination
          className="data-table-pagination-inner"
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>
    </Paper>
  );
};
