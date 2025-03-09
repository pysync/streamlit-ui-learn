import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, Paper, Tabs, Tab, Divider, IconButton, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PrintIcon from '@mui/icons-material/Print';
import DownloadIcon from '@mui/icons-material/Download';
import TabHeader from '../shared/TabHeader';
import ViewSelector from '../shared/ViewSelector';
import SplitView from '../shared/SplitView';
import RelatedItemsPanel from '../shared/RelatedItemsPanel';
import MarkdownEditor from '../shared/MarkdownEditor';
import MDEditor from '@uiw/react-md-editor';
import { useWorkspace } from '../../contexts/WorkspaceContext';
import { useWorkspaceLayout } from '../../contexts/WorkspaceLayoutContext';
import { VISUALIZATION_TYPES } from '../../constants/visualizationTypes';

const INITIAL_SECTIONS = [
  { id: 'overview', label: 'Overview', content: '# Overview\n\nProvide a high-level overview of the functionality.' },
  { id: 'requirements', label: 'Requirements', content: '# Requirements\n\n## Functional Requirements\n\n- Requirement 1\n- Requirement 2\n\n## Non-Functional Requirements\n\n- Performance\n- Security' },
  { id: 'design', label: 'Design', content: '# Design\n\nDescribe the design approach for implementing this functionality.' },
  { id: 'interfaces', label: 'Interfaces', content: '# Interfaces\n\n## User Interfaces\n\n## API Interfaces' },
  { id: 'data', label: 'Data Models', content: '# Data Models\n\nDescribe key data structures and relationships.' }
];

/**
 * Specialized viewer for Functional Specification artifacts
 */
const FunctionalSpecViewer = ({
  artifact,
  activeVisualization,
  visualizations,
  isEditable = false,
  onContentUpdate,
  onVisualizationChange
}) => {
  // Get layoutMode from context instead of props
  const { layoutMode } = useWorkspaceLayout();
  const { navigateToArtifact } = useWorkspace();
  const [isEditing, setIsEditing] = useState(false);
  const [sections, setSections] = useState(INITIAL_SECTIONS);
  const [activeSection, setActiveSection] = useState('overview');
  const [content, setContent] = useState({});

  useEffect(() => {
    console.log(`✨ FunctionalSpecViewer mounted for ${artifact.document_id}`, {
      type: artifact.art_type,
      sections: Object.keys(artifact.content || {}),
      layoutMode // Log the layoutMode from context
    });
  }, [artifact.document_id, layoutMode]);
  
  // Initialize content from artifact
  useEffect(() => {
    if (artifact?.content) {
      try {
        let parsedContent;
        if (typeof artifact.content === 'string') {
          try {
            parsedContent = JSON.parse(artifact.content);
          } catch (e) {
            // If the content is a string but not JSON, create a simple structure
            parsedContent = { 
              overview: { content: artifact.content },
              requirements: { content: INITIAL_SECTIONS.find(s => s.id === 'requirements')?.content || '' },
              design: { content: INITIAL_SECTIONS.find(s => s.id === 'design')?.content || '' },
              interfaces: { content: INITIAL_SECTIONS.find(s => s.id === 'interfaces')?.content || '' },
              data: { content: INITIAL_SECTIONS.find(s => s.id === 'data')?.content || '' }
            };
          }
        } else {
          parsedContent = artifact.content;
        }
        
        // Initialize sections from content or use defaults
        const newSections = [];
        const newContent = {};
        
        // Process each section
        INITIAL_SECTIONS.forEach(section => {
          const sectionData = parsedContent[section.id] || {};
          const sectionContent = sectionData.content || section.content;
          
          newSections.push({
            id: section.id,
            label: sectionData.label || section.label
          });
          
          newContent[section.id] = sectionContent;
        });
        
        setSections(newSections);
        setContent(newContent);
      } catch (error) {
        console.error('Error parsing functional spec content:', error);
        // Fallback to defaults on error
        setSections(INITIAL_SECTIONS);
        const defaultContent = {};
        INITIAL_SECTIONS.forEach(section => {
          defaultContent[section.id] = section.content;
        });
        setContent(defaultContent);
      }
    } else {
      // No content, use defaults
      setSections(INITIAL_SECTIONS);
      const defaultContent = {};
      INITIAL_SECTIONS.forEach(section => {
        defaultContent[section.id] = section.content;
      });
      setContent(defaultContent);
    }
  }, [artifact?.document_id]);

  // Handle content change from editor
  const handleContentChange = (newContent) => {
    setContent({
      ...content,
      [activeSection]: newContent
    });
  };

  // Handle save
  const handleSave = () => {
    if (onContentUpdate) {
      // Prepare the updated content structure
      const updatedContent = {};
      
      sections.forEach(section => {
        updatedContent[section.id] = {
          label: section.label,
          content: content[section.id] || ''
        };
      });
      
      onContentUpdate(updatedContent);
      setIsEditing(false);
    }
  };

  // Get the current section content
  const currentSection = sections.find(section => section.id === activeSection);
  const currentContent = content[activeSection] || '';

  // Prepare header actions
  const headerActions = [
    {
      id: 'edit',
      label: isEditing ? 'View Mode' : 'Edit Mode',
      icon: isEditing ? <VisibilityIcon /> : <EditIcon />,
      onClick: () => setIsEditing(!isEditing)
    },
    {
      id: 'save',
      label: 'Save',
      icon: <SaveIcon />,
      onClick: handleSave,
      disabled: !isEditing
    },
    {
      id: 'print',
      label: 'Print',
      icon: <PrintIcon />,
      onClick: () => window.print()
    },
    {
      id: 'download',
      label: 'Download',
      icon: <DownloadIcon />,
      onClick: () => {
        // Implementation would depend on your download strategy
        console.log('Download', artifact?.title);
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

  // Handle visualization change
  const handleVisualizationChange = (viz) => {
    if (onVisualizationChange) {
      onVisualizationChange(viz);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <TabHeader
        title={artifact?.title || 'Functional Specification'}
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
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs
                value={activeSection}
                onChange={(_, newValue) => setActiveSection(newValue)}
                variant="scrollable"
                scrollButtons="auto"
              >
                {sections.map(section => (
                  <Tab 
                    key={section.id}
                    label={section.label} 
                    value={section.id}
                  />
                ))}
              </Tabs>
            </Box>
            
            <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
              {isEditing ? (
                <MarkdownEditor
                  noteTitle={currentSection?.label}
                  markdownContent={currentContent}
                  onContentChange={handleContentChange}
                  onTitleChange={(newTitle) => {
                    setSections(sections.map(section => 
                      section.id === activeSection 
                        ? { ...section, label: newTitle } 
                        : section
                    ));
                  }}
                  onSave={handleSave}
                  artifactId={artifact.id}
                />
              ) : (
                <Box data-color-mode="light" className="markdown-renderer">
                  <MDEditor.Markdown source={currentContent} />
                </Box>
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

FunctionalSpecViewer.propTypes = {
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
  onVisualizationChange: PropTypes.func,
  onContentUpdate: PropTypes.func
};

export default FunctionalSpecViewer; 