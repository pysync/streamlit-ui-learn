import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { 
  Box, 
  Paper, 
  Typography, 
  Button,
  IconButton,
  Tooltip,
  Tabs,
  Tab
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';

// Import shared components
import ViewTypeSelector from '../Shared/ViewTypeSelector';
import TabHeader from '../Shared/TabHeader';
import SplitView from '../Shared/SplitView';
import EditableTable from '../Shared/EditableTable';
import RelatedArtifactsPanel from '../Shared/RelatedArtifactsPanel';

// Import utility functions for CSV export
const exportToCSV = (data, filename) => {
  // Convert data to CSV
  const headers = Object.keys(data[0] || {}).join(',');
  const rows = data.map(row => Object.values(row).join(',')).join('\n');
  const csvContent = `${headers}\n${rows}`;
  
  // Create download link
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Renders table-based artifacts with sorting, filtering, and editing
 */
const TableRenderer = ({
  artifact,
  visualization,
  visualizations,
  isEditable = false,
  onVisualizationChange,
  onContentUpdate,
}) => {
  // Extract data from the artifact content
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [filters, setFilters] = useState({});
  
  // Initialize data from artifact
  useEffect(() => {
    if (artifact.content) {
      // If content is a string, try parsing as JSON
      const parsedContent = typeof artifact.content === 'string' 
        ? JSON.parse(artifact.content) 
        : artifact.content;
      
      // Extract data and columns from content
      if (parsedContent.data && Array.isArray(parsedContent.data)) {
        setData(parsedContent.data);
      }
      
      if (parsedContent.columns && Array.isArray(parsedContent.columns)) {
        setColumns(parsedContent.columns);
      } else if (parsedContent.data && parsedContent.data.length > 0) {
        // Derive columns from data if not explicitly provided
        const firstRow = parsedContent.data[0];
        setColumns(Object.keys(firstRow).map(key => ({
          field: key,
          headerName: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
          type: typeof firstRow[key] === 'number' ? 'number' : 'string'
        })));
      }
    }
  }, [artifact.content]);
  
  // Handle row updates
  const handleRowUpdate = (id, updatedRow) => {
    const updatedData = data.map(row => row.id === id ? {...row, ...updatedRow} : row);
    
    setData(updatedData);
    
    // Update the artifact content
    if (onContentUpdate) {
      onContentUpdate({
        ...artifact.content,
        data: updatedData
      });
    }
  };
  
  // Handle row additions
  const handleRowAdd = (newRow) => {
    // Generate a unique ID if not provided
    if (!newRow.id) {
      newRow.id = `row-${Date.now()}`;
    }
    
    const updatedData = [...data, newRow];
    setData(updatedData);
    
    // Update the artifact content
    if (onContentUpdate) {
      onContentUpdate({
        ...artifact.content,
        data: updatedData
      });
    }
  };
  
  // Handle row deletions
  const handleRowDelete = (id) => {
    const updatedData = data.filter(row => row.id !== id);
    setData(updatedData);
    
    // Update the artifact content
    if (onContentUpdate) {
      onContentUpdate({
        ...artifact.content,
        data: updatedData
      });
    }
  };
  
  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };
  
  // Handle tab changes
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  // Handle export to CSV
  const handleExport = () => {
    exportToCSV(data, artifact.title || 'table-export');
  };
  
  // Configure header actions
  const headerActions = [
    {
      id: 'export',
      label: 'Export to CSV',
      icon: <FileDownloadIcon />,
      onClick: handleExport
    }
  ];
  
  if (isEditable) {
    headerActions.push({
      id: 'addRow',
      label: 'Add Row',
      icon: <AddIcon />,
      onClick: () => {
        // Create an empty row with default values
        const emptyRow = columns.reduce((acc, col) => {
          acc[col.field] = col.defaultValue !== undefined ? col.defaultValue : '';
          return acc;
        }, {});
        handleRowAdd(emptyRow);
      }
    });
  }
  
  // Prepare secondary content
  const secondaryContent = artifact.references ? (
    <RelatedArtifactsPanel
      references={artifact.references}
      onArtifactClick={(ref) => {
        console.log('Navigate to artifact:', ref);
        // Here you would typically navigate to the referenced artifact
      }}
      editable={isEditable}
    />
  ) : null;
  
  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <TabHeader 
        title={artifact.title}
        artifactType={artifact.artifactType}
        version={artifact.version}
        status={artifact.status}
        lastModified={artifact.lastModifiedAt}
        actions={headerActions}
      />
      
      <ViewTypeSelector 
        visualizations={visualizations}
        activeVisualization={visualization}
        onChange={onVisualizationChange}
      />
      
      <SplitView 
        secondaryContent={secondaryContent}
        showSecondary={!!secondaryContent}
      >
        <Paper 
          elevation={1} 
          sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
        >
          {/* Table toolbar */}
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              p: 1,
              borderBottom: '1px solid rgba(224, 224, 224, 1)'
            }}
          >
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab label="Table View" />
              <Tab label="Card View" />
              <Tab label="Matrix View" />
            </Tabs>
            
            <Box sx={{ flexGrow: 1 }} />
            
            <Tooltip title="Filter">
              <IconButton size="small">
                <FilterAltIcon />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Column Settings">
              <IconButton size="small">
                <ViewColumnIcon />
              </IconButton>
            </Tooltip>
          </Box>
          
          {/* Main content area based on active tab */}
          <Box sx={{ flex: 1, overflow: 'auto' }}>
            {activeTab === 0 && (
              <EditableTable
                data={data}
                columns={columns}
                editable={isEditable}
                onRowUpdate={handleRowUpdate}
                onRowAdd={handleRowAdd}
                onRowDelete={handleRowDelete}
                filters={filters}
                onFilterChange={handleFilterChange}
                showSelection
              />
            )}
            
            {activeTab === 1 && (
              <Box p={2}>
                <Typography>Card View (Implementation Placeholder)</Typography>
                {/* Card view would be implemented here */}
              </Box>
            )}
            
            {activeTab === 2 && (
              <Box p={2}>
                <Typography>Matrix View (Implementation Placeholder)</Typography>
                {/* Matrix view would be implemented here */}
              </Box>
            )}
          </Box>
        </Paper>
      </SplitView>
    </Box>
  );
};

TableRenderer.propTypes = {
  artifact: PropTypes.shape({
    artifactId: PropTypes.string.isRequired,
    artifactType: PropTypes.string.isRequired,
    title: PropTypes.string,
    content: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    references: PropTypes.array,
    visualization: PropTypes.array,
    version: PropTypes.string,
    status: PropTypes.string,
    lastModifiedAt: PropTypes.string
  }).isRequired,
  visualization: PropTypes.object,
  visualizations: PropTypes.array,
  isEditable: PropTypes.bool,
  onVisualizationChange: PropTypes.func,
  onContentUpdate: PropTypes.func
};

export default TableRenderer; 