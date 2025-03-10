import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { 
  Box, 
  Button, 
  IconButton, 
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl
} from '@mui/material';
import { 
  DataGrid, 
  GridToolbarContainer, 
  GridToolbarExport, 
  GridToolbarFilterButton 
} from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import TabHeader from '../../shared/TabHeader';
import SplitView from '../../shared/SplitView';
import RelatedItemsPanel from '../../shared/RelatedItemsPanel';
import { useWorkspace } from '../../../contexts/WorkspaceContext';

/**
 * Custom toolbar for the DataGrid
 */
const CustomToolbar = ({ isEditing, onAddRow, onSave, onToggleEdit, isEditable }) => {
  return (
    <GridToolbarContainer>
      <GridToolbarFilterButton />
      <GridToolbarExport />
      
      {isEditable && (
        <>
          <Tooltip title={isEditing ? "View Mode" : "Edit Mode"}>
            <Button
              startIcon={isEditing ? <VisibilityIcon /> : <EditIcon />}
              onClick={onToggleEdit}
            >
              {isEditing ? "View" : "Edit"}
            </Button>
          </Tooltip>
          
          {isEditing && (
            <>
              <Button
                startIcon={<SaveIcon />}
                onClick={onSave}
              >
                Save
              </Button>
              <Button
                startIcon={<AddIcon />}
                onClick={onAddRow}
              >
                Add Row
              </Button>
            </>
          )}
        </>
      )}
    </GridToolbarContainer>
  );
};

/**
 * Generic table viewer for tabular data artifacts
 */
const TableViewer = ({
  artifact,
  visualization,
  visualizations = [],
  isEditable = true,
  onContentUpdate,
  onVisualizationChange,
  layoutMode = 'single'
}) => {
  const { navigateToArtifact } = useWorkspace();
  const [isEditing, setIsEditing] = useState(false);
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newRowData, setNewRowData] = useState({});
  
  // Parse artifact content and initialize table data
  useEffect(() => {
    if (artifact) {
      let parsedRows = [];
      let parsedColumns = [];
      
      // Handle different content formats
      if (typeof artifact.content === 'string') {
        try {
          // Try to parse as JSON
          const parsed = JSON.parse(artifact.content);
          if (parsed.rows && Array.isArray(parsed.rows)) {
            parsedRows = parsed.rows;
          }
          if (parsed.columns && Array.isArray(parsed.columns)) {
            parsedColumns = parsed.columns;
          }
        } catch (e) {
          console.warn('Failed to parse artifact content as JSON:', e);
        }
      } else if (artifact.content) {
        // Already parsed object
        parsedRows = artifact.content.rows || [];
        parsedColumns = artifact.content.columns || [];
      }
      
      // Ensure all rows have an id
      parsedRows = parsedRows.map((row, index) => ({
        id: row.id || `row-${index}`,
        ...row
      }));
      
      // Prepare columns for DataGrid
      const gridColumns = parsedColumns.map(col => ({
        field: col.field,
        headerName: col.headerName || col.field,
        width: col.width || 150,
        editable: isEditing,
        ...col
      }));
      
      setRows(parsedRows);
      setColumns(gridColumns);
      
      // Initialize new row data structure
      const initialRowData = {};
      parsedColumns.forEach(col => {
        initialRowData[col.field] = '';
      });
      setNewRowData(initialRowData);
    }
  }, [artifact]);
  
  // Toggle edit mode
  const toggleEditMode = () => {
    setIsEditing(!isEditing);
    
    // Update columns editable property
    setColumns(prevColumns => 
      prevColumns.map(col => ({
        ...col,
        editable: !isEditing
      }))
    );
  };
  
  // Handle cell edit
  const handleCellEdit = (updatedRow) => {
    setRows(prevRows => 
      prevRows.map(row => 
        row.id === updatedRow.id ? updatedRow : row
      )
    );
    return updatedRow;
  };
  
  // Open add row dialog
  const handleAddRow = () => {
    setAddDialogOpen(true);
  };
  
  // Handle input change in add row dialog
  const handleInputChange = (field, value) => {
    setNewRowData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Add new row
  const handleAddRowConfirm = () => {
    const newRow = {
      id: `row-${Date.now()}`,
      ...newRowData
    };
    
    setRows(prev => [...prev, newRow]);
    
    // Reset form
    const resetData = {};
    columns.forEach(col => {
      resetData[col.field] = '';
    });
    setNewRowData(resetData);
    
    setAddDialogOpen(false);
  };
  
  // Delete row
  const handleDeleteRow = (id) => {
    setRows(prev => prev.filter(row => row.id !== id));
  };
  
  // Save changes
  const handleSave = () => {
    // Create updated artifact content
    const updatedContent = {
      ...artifact.content,
      rows: rows,
      columns: columns.map(({ field, headerName, width }) => ({ field, headerName, width }))
    };
    
    // Call onContentUpdate with the new content
    if (onContentUpdate) {
      onContentUpdate(updatedContent);
    }
    
    // Exit edit mode
    setIsEditing(false);
  };
  
  // Add delete action column when in edit mode
  const columnsWithActions = isEditing ? [
    ...columns,
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <IconButton 
          onClick={() => handleDeleteRow(params.row.id)}
          size="small"
          color="error"
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      )
    }
  ] : columns;
  
  // Prepare secondary content (related items)
  const secondaryContent = artifact?.references?.length > 0 && (
    <RelatedItemsPanel
      references={artifact.references}
      onArtifactClick={navigateToArtifact}
    />
  );
  
  // Custom toolbar with props
  const CustomToolbarWithProps = () => (
    <CustomToolbar
      isEditing={isEditing}
      onAddRow={handleAddRow}
      onSave={handleSave}
      onToggleEdit={toggleEditMode}
      isEditable={isEditable}
    />
  );
  
  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <TabHeader
        title={artifact?.title || 'Untitled Table'}
        status={artifact?.status}
        lastModified={artifact?.updated_at}
      />
      
      <SplitView
        direction={layoutMode === 'horizontal' ? 'horizontal' : 'vertical'}
        primaryContent={
          <Box sx={{ height: '100%', width: '100%' }}>
            <DataGrid
              rows={rows}
              columns={columnsWithActions}
              pageSize={10}
              rowsPerPageOptions={[10, 25, 50]}
              disableSelectionOnClick
              components={{
                Toolbar: CustomToolbarWithProps
              }}
              experimentalFeatures={{ newEditingApi: true }}
              editMode="cell"
              processRowUpdate={handleCellEdit}
              isCellEditable={(params) => isEditing && params.colDef.editable}
              sx={{
                '& .MuiDataGrid-cell': {
                  outline: 'none !important'
                }
              }}
            />
          </Box>
        }
        secondaryContent={secondaryContent}
        showSecondary={layoutMode !== 'single' && !!secondaryContent}
      />
      
      {/* Add Row Dialog */}
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)}>
        <DialogTitle>Add New Row</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1, minWidth: '400px' }}>
            {columns
              .filter(col => col.field !== 'actions')
              .map(col => {
                if (col.type === 'select' && col.options) {
                  return (
                    <FormControl key={col.field} fullWidth>
                      <InputLabel>{col.headerName}</InputLabel>
                      <Select
                        value={newRowData[col.field] || ''}
                        onChange={(e) => handleInputChange(col.field, e.target.value)}
                        label={col.headerName}
                      >
                        {col.options.map(option => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  );
                }
                
                return (
                  <TextField
                    key={col.field}
                    label={col.headerName}
                    value={newRowData[col.field] || ''}
                    onChange={(e) => handleInputChange(col.field, e.target.value)}
                    fullWidth
                    multiline={col.multiline}
                    rows={col.multiline ? 3 : 1}
                  />
                );
              })}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAddRowConfirm} variant="contained">Add</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

TableViewer.propTypes = {
  artifact: PropTypes.shape({
    id: PropTypes.string,
    document_id: PropTypes.string.isRequired,
    art_type: PropTypes.string.isRequired,
    title: PropTypes.string,
    content: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    references: PropTypes.array,
    version: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    status: PropTypes.string,
    updated_at: PropTypes.string
  }).isRequired,
  visualization: PropTypes.object,
  visualizations: PropTypes.array,
  isEditable: PropTypes.bool,
  onContentUpdate: PropTypes.func,
  onVisualizationChange: PropTypes.func,
  layoutMode: PropTypes.string
};

export default TableViewer; 