import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Chip,
  Tooltip
} from '@mui/material';
import {
  Database,
  FilterX,
  Download,
  RefreshCw
} from 'lucide-react';

interface HeaderProps {
  filteredCount: number;
  totalCount: number;
  onClearFilters: () => void;
  onExportData: () => void;
  onRefreshData: () => void;
}

const Header: React.FC<HeaderProps> = ({
  filteredCount,
  totalCount,
  onClearFilters,
  onExportData,
  onRefreshData
}) => {
  const filterText = filteredCount === totalCount 
    ? 'All Records' 
    : `${filteredCount} of ${totalCount}`;

  return (
    <AppBar position="static" elevation={1} color="primary">
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Logo & Title */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Database size={28} color="white" />
          <Box>
            <Typography variant="h6" component="h1" color="white" fontWeight={600}>
              Employee Dashboard
            </Typography>
            <Typography variant="caption" color="rgba(255,255,255,0.7)">
              Dynamic Filter System
            </Typography>
          </Box>
        </Box>

        {/* Filter Status & Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Filter Chip */}
          <Chip
            label={filterText}
            size="small"
            color={filteredCount === totalCount ? 'default' : 'secondary'}
            variant="outlined"
          />

          {/* Simple Action Buttons */}
          <Tooltip title="Clear Filters">
            <IconButton 
              onClick={onClearFilters} 
              disabled={filteredCount === totalCount}
              sx={{ color: 'white' }}
              size="small"
            >
              <FilterX size={20} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Refresh">
            <IconButton onClick={onRefreshData} sx={{ color: 'white' }} size="small">
              <RefreshCw size={20} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Export CSV">
            <IconButton onClick={onExportData} sx={{ color: 'white' }} size="small">
              <Download size={20} />
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
