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
  Divider
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ArchitectureIcon from '@mui/icons-material/Architecture';
import DescriptionIcon from '@mui/icons-material/Description';
import MarkdownEditor from '../../common/MarkdownEditor';
import MarkdownViewer from '../../common/MarkdownViewer';
import TabHeader from '../../shared/TabHeader';
import SplitView from '../../shared/SplitView';
import RelatedItemsPanel from '../../shared/RelatedItemsPanel';
import { useWorkspace } from '../../../contexts/WorkspaceContext';
import { ARTIFACT_SCHEMAS } from '../../../constants/artifactSchemas';
import { ARTIFACT_TYPES } from '../../../constants/sdlcConstants';

/**
 * Specialized viewer for System Architecture artifacts
 */
const SystemArchitectureViewer = ({
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
  const [components, setComponents] = useState([]);
  
  // Get the schema for System Architecture
  const schema = ARTIFACT_SCHEMAS[ARTIFACT_TYPES.SYSTEM_ARCHITECTURE];
  
  // Parse artifact content and initialize data
  useEffect(() => {
    if (artifact) {
      let parsedSections = [];
      let parsedComponents = [];
      
      // Handle different content formats
      if (typeof artifact.content === 'string') {
        try {
          // Try to parse as JSON
          const parsed = JSON.parse(artifact.content);
          if (parsed.sections && Array.isArray(parsed.sections)) {
            parsedSections = parsed.sections;
          }
          if (parsed.components && Array.isArray(parsed.components)) {
            parsedComponents = parsed.components;
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
        if (artifact.content.components && Array.isArray(artifact.content.components)) {
          parsedComponents = artifact.content.components;
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
      
      setComponents(parsedComponents);
    }
  }, [artifact, schema]);
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  // Handle section change
  const handleSectionChange = (event, newValue) => {
    setActiveSection(newValue);
  };
  
  // Toggle edit mode
  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };
  
  // Handle content change in editor
  const handleContentChange = (sectionId, newContent) => {
    setContent(prevContent => ({
      ...prevContent,
      [sectionId]: newContent
    }));
  };
  
  // Handle save
  const handleSave = () => {
    // Update sections with new content
    const updatedSections = sections.map(section => ({
      ...section,
      content: content[section.id]
    }));
    
    // Call onContentUpdate with updated sections
    onContentUpdate(updatedSections);
  };
  
  // Render the component
  return (
    <Box sx={{ flexGrow: 1 }}>
      <SplitView
        primaryContent={
          <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ p: 2, overflow: 'auto' }}>
              {sections && sections.length > 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {sections.map((section, index) => (
                    <Paper key={index} sx={{ p: 2 }}>
                      <Typography variant="h6">{section.label}</Typography>
                      
                      {section.content && (
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          {section.content}
                        </Typography>
                      )}
                    </Paper>
                  ))}
                </Box>
              ) : (
                <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center' }}>
                  No sections defined for this architecture
                </Typography>
              )}
            </Box>
            
            {/* Diagram view */}
            {activeTab === 1 && (
              <Box sx={{ p: 2, overflow: 'auto' }}>
                <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center' }}>
                  Architecture Diagram View (Implementation Placeholder)
                </Typography>
              </Box>
            )}
          </Box>
        }
        secondaryContent={
          <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ p: 2, overflow: 'auto' }}>
              {components && components.length > 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {components.map((component, index) => (
                    <Paper key={index} sx={{ p: 2 }}>
                      <Typography variant="h6">{component.name}</Typography>
                      
                      {component.description && (
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          {component.description}
                        </Typography>
                      )}
                      
                      <Divider sx={{ my: 2 }} />
                      
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                        {component.type && (
                          <Box>
                            <Typography variant="caption" color="text.secondary">Type</Typography>
                            <Typography variant="body2">{component.type}</Typography>
                          </Box>
                        )}
                        
                        {component.technology && (
                          <Box>
                            <Typography variant="caption" color="text.secondary">Technology</Typography>
                            <Typography variant="body2">{component.technology}</Typography>
                          </Box>
                        )}
                        
                        {component.responsibility && (
                          <Box sx={{ flexBasis: '100%', mt: 1 }}>
                            <Typography variant="caption" color="text.secondary">Responsibility</Typography>
                            <Typography variant="body2">{component.responsibility}</Typography>
                          </Box>
                        )}
                      </Box>
                      
                      {component.interfaces && component.interfaces.length > 0 && (
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="subtitle2">Interfaces</Typography>
                          <Box sx={{ ml: 2 }}>
                            {component.interfaces.map((iface, ifaceIndex) => (
                              <Box key={ifaceIndex} sx={{ mt: 1 }}>
                                <Typography variant="body2">
                                  <strong>{iface.name}</strong> - {iface.description}
                                </Typography>
                              </Box>
                            ))}
                          </Box>
                        </Box>
                      )}
                      
                      {component.dependencies && component.dependencies.length > 0 && (
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="subtitle2">Dependencies</Typography>
                          <Box sx={{ ml: 2 }}>
                            {component.dependencies.map((dep, depIndex) => (
                              <Box key={depIndex} sx={{ mt: 1 }}>
                                <Typography variant="body2">
                                  <strong>{dep.name}</strong> - {dep.description}
                                </Typography>
                              </Box>
                            ))}
                          </Box>
                        </Box>
                      )}
                    </Paper>
                  ))}
                </Box>
              ) : (
                <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center' }}>
                  No components defined for this architecture
                </Typography>
              )}
            </Box>
            
            {/* Diagram view */}
            {activeTab === 2 && (
              <Box sx={{ p: 2, overflow: 'auto' }}>
                <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center' }}>
                  Architecture Diagram View (Implementation Placeholder)
                </Typography>
              </Box>
            )}
          </Box>
        }
        showSecondary={layoutMode !== 'single' && !!secondaryContent}
      />
    </Box>
  );
};

SystemArchitectureViewer.propTypes = {
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

export default SystemArchitectureViewer; 