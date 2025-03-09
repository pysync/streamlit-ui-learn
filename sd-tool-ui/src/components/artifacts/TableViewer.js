import React, { useState, useMemo } from 'react';
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
import BaseArtifactViewer from '../BaseArtifactViewer';
import RelatedItemsPanel from '../../shared/RelatedItemsPanel';
import { useArtifact } from '../../core/ArtifactContext';

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
            <Button
              startIcon={<SaveIcon />}
              onClick={onSave}
            >
              Save
            </Button>
          ) : (
            <Button
              startIcon={<EditIcon />}
              onClick={() => onAddRow()}
            >
              Add Row
            </Button>
          )}
        </>
      )}
    </GridToolbarContainer>
  );
};

/**
 * Renders table-based artifacts with data grid functionality
 */
const TableViewer = ({
  artifact,
  activeVisualization,
  visualizations,
  isEditable = false,
  onVisualizationChange,
  onContentUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const { navigateToArtifact } = useArtifact();

  // Process the content when the artifact changes
  useMemo(() => {
    if (artifact?.content) {
      try {
        const content = typeof artifact.content === 'string' 
          ? JSON.parse(artifact.content) 
          : artifact.content;
        
        setRows(content.rows || []);
        setColumns(content.columns || []);
      } catch (error) {
        console.error('Error parsing table content', error);
        setRows([]);
        setColumns([]);
      }
    }
  }, [artifact]);

  // Handle adding a new row
  const handleAddRow = () => {
    setIsEditing(true);
    const newRow = { id: Date.now() };
    columns.forEach(col => {
      newRow[col.field] = '';
    });
    setRows([...rows, newRow]);
  };

  // Handle saving changes
  const handleSave = () => {
    if (onContentUpdate) {
      onContentUpdate({
        ...artifact,
        content: { rows, columns }
      });
    }
    setIsEditing(false);
  };

  // Handle artifact reference click
  const handleArtifactClick = (reference) => {
    navigateToArtifact(reference.id);
  };

  // Generate actions for tab header
  const headerActions = [];

  if (isEditable) {
    if (isEditing) {
      headerActions.push(
        { id: 'save', label: 'Save', icon: <SaveIcon />, onClick: handleSave }
      );
    } else {
      headerActions.push(
        { id: 'edit', label: 'Edit', icon: <EditIcon />, onClick: handleAddRow }
      );
    }
  }

  // Add delete column if editing
  const editColumns = useMemo(() => {
    if (isEditing && isEditable) {
      return [
        ...columns,
        {
          field: 'actions',
          headerName: 'Actions',
          width: 100,
          renderCell: (params) => (
            <IconButton 
              size="small"
              onClick={() => {
                setRows(rows.filter(row => row.id !== params.row.id));
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          )
        }
      ];
    }
    return columns;
  }, [columns, isEditing, isEditable, rows]);

  // Secondary panel content
  const secondaryContent = artifact.references?.length > 0 ? (
    <RelatedItemsPanel
      references={artifact.references}
      onArtifactClick={handleArtifactClick}
      editable={isEditable}
    />
  ) : null;

  return (
    <BaseArtifactViewer
      artifact={artifact}
      activeVisualization={activeVisualization}
      visualizations={visualizations}
      isEditable={isEditable}
      onVisualizationChange={onVisualizationChange}
      headerActions={headerActions}
      secondaryContent={secondaryContent}
    >
      <Box sx={{ flex: 1, height: '100%', width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={editColumns}
          pagination
          pageSize={10}
          rowsPerPageOptions={[10, 25, 50]}
          checkboxSelection={isEditing}
          disableSelectionOnClick
          autoHeight
          components={{
            Toolbar: CustomToolbar
          }}
          componentsProps={{
            toolbar: {
              isEditing,
              onAddRow: handleAddRow,
              onSave: handleSave,
              isEditable
            }
          }}
          sx={{
            '& .MuiDataGrid-cell': {
              outline: 'none !important'
            }
          }}
        />
      </Box>
    </BaseArtifactViewer>
  );
};

TableViewer.propTypes = {
  artifact: PropTypes.shape({
    id: PropTypes.string.isRequired,
    document_id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    title: PropTypes.string,
    content: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    references: PropTypes.array,
    visualizations: PropTypes.array,
    version: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    status: PropTypes.string,
    lastModified: PropTypes.string
  }).isRequired,
  activeVisualization: PropTypes.object,
  visualizations: PropTypes.array,
  isEditable: PropTypes.bool,
  onVisualizationChange: PropTypes.func,
  onContentUpdate: PropTypes.func
};

export default TableViewer; 