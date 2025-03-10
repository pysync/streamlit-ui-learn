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
  Divider
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import VisibilityIcon from '@mui/icons-material/Visibility';
import MarkdownEditor from '../../common/MarkdownEditor';
import MarkdownViewer from '../../common/MarkdownViewer';
import TabHeader from '../../shared/TabHeader';
import SplitView from '../../shared/SplitView';
import RelatedItemsPanel from '../../shared/RelatedItemsPanel';
import { useWorkspace } from '../../../contexts/WorkspaceContext';

/**
 * Generic document viewer for section-based artifacts with markdown content
 */
const DocumentViewer = ({
  artifact,
  visualization,
  visualizations = [],
  isEditable = true,
  onContentUpdate,
  onVisualizationChange,
  layoutMode = 'single'
}) => {
  const { navigateToArtifact } = useWorkspace();
  const [activeSection, setActiveSection] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [sections, setSections] = useState([]);
  const [content, setContent] = useState({});
  
  // Parse artifact content and initialize sections
  useEffect(() => {
    if (artifact) {
      let parsedSections = [];
      
      // Handle different content formats
      if (typeof artifact.content === 'string') {
        try {
          // Try to parse as JSON
          const parsed = JSON.parse(artifact.content);
          if (parsed.sections && Array.isArray(parsed.sections)) {
            parsedSections = parsed.sections;
          }
        } catch (e) {
          // If not JSON, create a single section with the content
          parsedSections = [
            { id: 'content', label: 'Content', content: artifact.content }
          ];
        }
      } else if (artifact.content && artifact.content.sections) {
        // Already parsed object with sections
        parsedSections = artifact.content.sections;
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
    }
  }, [artifact]);
  
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
  
  // Save changes
  const handleSave = () => {
    // Update sections with new content
    const updatedSections = sections.map(section => ({
      ...section,
      content: content[section.id] || ''
    }));
    
    // Create updated artifact content
    const updatedContent = {
      ...artifact.content,
      sections: updatedSections
    };
    
    // Call onContentUpdate with the new content
    if (onContentUpdate) {
      onContentUpdate(updatedContent);
    }
    
    // Exit edit mode
    setIsEditing(false);
  };
  
  // Prepare secondary content (related items)
  const secondaryContent = artifact?.references?.length > 0 && (
    <RelatedItemsPanel
      references={artifact.references}
      onArtifactClick={navigateToArtifact}
    />
  );
  
  // Header actions
  const headerActions = [
    <Tooltip key="edit-toggle" title={isEditing ? "View Mode" : "Edit Mode"}>
      <IconButton onClick={toggleEditMode}>
        {isEditing ? <VisibilityIcon /> : <EditIcon />}
      </IconButton>
    </Tooltip>
  ];
  
  if (isEditing) {
    headerActions.push(
      <Tooltip key="save" title="Save Changes">
        <IconButton onClick={handleSave}>
          <SaveIcon />
        </IconButton>
      </Tooltip>
    );
  }
  
  // If no sections, show placeholder
  if (!sections || sections.length === 0) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="body1">No content available for this artifact.</Typography>
      </Box>
    );
  }
  
  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <TabHeader
        title={artifact?.title || 'Untitled Document'}
        status={artifact?.status}
        lastModified={artifact?.updated_at}
        actions={headerActions}
      />
      
      <SplitView
        direction={layoutMode === 'horizontal' ? 'horizontal' : 'vertical'}
        primaryContent={
          <Box sx={{ display: 'flex', height: '100%' }}>
            {/* Section tabs */}
            <Box sx={{ width: '200px', borderRight: '1px solid rgba(0, 0, 0, 0.12)' }}>
              <Tabs
                orientation="vertical"
                variant="scrollable"
                value={activeSection}
                onChange={handleSectionChange}
                sx={{ borderRight: 1, borderColor: 'divider' }}
              >
                {sections.map((section) => (
                  <Tab key={section.id} label={section.label} value={section.id} />
                ))}
              </Tabs>
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
        }
        secondaryContent={secondaryContent}
        showSecondary={layoutMode !== 'single' && !!secondaryContent}
      />
    </Box>
  );
};

DocumentViewer.propTypes = {
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

export default DocumentViewer; 