import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  TextField,
  IconButton,
  Checkbox,
  Box,
  Tooltip,
  Typography,
  Select,
  MenuItem,
  FormControl
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import FilterListIcon from '@mui/icons-material/FilterList';

/**
 * Editable data table component with filtering, pagination and inline editing
 */
const EditableTable = ({
  data = [],
  columns = [],
  editable = true,
  onRowAdd,
  onRowUpdate,
  onRowDelete,
  pageSizeOptions = [10, 25, 50, 100],
  defaultPageSize = 10,
  showSelection = false,
  onSelectionChange,
  filters = {},
  onFilterChange,
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(defaultPageSize);
  const [editingRow, setEditingRow] = useState(null);
  const [editRowData, setEditRowData] = useState({});
  const [selectedRows, setSelectedRows] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);
  
  // Reset page when data changes
  useEffect(() => {
    setPage(0);
  }, [data.length]);
  
  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  // Start editing a row
  const handleEditClick = (row) => {
    setEditingRow(row.id);
    setEditRowData({ ...row });
  };
  
  // Cancel editing
  const handleCancelEdit = () => {
    setEditingRow(null);
    setEditRowData({});
  };
  
  // Save edited row
  const handleSaveEdit = () => {
    if (onRowUpdate) {
      onRowUpdate(editRowData)
        .then(() => {
          setEditingRow(null);
          setEditRowData({});
        })
        .catch((error) => {
          console.error('Error updating row:', error);
        });
    } else {
      setEditingRow(null);
      setEditRowData({});
    }
  };
  
  // Handle adding a new row
  const handleAddRow = () => {
    if (onRowAdd) {
      const newRow = columns.reduce((acc, column) => {
        acc[column.field] = column.defaultValue || '';
        return acc;
      }, {});
      
      onRowAdd(newRow)
        .then((addedRow) => {
          if (addedRow && addedRow.id) {
            setEditingRow(addedRow.id);
            setEditRowData({ ...addedRow });
          }
        })
        .catch((error) => {
          console.error('Error adding row:', error);
        });
    }
  };
  
  // Handle deleting a row
  const handleDeleteRow = (id) => {
    if (onRowDelete) {
      onRowDelete(id)
        .catch((error) => {
          console.error('Error deleting row:', error);
        });
    }
  };
  
  // Handle field changes during editing
  const handleFieldChange = (field, value) => {
    setEditRowData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Handle row selection
  const handleRowSelect = (id) => {
    const newSelectedRows = selectedRows.includes(id)
      ? selectedRows.filter(rowId => rowId !== id)
      : [...selectedRows, id];
      
    setSelectedRows(newSelectedRows);
    
    if (onSelectionChange) {
      onSelectionChange(newSelectedRows);
    }
  };
  
  // Handle select all rows
  const handleSelectAll = () => {
    if (selectedRows.length === data.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(data.map(row => row.id));
    }
    
    if (onSelectionChange) {
      onSelectionChange(selectedRows.length === data.length ? [] : data.map(row => row.id));
    }
  };
  
  // Handle filter toggle
  const handleToggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  // Handle filter change
  const handleFilterChange = (field, value) => {
    const newFilters = {
      ...localFilters,
      [field]: value
    };
    
    setLocalFilters(newFilters);
    
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };
  
  // Apply filters to data
  const filteredData = data.filter(row => {
    return Object.entries(localFilters).every(([field, value]) => {
      if (!value || value === '') return true;
      
      const fieldValue = String(row[field] || '').toLowerCase();
      return fieldValue.includes(String(value).toLowerCase());
    });
  });
  
  // Paginate data
  const paginatedData = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  
  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <Box sx={{ p: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {`${filteredData.length} records`}
        </Typography>
        
        <Box>
          <Tooltip title="Toggle Filters">
            <IconButton onClick={handleToggleFilters}>
              <FilterListIcon color={showFilters ? 'primary' : 'inherit'} />
            </IconButton>
          </Tooltip>
          
          {editable && (
            <Tooltip title="Add New Row">
              <IconButton onClick={handleAddRow}>
                <AddIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>
      
      <TableContainer sx={{ maxHeight: 650 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              {showSelection && (
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={
                      selectedRows.length > 0 && selectedRows.length < data.length
                    }
                    checked={data.length > 0 && selectedRows.length === data.length}
                    onChange={handleSelectAll}
                  />
                </TableCell>
              )}
              
              {columns.map((column) => (
                <TableCell 
                  key={column.field}
                  align={column.numeric ? 'right' : 'left'}
                  style={{ minWidth: column.minWidth, width: column.width }}
                >
                  {column.headerName || column.field}
                </TableCell>
              ))}
              
              {editable && <TableCell align="center">Actions</TableCell>}
            </TableRow>
            
            {showFilters && (
              <TableRow>
                {showSelection && <TableCell />}
                
                {columns.map((column) => (
                  <TableCell key={`filter-${column.field}`}>
                    <TextField
                      size="small"
                      placeholder={`Filter ${column.headerName || column.field}`}
                      value={localFilters[column.field] || ''}
                      onChange={(e) => handleFilterChange(column.field, e.target.value)}
                      variant="standard"
                      fullWidth
                    />
                  </TableCell>
                ))}
                
                {editable && <TableCell />}
              </TableRow>
            )}
          </TableHead>
          
          <TableBody>
            {paginatedData.map((row) => {
              const isRowEditing = editingRow === row.id;
              
              return (
                <TableRow 
                  hover 
                  key={row.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  {showSelection && (
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedRows.includes(row.id)}
                        onChange={() => handleRowSelect(row.id)}
                      />
                    </TableCell>
                  )}
                  
                  {columns.map((column) => {
                    const value = row[column.field];
                    const editValue = editRowData[column.field];
                    
                    return (
                      <TableCell key={`${row.id}-${column.field}`}>
                        {isRowEditing ? (
                          <>
                            {column.type === 'select' ? (
                              <FormControl fullWidth size="small">
                                <Select
                                  value={editValue || ''}
                                  onChange={(e) => handleFieldChange(column.field, e.target.value)}
                                >
                                  {column.options.map((option) => (
                                    <MenuItem 
                                      key={option.value} 
                                      value={option.value}
                                    >
                                      {option.label}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            ) : (
                              <TextField
                                fullWidth
                                size="small"
                                value={editValue || ''}
                                onChange={(e) => handleFieldChange(column.field, e.target.value)}
                                type={column.type || 'text'}
                              />
                            )}
                          </>
                        ) : (
                          <>
                            {column.renderCell 
                              ? column.renderCell({ value, row }) 
                              : value
                            }
                          </>
                        )}
                      </TableCell>
                    );
                  })}
                  
                  {editable && (
                    <TableCell align="center">
                      {isRowEditing ? (
                        <>
                          <IconButton 
                            size="small" 
                            onClick={handleSaveEdit}
                            color="primary"
                          >
                            <SaveIcon />
                          </IconButton>
                          <IconButton 
                            size="small" 
                            onClick={handleCancelEdit}
                            color="default"
                          >
                            <CancelIcon />
                          </IconButton>
                        </>
                      ) : (
                        <>
                          <IconButton 
                            size="small" 
                            onClick={() => handleEditClick(row)}
                            color="primary"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton 
                            size="small" 
                            onClick={() => handleDeleteRow(row.id)}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      
      <TablePagination
        rowsPerPageOptions={pageSizeOptions}
        component="div"
        count={filteredData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

EditableTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      field: PropTypes.string.isRequired,
      headerName: PropTypes.string,
      type: PropTypes.string,
      width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      minWidth: PropTypes.number,
      numeric: PropTypes.bool,
      renderCell: PropTypes.func,
      options: PropTypes.arrayOf(
        PropTypes.shape({
          value: PropTypes.any,
          label: PropTypes.string
        })
      ),
      defaultValue: PropTypes.any
    })
  ),
  editable: PropTypes.bool,
  onRowAdd: PropTypes.func,
  onRowUpdate: PropTypes.func,
  onRowDelete: PropTypes.func,
  pageSizeOptions: PropTypes.arrayOf(PropTypes.number),
  defaultPageSize: PropTypes.number,
  showSelection: PropTypes.bool,
  onSelectionChange: PropTypes.func,
  filters: PropTypes.object,
  onFilterChange: PropTypes.func
};

export default EditableTable; 