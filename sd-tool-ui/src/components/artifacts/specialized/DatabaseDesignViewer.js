import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { 
  Box, 
  Paper, 
  Typography, 
  Tabs, 
  Tab, 
  IconButton, 
  Tooltip,
  Button,
  Divider,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import StorageIcon from '@mui/icons-material/Storage';
import TableChartIcon from '@mui/icons-material/TableChart';
import SchemaIcon from '@mui/icons-material/Schema';
import TabHeader from '../../shared/TabHeader';
import SplitView from '../../shared/SplitView';
import RelatedItemsPanel from '../../shared/RelatedItemsPanel';
import { useWorkspace } from '../../../contexts/WorkspaceContext';
import { ARTIFACT_SCHEMAS } from '../../../constants/artifactSchemas';
import { ARTIFACT_TYPES } from '../../../constants/sdlcConstants';

/**
 * Specialized viewer for Database Design artifacts
 */
const DatabaseDesignViewer = ({
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
  const [activeTab, setActiveTab] = useState(0);
  const [entities, setEntities] = useState([]);
  const [relationships, setRelationships] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState('entity'); // 'entity', 'attribute', 'relationship'
  const [editItem, setEditItem] = useState(null);
  const [selectedEntity, setSelectedEntity] = useState(null);
  const canvasRef = useRef(null);
  
  // Get the schema for Database Design
  const schema = ARTIFACT_SCHEMAS[ARTIFACT_TYPES.DATABASE_DESIGN];
  
  // Parse artifact content and initialize data
  useEffect(() => {
    if (artifact) {
      let parsedEntities = [];
      let parsedRelationships = [];
      
      // Handle different content formats
      if (typeof artifact.content === 'string') {
        try {
          // Try to parse as JSON
          const parsed = JSON.parse(artifact.content);
          if (parsed.entities && Array.isArray(parsed.entities)) {
            parsedEntities = parsed.entities;
          }
          if (parsed.relationships && Array.isArray(parsed.relationships)) {
            parsedRelationships = parsed.relationships;
          }
        } catch (e) {
          console.warn('Failed to parse artifact content as JSON:', e);
          // If not JSON, create empty structures
          parsedEntities = [];
          parsedRelationships = [];
        }
      } else if (artifact.content) {
        // Already parsed object
        if (artifact.content.entities && Array.isArray(artifact.content.entities)) {
          parsedEntities = artifact.content.entities;
        }
        if (artifact.content.relationships && Array.isArray(artifact.content.relationships)) {
          parsedRelationships = artifact.content.relationships;
        }
      }
      
      setEntities(parsedEntities);
      setRelationships(parsedRelationships);
      
      // Set selected entity to first entity if not already set
      if ((!selectedEntity || !parsedEntities.find(e => e.id === selectedEntity)) && parsedEntities.length > 0) {
        setSelectedEntity(parsedEntities[0].id);
      }
    }
  }, [artifact]);
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  // Toggle edit mode
  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };
  
  // Handle save
  const handleSave = () => {
    if (!artifact) return;
    
    const updatedContent = {
      type: 'database',
      entities,
      relationships
    };
    
    onContentUpdate(updatedContent);
    setIsEditing(false);
  };
  
  // Open dialog to add/edit entity
  const handleAddEntity = () => {
    setDialogType('entity');
    setEditItem({
      id: `entity-${Date.now()}`,
      name: '',
      attributes: []
    });
    setDialogOpen(true);
  };
  
  // Open dialog to edit entity
  const handleEditEntity = (entity) => {
    setDialogType('entity');
    setEditItem({ ...entity });
    setDialogOpen(true);
  };
  
  // Delete entity
  const handleDeleteEntity = (entityId) => {
    setEntities(entities.filter(e => e.id !== entityId));
    
    // Also delete any relationships involving this entity
    setRelationships(relationships.filter(r => 
      r.source !== entityId && r.target !== entityId
    ));
    
    // If the deleted entity was selected, select another one
    if (selectedEntity === entityId) {
      const remainingEntities = entities.filter(e => e.id !== entityId);
      if (remainingEntities.length > 0) {
        setSelectedEntity(remainingEntities[0].id);
      } else {
        setSelectedEntity(null);
      }
    }
  };
  
  // Open dialog to add attribute
  const handleAddAttribute = (entityId) => {
    setDialogType('attribute');
    setEditItem({
      name: '',
      type: 'string',
      isPrimaryKey: false,
      isForeignKey: false,
      isNullable: true,
      defaultValue: '',
      description: ''
    });
    setSelectedEntity(entityId);
    setDialogOpen(true);
  };
  
  // Open dialog to edit attribute
  const handleEditAttribute = (entityId, attribute, index) => {
    setDialogType('attribute');
    setEditItem({ ...attribute, index });
    setSelectedEntity(entityId);
    setDialogOpen(true);
  };
  
  // Delete attribute
  const handleDeleteAttribute = (entityId, index) => {
    setEntities(entities.map(entity => {
      if (entity.id === entityId) {
        const updatedAttributes = [...entity.attributes];
        updatedAttributes.splice(index, 1);
        return {
          ...entity,
          attributes: updatedAttributes
        };
      }
      return entity;
    }));
  };
  
  // Open dialog to add relationship
  const handleAddRelationship = () => {
    setDialogType('relationship');
    setEditItem({
      id: `rel-${Date.now()}`,
      source: entities.length > 0 ? entities[0].id : '',
      target: entities.length > 1 ? entities[1].id : (entities.length > 0 ? entities[0].id : ''),
      sourceCardinality: '1',
      targetCardinality: '*',
      label: ''
    });
    setDialogOpen(true);
  };
  
  // Open dialog to edit relationship
  const handleEditRelationship = (relationship) => {
    setDialogType('relationship');
    setEditItem({ ...relationship });
    setDialogOpen(true);
  };
  
  // Delete relationship
  const handleDeleteRelationship = (relationshipId) => {
    setRelationships(relationships.filter(r => r.id !== relationshipId));
  };
  
  // Save dialog changes
  const handleSaveDialog = () => {
    if (dialogType === 'entity') {
      // Check if this is an edit or add
      const existingIndex = entities.findIndex(e => e.id === editItem.id);
      if (existingIndex >= 0) {
        // Edit existing entity
        setEntities(entities.map((entity, index) => 
          index === existingIndex ? editItem : entity
        ));
      } else {
        // Add new entity
        setEntities([...entities, editItem]);
      }
    } else if (dialogType === 'attribute') {
      // Update entity with new/edited attribute
      setEntities(entities.map(entity => {
        if (entity.id === selectedEntity) {
          const updatedAttributes = [...entity.attributes];
          if (typeof editItem.index === 'number') {
            // Edit existing attribute
            updatedAttributes[editItem.index] = {
              name: editItem.name,
              type: editItem.type,
              isPrimaryKey: editItem.isPrimaryKey,
              isForeignKey: editItem.isForeignKey,
              isNullable: editItem.isNullable,
              defaultValue: editItem.defaultValue,
              description: editItem.description
            };
          } else {
            // Add new attribute
            updatedAttributes.push({
              name: editItem.name,
              type: editItem.type,
              isPrimaryKey: editItem.isPrimaryKey,
              isForeignKey: editItem.isForeignKey,
              isNullable: editItem.isNullable,
              defaultValue: editItem.defaultValue,
              description: editItem.description
            });
          }
          return {
            ...entity,
            attributes: updatedAttributes
          };
        }
        return entity;
      }));
    } else if (dialogType === 'relationship') {
      // Check if this is an edit or add
      const existingIndex = relationships.findIndex(r => r.id === editItem.id);
      if (existingIndex >= 0) {
        // Edit existing relationship
        setRelationships(relationships.map((rel, index) => 
          index === existingIndex ? editItem : rel
        ));
      } else {
        // Add new relationship
        setRelationships([...relationships, editItem]);
      }
    }
    
    setDialogOpen(false);
  };
  
  // Prepare header actions
  const headerActions = [
    isEditing ? (
      <Tooltip title="Save" key="save">
        <IconButton onClick={handleSave} color="primary">
          <SaveIcon />
        </IconButton>
      </Tooltip>
    ) : (
      <Tooltip title="Edit" key="edit">
        <IconButton 
          onClick={toggleEditMode} 
          color="primary"
          disabled={!isEditable}
        >
          <EditIcon />
        </IconButton>
      </Tooltip>
    ),
    <Tooltip title="View" key="view">
      <IconButton onClick={() => setIsEditing(false)} disabled={!isEditing}>
        <VisibilityIcon />
      </IconButton>
    </Tooltip>
  ];
  
  // Prepare secondary content (related items)
  const secondaryContent = artifact?.references?.length > 0 ? (
    <RelatedItemsPanel 
      title="Related Items" 
      items={artifact.references.map(ref => ({
        id: ref.id,
        title: ref.title,
        type: ref.type,
        onClick: () => navigateToArtifact(ref.id)
      }))}
    />
  ) : null;
  
  // Get the selected entity
  const getSelectedEntityData = () => {
    return entities.find(e => e.id === selectedEntity) || null;
  };
  
  // Render entity dialog content
  const renderEntityDialogContent = () => (
    <Box sx={{ minWidth: 400 }}>
      <TextField
        label="Entity Name"
        value={editItem?.name || ''}
        onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
        fullWidth
        margin="normal"
        required
      />
      
      <TextField
        label="Description"
        value={editItem?.description || ''}
        onChange={(e) => setEditItem({ ...editItem, description: e.target.value })}
        fullWidth
        margin="normal"
        multiline
        rows={3}
      />
    </Box>
  );
  
  // Render attribute dialog content
  const renderAttributeDialogContent = () => (
    <Box sx={{ minWidth: 400 }}>
      <TextField
        label="Attribute Name"
        value={editItem?.name || ''}
        onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
        fullWidth
        margin="normal"
        required
      />
      
      <FormControl fullWidth margin="normal">
        <InputLabel>Data Type</InputLabel>
        <Select
          value={editItem?.type || 'string'}
          onChange={(e) => setEditItem({ ...editItem, type: e.target.value })}
          label="Data Type"
        >
          <MenuItem value="string">String</MenuItem>
          <MenuItem value="integer">Integer</MenuItem>
          <MenuItem value="float">Float</MenuItem>
          <MenuItem value="boolean">Boolean</MenuItem>
          <MenuItem value="date">Date</MenuItem>
          <MenuItem value="datetime">DateTime</MenuItem>
          <MenuItem value="text">Text</MenuItem>
          <MenuItem value="binary">Binary</MenuItem>
        </Select>
      </FormControl>
      
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Primary Key</InputLabel>
          <Select
            value={editItem?.isPrimaryKey ? 'yes' : 'no'}
            onChange={(e) => setEditItem({ 
              ...editItem, 
              isPrimaryKey: e.target.value === 'yes',
              // If primary key, can't be nullable
              isNullable: e.target.value === 'yes' ? false : editItem.isNullable
            })}
            label="Primary Key"
          >
            <MenuItem value="yes">Yes</MenuItem>
            <MenuItem value="no">No</MenuItem>
          </Select>
        </FormControl>
        
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Foreign Key</InputLabel>
          <Select
            value={editItem?.isForeignKey ? 'yes' : 'no'}
            onChange={(e) => setEditItem({ ...editItem, isForeignKey: e.target.value === 'yes' })}
            label="Foreign Key"
          >
            <MenuItem value="yes">Yes</MenuItem>
            <MenuItem value="no">No</MenuItem>
          </Select>
        </FormControl>
        
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Nullable</InputLabel>
          <Select
            value={editItem?.isNullable ? 'yes' : 'no'}
            onChange={(e) => setEditItem({ ...editItem, isNullable: e.target.value === 'yes' })}
            label="Nullable"
            disabled={editItem?.isPrimaryKey}
          >
            <MenuItem value="yes">Yes</MenuItem>
            <MenuItem value="no">No</MenuItem>
          </Select>
        </FormControl>
      </Box>
      
      <TextField
        label="Default Value"
        value={editItem?.defaultValue || ''}
        onChange={(e) => setEditItem({ ...editItem, defaultValue: e.target.value })}
        fullWidth
        margin="normal"
      />
      
      <TextField
        label="Description"
        value={editItem?.description || ''}
        onChange={(e) => setEditItem({ ...editItem, description: e.target.value })}
        fullWidth
        margin="normal"
        multiline
        rows={2}
      />
    </Box>
  );
  
  // Render relationship dialog content
  const renderRelationshipDialogContent = () => (
    <Box sx={{ minWidth: 400 }}>
      <FormControl fullWidth margin="normal">
        <InputLabel>Source Entity</InputLabel>
        <Select
          value={editItem?.source || ''}
          onChange={(e) => setEditItem({ ...editItem, source: e.target.value })}
          label="Source Entity"
          required
        >
          {entities.map(entity => (
            <MenuItem key={entity.id} value={entity.id}>{entity.name}</MenuItem>
          ))}
        </Select>
      </FormControl>
      
      <FormControl fullWidth margin="normal">
        <InputLabel>Target Entity</InputLabel>
        <Select
          value={editItem?.target || ''}
          onChange={(e) => setEditItem({ ...editItem, target: e.target.value })}
          label="Target Entity"
          required
        >
          {entities.map(entity => (
            <MenuItem key={entity.id} value={entity.id}>{entity.name}</MenuItem>
          ))}
        </Select>
      </FormControl>
      
      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
        <FormControl sx={{ flex: 1 }}>
          <InputLabel>Source Cardinality</InputLabel>
          <Select
            value={editItem?.sourceCardinality || '1'}
            onChange={(e) => setEditItem({ ...editItem, sourceCardinality: e.target.value })}
            label="Source Cardinality"
          >
            <MenuItem value="1">One (1)</MenuItem>
            <MenuItem value="0..1">Zero or One (0..1)</MenuItem>
            <MenuItem value="*">Many (*)</MenuItem>
            <MenuItem value="1..*">One or Many (1..*)</MenuItem>
          </Select>
        </FormControl>
        
        <FormControl sx={{ flex: 1 }}>
          <InputLabel>Target Cardinality</InputLabel>
          <Select
            value={editItem?.targetCardinality || '*'}
            onChange={(e) => setEditItem({ ...editItem, targetCardinality: e.target.value })}
            label="Target Cardinality"
          >
            <MenuItem value="1">One (1)</MenuItem>
            <MenuItem value="0..1">Zero or One (0..1)</MenuItem>
            <MenuItem value="*">Many (*)</MenuItem>
            <MenuItem value="1..*">One or Many (1..*)</MenuItem>
          </Select>
        </FormControl>
      </Box>
      
      <TextField
        label="Relationship Label"
        value={editItem?.label || ''}
        onChange={(e) => setEditItem({ ...editItem, label: e.target.value })}
        fullWidth
        margin="normal"
        placeholder="e.g., 'has', 'belongs to'"
      />
    </Box>
  );
  
  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <TabHeader
        title={artifact?.title || 'Untitled Database Design'}
        status={artifact?.status}
        lastModified={artifact?.updated_at}
        actions={headerActions}
      />
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab icon={<TableChartIcon />} label="Entities" />
          <Tab icon={<SchemaIcon />} label="Relationships" />
          <Tab icon={<StorageIcon />} label="ER Diagram" />
        </Tabs>
      </Box>
      
      <SplitView
        direction={layoutMode === 'horizontal' ? 'horizontal' : 'vertical'}
        primaryContent={
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Entities view */}
            {activeTab === 0 && (
              <Box sx={{ p: 2, display: 'flex', height: '100%' }}>
                {/* Entity list */}
                <Box sx={{ width: 250, borderRight: '1px solid rgba(0, 0, 0, 0.12)', pr: 2 }}>
                  {isEditing && (
                    <Button
                      variant="outlined"
                      startIcon={<AddIcon />}
                      onClick={handleAddEntity}
                      fullWidth
                      sx={{ mb: 2 }}
                    >
                      Add Entity
                    </Button>
                  )}
                  
                  {entities.length > 0 ? (
                    <List>
                      {entities.map((entity) => (
                        <ListItem 
                          key={entity.id}
                          button
                          selected={selectedEntity === entity.id}
                          onClick={() => setSelectedEntity(entity.id)}
                        >
                          <ListItemText 
                            primary={entity.name} 
                            secondary={`${entity.attributes?.length || 0} attributes`}
                          />
                          {isEditing && (
                            <ListItemSecondaryAction>
                              <IconButton 
                                edge="end" 
                                size="small"
                                onClick={() => handleEditEntity(entity)}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton 
                                edge="end" 
                                size="small"
                                onClick={() => handleDeleteEntity(entity.id)}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </ListItemSecondaryAction>
                          )}
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                      No entities defined
                    </Typography>
                  )}
                </Box>
                
                {/* Entity details */}
                <Box sx={{ flex: 1, pl: 2, overflow: 'auto' }}>
                  {selectedEntity ? (
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6">
                          {getSelectedEntityData()?.name || 'Entity Details'}
                        </Typography>
                        
                        {isEditing && (
                          <Button
                            variant="outlined"
                            startIcon={<AddIcon />}
                            onClick={() => handleAddAttribute(selectedEntity)}
                            size="small"
                          >
                            Add Attribute
                          </Button>
                        )}
                      </Box>
                      
                      {getSelectedEntityData()?.description && (
                        <Typography variant="body2" sx={{ mb: 2 }}>
                          {getSelectedEntityData().description}
                        </Typography>
                      )}
                      
                      <Divider sx={{ mb: 2 }} />
                      
                      {getSelectedEntityData()?.attributes?.length > 0 ? (
                        <Box component="table" sx={{ 
                          width: '100%', 
                          borderCollapse: 'collapse',
                          '& th, & td': {
                            border: '1px solid rgba(224, 224, 224, 1)',
                            padding: '8px 16px',
                            textAlign: 'left'
                          },
                          '& th': {
                            backgroundColor: 'rgba(0, 0, 0, 0.04)'
                          }
                        }}>
                          <Box component="thead">
                            <Box component="tr">
                              <Box component="th">Name</Box>
                              <Box component="th">Type</Box>
                              <Box component="th">Constraints</Box>
                              <Box component="th">Default</Box>
                              {isEditing && <Box component="th">Actions</Box>}
                            </Box>
                          </Box>
                          <Box component="tbody">
                            {getSelectedEntityData().attributes.map((attr, index) => (
                              <Box component="tr" key={index}>
                                <Box component="td">
                                  {attr.name}
                                  {attr.isPrimaryKey && (
                                    <Tooltip title="Primary Key">
                                      <Box component="span" sx={{ ml: 1, color: 'primary.main', fontWeight: 'bold' }}>
                                        PK
                                      </Box>
                                    </Tooltip>
                                  )}
                                  {attr.isForeignKey && (
                                    <Tooltip title="Foreign Key">
                                      <Box component="span" sx={{ ml: 1, color: 'secondary.main', fontWeight: 'bold' }}>
                                        FK
                                      </Box>
                                    </Tooltip>
                                  )}
                                </Box>
                                <Box component="td">{attr.type}</Box>
                                <Box component="td">
                                  {!attr.isNullable && 'NOT NULL'}
                                </Box>
                                <Box component="td">{attr.defaultValue || '-'}</Box>
                                {isEditing && (
                                  <Box component="td">
                                    <IconButton 
                                      size="small" 
                                      onClick={() => handleEditAttribute(selectedEntity, attr, index)}
                                    >
                                      <EditIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton 
                                      size="small"
                                      onClick={() => handleDeleteAttribute(selectedEntity, index)}
                                    >
                                      <DeleteIcon fontSize="small" />
                                    </IconButton>
                                  </Box>
                                )}
                              </Box>
                            ))}
                          </Box>
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                          No attributes defined for this entity
                        </Typography>
                      )}
                    </Box>
                  ) : (
                    <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center' }}>
                      Select an entity to view details
                    </Typography>
                  )}
                </Box>
              </Box>
            )}
            
            {/* Relationships view */}
            {activeTab === 1 && (
              <Box sx={{ p: 2, overflow: 'auto' }}>
                {isEditing && (
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={handleAddRelationship}
                    sx={{ mb: 2 }}
                    disabled={entities.length < 2}
                  >
                    Add Relationship
                  </Button>
                )}
              </Box>
            )}
          </Box>
        }
        secondaryContent={secondaryContent}
      />
    </Box>
  );
};

DatabaseDesignViewer.propTypes = {
  artifact: PropTypes.object,
  visualization: PropTypes.object,
  visualizations: PropTypes.array,
  isEditable: PropTypes.bool,
  onContentUpdate: PropTypes.func,
  onVisualizationChange: PropTypes.func,
  layoutMode: PropTypes.string
};

export default DatabaseDesignViewer; 