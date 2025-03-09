import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, IconButton } from '@mui/material';
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
import TabHeader from '../shared/TabHeader';
import ViewSelector from '../shared/ViewSelector';
import SplitView from '../shared/SplitView';
import RelatedItemsPanel from '../shared/RelatedItemsPanel';
import { useWorkspace } from '../../contexts/WorkspaceContext';

/**
 * Custom toolbar for the DataGrid
 */
const CustomToolbar = ({ isEditing, onAddRow, onSave, isEditable }) => {
  return (
    <GridToolbarContainer>
      <GridToolbarFilterButton />
      <GridToolbarExport />
      
      {isEditable && (
        <>
          {isEditing ? (
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
          ) : (
            <Button
              startIcon={<EditIcon />}
              onClick={() => {/* This will be handled by the isEditing state in the parent */}}
            >
              Edit
            </Button>
          )}
        </>
      )}
    </GridToolbarContainer>
  );
};

/**
 * Viewer for table-based artifacts
 */
const TableViewer = ({
  artifact,
  activeVisualization,
  visualizations,
  isEditable = false,
  onContentUpdate,
  onVisualizationChange,
  layoutMode = 'single'
}) => {
  const { navigateToArtifact } = useWorkspace();
  const [isEditing, setIsEditing] = useState(false);
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [nextId, setNextId] = useState(1);

  // Parse artifact content to rows and columns
  useEffect(() => {
    if (artifact?.content) {
      try {
        let tableData;
        if (typeof artifact.content === 'string') {
          try {
            tableData = JSON.parse(artifact.content);
          } catch (e) {
            // If not valid JSON, create a basic structure
            tableData = { rows: [], columns: [] };
          }
        } else {
          tableData = artifact.content;
        }
        
        // Handle the table data
        if (tableData.rows && Array.isArray(tableData.rows)) {
          setRows(tableData.rows.map(row => ({
            ...row,
            id: row.id || `row-${nextId + Math.random()}`
          })));
          
          // Find the highest ID to set nextId
          const maxId = tableData.rows.reduce((max, row) => {
            const id = parseInt(row.id?.toString().replace('row-', '') || '0', 10);
            return isNaN(id) ? max : Math.max(max, id);
          }, 0);
          setNextId(maxId + 1);
        } else {
          setRows([]);
        }
        
        if (tableData.columns && Array.isArray(tableData.columns)) {
          setColumns(tableData.columns);
        } else {
          // Default columns
          setColumns([
            { field: 'id', headerName: 'ID', width: 70 },
            { field: 'name', headerName: 'Name', width: 200, editable: true },
            { field: 'description', headerName: 'Description', width: 400, editable: true }
          ]);
        }
      } catch (error) {
        console.error('Error parsing table data:', error);
        setRows([]);
        setColumns([
          { field: 'id', headerName: 'ID', width: 70 },
          { field: 'name', headerName: 'Name', width: 200, editable: true },
          { field: 'description', headerName: 'Description', width: 400, editable: true }
        ]);
      }
    } else {
      // Default empty table
      setRows([]);
      setColumns([
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'name', headerName: 'Name', width: 200, editable: true },
        { field: 'description', headerName: 'Description', width: 400, editable: true }
      ]);
    }
  }, [artifact?.document_id]);

  // Add action column when in edit mode
  const columnsWithActions = useMemo(() => {
    if (!isEditing) return columns;
    
    return [
      ...columns,
      {
        field: 'actions',
        headerName: 'Actions',
        width: 100,
        renderCell: (params) => (
          <IconButton
            onClick={() => handleDeleteRow(params.row.id)}
            size="small"
          >
            <DeleteIcon />
          </IconButton>
        )
      }
    ];
  }, [columns, isEditing]);

  // Handle saving the table data
  const handleSave = () => {
    if (onContentUpdate) {
      const tableData = {
        rows: rows,
        columns: columns.filter(col => col.field !== 'actions') // Remove actions column before saving
      };
      
      onContentUpdate(tableData);
      setIsEditing(false);
    }
  };

  // Handle adding a new row
  const handleAddRow = () => {
    const newRow = {
      id: `row-${nextId}`,
      name: `New Item ${nextId}`,
      description: 'Description here'
    };
    
    setRows([...rows, newRow]);
    setNextId(nextId + 1);
  };

  // Handle deleting a row
  const handleDeleteRow = (id) => {
    setRows(rows.filter(row => row.id !== id));
  };

  // Handle cell edit
  const handleCellEdit = (params) => {
    setRows(rows.map(row => 
      row.id === params.id ? { ...row, [params.field]: params.value } : row
    ));
  };

  // Handle visualization change
  const handleVisualizationChange = (viz) => {
    if (onVisualizationChange) {
      onVisualizationChange(viz);
    }
  };

  // Prepare header actions
  const headerActions = [
    {
      id: 'edit',
      label: isEditing ? 'View Mode' : 'Edit Mode',
      icon: isEditing ? <SaveIcon /> : <EditIcon />,
      onClick: () => {
        if (isEditing) {
          handleSave();
        } else {
          setIsEditing(true);
        }
      }
    }
  ];

  // Secondary content for split view
  const secondaryContent = (
    <RelatedItemsPanel
      references={artifact?.references || []}
      onArtifactClick={navigateToArtifact}
      editable={isEditable}
    />
  );

  // Custom toolbar props
  const CustomToolbarWithProps = () => (
    <CustomToolbar
      isEditing={isEditing}
      onAddRow={handleAddRow}
      onSave={handleSave}
      isEditable={isEditable}
    />
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <TabHeader
        title={artifact?.title || 'Table View'}
        status={artifact?.status}
        lastModified={artifact?.lastModified}
        actions={headerActions}
      />
      
      {visualizations && visualizations.length > 0 && (
        <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2, py: 1 }}>
          <ViewSelector
            visualizations={visualizations}
            activeVisualization={activeVisualization}
            onChange={handleVisualizationChange}
          />
        </Box>
      )}
      
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
    lastModified: PropTypes.string
  }).isRequired,
  activeVisualization: PropTypes.object,
  visualizations: PropTypes.array,
  isEditable: PropTypes.bool,
  onContentUpdate: PropTypes.func,
  onVisualizationChange: PropTypes.func,
  layoutMode: PropTypes.oneOf(['single', 'vertical', 'horizontal'])
}; 

export default TableViewer;