import React, { useState, useEffect } from 'react';
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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Divider
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CodeIcon from '@mui/icons-material/Code';
import HttpIcon from '@mui/icons-material/Http';
import MarkdownEditor from '../../common/MarkdownEditor';
import MarkdownViewer from '../../common/MarkdownViewer';
import TabHeader from '../../shared/TabHeader';
import SplitView from '../../shared/SplitView';
import RelatedItemsPanel from '../../shared/RelatedItemsPanel';
import { useWorkspace } from '../../../contexts/WorkspaceContext';
import { ARTIFACT_SCHEMAS } from '../../../constants/artifactSchemas';
import { ARTIFACT_TYPES } from '../../../constants/sdlcConstants';

/**
 * Specialized viewer for API Specification artifacts
 */
const ApiSpecificationViewer = ({
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
  const [sections, setSections] = useState([]);
  const [activeSection, setActiveSection] = useState(null);
  const [content, setContent] = useState({});
  const [endpoints, setEndpoints] = useState([]);
  
  // Get the schema for API Specification
  const schema = ARTIFACT_SCHEMAS[ARTIFACT_TYPES.API_SPECIFICATION];
  
  // Parse artifact content and initialize data
  useEffect(() => {
    if (artifact) {
      let parsedSections = [];
      let parsedEndpoints = [];
      
      // Handle different content formats
      if (typeof artifact.content === 'string') {
        try {
          // Try to parse as JSON
          const parsed = JSON.parse(artifact.content);
          if (parsed.sections && Array.isArray(parsed.sections)) {
            parsedSections = parsed.sections;
          }
          if (parsed.endpoints && Array.isArray(parsed.endpoints)) {
            parsedEndpoints = parsed.endpoints;
          }
        } catch (e) {
          console.warn('Failed to parse artifact content as JSON:', e);
          // If not JSON, create a single section with the content
          parsedSections = [
            { id: 'content', label: 'Content', content: artifact.content }
          ];
        }
      } else if (artifact.content) {
        // Already parsed object
        if (artifact.content.sections && Array.isArray(artifact.content.sections)) {
          parsedSections = artifact.content.sections;
        }
        if (artifact.content.endpoints && Array.isArray(artifact.content.endpoints)) {
          parsedEndpoints = artifact.content.endpoints;
        }
      }
      
      // If no sections, use default from schema
      if (parsedSections.length === 0 && schema?.default?.sections) {
        parsedSections = schema.default.sections;
      }
      
      setSections(parsedSections);
      
      // Create content object from sections
      const contentObj = {};
      parsedSections.forEach(section => {
        contentObj[section.id] = section.content;
      });
      setContent(contentObj);
      
      // Set active section to first section if not already set
      if ((!activeSection || !parsedSections.find(s => s.id === activeSection)) && parsedSections.length > 0) {
        setActiveSection(parsedSections[0].id);
      }
      
      setEndpoints(parsedEndpoints);
    }
  }, [artifact, schema, activeSection]);
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  // Handle section change
  const handleSectionChange = (sectionId) => {
    setActiveSection(sectionId);
  };
  
  // Toggle edit mode
  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };
  
  // Handle content change
  const handleContentChange = (sectionId, newContent) => {
    setContent(prev => ({
      ...prev,
      [sectionId]: newContent
    }));
  };
  
  // Handle save
  const handleSave = () => {
    if (!artifact) return;
    
    // Update sections with new content
    const updatedSections = sections.map(section => ({
      ...section,
      content: content[section.id] || ''
    }));
    
    const updatedContent = {
      sections: updatedSections,
      endpoints
    };
    
    onContentUpdate(updatedContent);
    setIsEditing(false);
  };
  
  // Related items panel for secondary content
  const secondaryContent = artifact?.references?.length > 0 ? (
    <RelatedItemsPanel 
      title="Related Items"
      items={artifact.references}
      onItemClick={(item) => navigateToArtifact(item.id)}
    />
  ) : null;

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <TabHeader
        title={artifact?.title || 'API Specification'}
        actions={
          <>
            {isEditable && (
              <Tooltip title={isEditing ? "Save" : "Edit"}>
                <IconButton onClick={isEditing ? handleSave : toggleEditMode}>
                  {isEditing ? <SaveIcon /> : <EditIcon />}
                </IconButton>
              </Tooltip>
            )}
            {!isEditing && (
              <Tooltip title="View">
                <IconButton>
                  <VisibilityIcon />
                </IconButton>
              </Tooltip>
            )}
          </>
        }
      />
      
      <SplitView
        direction={layoutMode === 'horizontal' ? 'horizontal' : 'vertical'}
        primaryContent={
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Tabs value={activeTab} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tab label="Documentation" />
              <Tab label="Endpoints" />
              <Tab label="Schema" />
            </Tabs>
            
            {/* Documentation view */}
            {activeTab === 0 && (
              <Box sx={{ display: 'flex', height: '100%' }}>
                {/* Section navigation */}
                <Box sx={{ width: 200, borderRight: 1, borderColor: 'divider', overflow: 'auto' }}>
                  <List component="nav">
                    {sections.map((section) => (
                      <ListItem 
                        key={section.id}
                        button
                        selected={activeSection === section.id}
                        onClick={() => handleSectionChange(section.id)}
                      >
                        <ListItemText primary={section.label} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
                
                {/* Content area */}
                <Box sx={{ flexGrow: 1, p: 2, overflow: 'auto' }}>
                  {activeSection && (
                    <>
                      {isEditing ? (
                        <MarkdownEditor
                          value={content[activeSection] || ''}
                          onChange={(newContent) => handleContentChange(activeSection, newContent)}
                          onSave={handleSave}
                        />
                      ) : (
                        <MarkdownViewer content={content[activeSection] || ''} />
                      )}
                    </>
                  )}
                </Box>
              </Box>
            )}
            
            {/* Endpoints view */}
            {activeTab === 1 && (
              <Box sx={{ p: 2, overflow: 'auto' }}>
                <Typography variant="h6" sx={{ mb: 2 }}>API Endpoints</Typography>
                
                {endpoints.length > 0 ? (
                  endpoints.map((endpoint, index) => (
                    <Accordion key={index} sx={{ mb: 1 }}>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                          <Chip 
                            label={endpoint.method || 'GET'} 
                            color={
                              endpoint.method === 'GET' ? 'success' :
                              endpoint.method === 'POST' ? 'primary' :
                              endpoint.method === 'PUT' ? 'warning' :
                              endpoint.method === 'DELETE' ? 'error' :
                              'default'
                            }
                            size="small"
                            sx={{ mr: 2, minWidth: 60 }}
                          />
                          <Typography variant="subtitle1">
                            {endpoint.path || '/'}
                          </Typography>
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2">Description</Typography>
                          <Typography variant="body2">
                            {endpoint.description || 'No description provided'}
                          </Typography>
                        </Box>
                        
                        {endpoint.parameters && endpoint.parameters.length > 0 && (
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2">Parameters</Typography>
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
                                  <Box component="th">Required</Box>
                                  <Box component="th">Description</Box>
                                </Box>
                              </Box>
                              <Box component="tbody">
                                {endpoint.parameters.map((param, paramIndex) => (
                                  <Box component="tr" key={paramIndex}>
                                    <Box component="td">{param.name}</Box>
                                    <Box component="td">{param.type}</Box>
                                    <Box component="td">{param.required ? 'Yes' : 'No'}</Box>
                                    <Box component="td">{param.description}</Box>
                                  </Box>
                                ))}
                              </Box>
                            </Box>
                          </Box>
                        )}
                        
                        {endpoint.responses && endpoint.responses.length > 0 && (
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2">Responses</Typography>
                            {endpoint.responses.map((response, respIndex) => (
                              <Box key={respIndex} sx={{ mb: 1, p: 1, border: '1px solid rgba(224, 224, 224, 1)' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                  <Chip 
                                    label={response.code || '200'} 
                                    color={
                                      response.code?.startsWith('2') ? 'success' :
                                      response.code?.startsWith('4') ? 'warning' :
                                      response.code?.startsWith('5') ? 'error' :
                                      'default'
                                    }
                                    size="small"
                                    sx={{ mr: 2 }}
                                  />
                                  <Typography variant="subtitle2">
                                    {response.description || 'Success'}
                                  </Typography>
                                </Box>
                                
                                {response.schema && (
                                  <Box sx={{ p: 1, backgroundColor: 'rgba(0, 0, 0, 0.04)' }}>
                                    <Typography variant="caption" component="pre" sx={{ fontFamily: 'monospace' }}>
                                      {JSON.stringify(response.schema, null, 2)}
                                    </Typography>
                                  </Box>
                                )}
                              </Box>
                            ))}
                          </Box>
                        )}
                      </AccordionDetails>
                    </Accordion>
                  ))
                ) : (
                  <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center' }}>
                    No endpoints defined for this API
                  </Typography>
                )}
              </Box>
            )}
            
            {/* Schema view */}
            {activeTab === 2 && (
              <Box sx={{ p: 2, overflow: 'auto' }}>
                <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center' }}>
                  Schema View (Implementation Placeholder)
                </Typography>
              </Box>
            )}
          </Box>
        }
        secondaryContent={secondaryContent}
        showSecondary={layoutMode !== 'single' && !!secondaryContent}
      />
    </Box>
  );
};

ApiSpecificationViewer.propTypes = {
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

export default ApiSpecificationViewer; 