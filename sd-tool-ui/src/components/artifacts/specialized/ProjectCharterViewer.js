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
  Grid,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Chip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FlagIcon from '@mui/icons-material/Flag';
import PeopleIcon from '@mui/icons-material/People';
import TimelineIcon from '@mui/icons-material/Timeline';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import WarningIcon from '@mui/icons-material/Warning';
import MarkdownEditor from '../../common/MarkdownEditor';
import MarkdownViewer from '../../common/MarkdownViewer';
import TabHeader from '../../shared/TabHeader';
import SplitView from '../../shared/SplitView';
import RelatedItemsPanel from '../../shared/RelatedItemsPanel';
import { useWorkspace } from '../../../contexts/WorkspaceContext';
import { ARTIFACT_SCHEMAS } from '../../../constants/artifactSchemas';
import { ARTIFACT_TYPES } from '../../../constants/sdlcConstants';

/**
 * Specialized viewer for Project Charter artifacts
 */
const ProjectCharterViewer = ({
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
  const [stakeholders, setStakeholders] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [risks, setRisks] = useState([]);
  
  // Get the schema for Project Charter
  const schema = ARTIFACT_SCHEMAS[ARTIFACT_TYPES.PROJECT_CHARTER];
  
  // Parse artifact content and initialize data
  useEffect(() => {
    if (artifact) {
      let parsedSections = [];
      let parsedStakeholders = [];
      let parsedMilestones = [];
      let parsedRisks = [];
      
      // Handle different content formats
      if (typeof artifact.content === 'string') {
        try {
          // Try to parse as JSON
          const parsed = JSON.parse(artifact.content);
          if (parsed.sections && Array.isArray(parsed.sections)) {
            parsedSections = parsed.sections;
          }
          if (parsed.stakeholders && Array.isArray(parsed.stakeholders)) {
            parsedStakeholders = parsed.stakeholders;
          }
          if (parsed.milestones && Array.isArray(parsed.milestones)) {
            parsedMilestones = parsed.milestones;
          }
          if (parsed.risks && Array.isArray(parsed.risks)) {
            parsedRisks = parsed.risks;
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
        if (artifact.content.stakeholders && Array.isArray(artifact.content.stakeholders)) {
          parsedStakeholders = artifact.content.stakeholders;
        }
        if (artifact.content.milestones && Array.isArray(artifact.content.milestones)) {
          parsedMilestones = artifact.content.milestones;
        }
        if (artifact.content.risks && Array.isArray(artifact.content.risks)) {
          parsedRisks = artifact.content.risks;
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
      
      setStakeholders(parsedStakeholders);
      setMilestones(parsedMilestones);
      setRisks(parsedRisks);
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
    setContent(prev => ({
      ...prev,
      [sectionId]: newContent
    }));
  };
  
  // Handle save
  const handleSave = () => {
    // Update sections with new content
    const updatedSections = sections.map(section => ({
      ...section,
      content: content[section.id] || ''
    }));
    
    // Create updated content object
    const updatedContent = {
      sections: updatedSections,
      stakeholders,
      milestones,
      risks
    };
    
    // Call onContentUpdate with the new content
    if (onContentUpdate) {
      onContentUpdate(updatedContent);
    }
    
    // Exit edit mode
    setIsEditing(false);
  };
  
  // Header actions
  const headerActions = [
    {
      icon: isEditing ? <SaveIcon /> : <EditIcon />,
      tooltip: isEditing ? 'Save' : 'Edit',
      onClick: isEditing ? handleSave : toggleEditMode,
      disabled: !isEditable
    }
  ];
  
  // Secondary content for split view
  const secondaryContent = (
    <RelatedItemsPanel 
      artifact={artifact}
      onNavigate={navigateToArtifact}
    />
  );
  
  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <TabHeader
        title={artifact?.title || 'Untitled Project Charter'}
        status={artifact?.status}
        lastModified={artifact?.updated_at}
        actions={headerActions}
      />
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Document" />
          <Tab label="Dashboard" />
          <Tab label="Stakeholders" />
          <Tab label="Milestones" />
          <Tab label="Risks" />
        </Tabs>
      </Box>
      
      <SplitView
        direction={layoutMode === 'horizontal' ? 'horizontal' : 'vertical'}
        primaryContent={
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Document view */}
            {activeTab === 0 && (
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
            )}
            
            {/* Dashboard view */}
            {activeTab === 1 && (
              <Box sx={{ p: 2, overflow: 'auto' }}>
                <Grid container spacing={3}>
                  {/* Project Overview */}
                  <Grid item xs={12}>
                    <Card>
                      <CardHeader title="Project Overview" />
                      <CardContent>
                        <MarkdownViewer content={content['overview'] || 'No overview available'} />
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  {/* Vision & Goals */}
                  <Grid item xs={12} md={6}>
                    <Card>
                      <CardHeader 
                        title="Vision & Goals" 
                        avatar={<FlagIcon color="primary" />}
                      />
                      <CardContent>
                        <MarkdownViewer content={content['vision'] || 'No vision statement available'} />
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  {/* Scope */}
                  <Grid item xs={12} md={6}>
                    <Card>
                      <CardHeader title="Project Scope" />
                      <CardContent>
                        <MarkdownViewer content={content['scope'] || 'No scope defined'} />
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  {/* Key Stakeholders */}
                  <Grid item xs={12} md={6}>
                    <Card>
                      <CardHeader 
                        title="Key Stakeholders" 
                        avatar={<PeopleIcon color="primary" />}
                        subheader={`${stakeholders.length} stakeholders identified`}
                      />
                      <CardContent>
                        {stakeholders.length > 0 ? (
                          stakeholders.slice(0, 5).map((stakeholder, index) => (
                            <Box key={index} sx={{ mb: 1 }}>
                              <Typography variant="subtitle2">{stakeholder.name}</Typography>
                              <Typography variant="body2" color="text.secondary">
                                {stakeholder.role} • {stakeholder.organization}
                              </Typography>
                            </Box>
                          ))
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            No stakeholders defined
                          </Typography>
                        )}
                        {stakeholders.length > 5 && (
                          <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
                            +{stakeholders.length - 5} more stakeholders
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  {/* Timeline */}
                  <Grid item xs={12} md={6}>
                    <Card>
                      <CardHeader 
                        title="Timeline" 
                        avatar={<TimelineIcon color="primary" />}
                        subheader={`${milestones.length} milestones defined`}
                      />
                      <CardContent>
                        {milestones.length > 0 ? (
                          milestones.slice(0, 5).map((milestone, index) => (
                            <Box key={index} sx={{ mb: 1 }}>
                              <Typography variant="subtitle2">{milestone.name}</Typography>
                              <Typography variant="body2" color="text.secondary">
                                {milestone.date} • {milestone.description}
                              </Typography>
                            </Box>
                          ))
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            No milestones defined
                          </Typography>
                        )}
                        {milestones.length > 5 && (
                          <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
                            +{milestones.length - 5} more milestones
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  {/* Budget */}
                  <Grid item xs={12} md={6}>
                    <Card>
                      <CardHeader 
                        title="Budget" 
                        avatar={<AttachMoneyIcon color="primary" />}
                      />
                      <CardContent>
                        <MarkdownViewer content={content['budget'] || 'No budget information available'} />
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  {/* Risks */}
                  <Grid item xs={12} md={6}>
                    <Card>
                      <CardHeader 
                        title="Key Risks" 
                        avatar={<WarningIcon color="error" />}
                        subheader={`${risks.length} risks identified`}
                      />
                      <CardContent>
                        {risks.length > 0 ? (
                          risks.slice(0, 5).map((risk, index) => (
                            <Box key={index} sx={{ mb: 1 }}>
                              <Typography variant="subtitle2">
                                {risk.description}
                                <Chip 
                                  label={risk.severity || 'Medium'} 
                                  size="small" 
                                  color={
                                    risk.severity === 'High' ? 'error' : 
                                    risk.severity === 'Medium' ? 'warning' : 
                                    'success'
                                  }
                                  sx={{ ml: 1 }}
                                />
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {risk.mitigation || 'No mitigation strategy defined'}
                              </Typography>
                            </Box>
                          ))
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            No risks defined
                          </Typography>
                        )}
                        {risks.length > 5 && (
                          <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
                            +{risks.length - 5} more risks
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            )}
            
            {/* Stakeholders view */}
            {activeTab === 2 && (
              <Box sx={{ p: 2, overflow: 'auto' }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Project Stakeholders</Typography>
                
                {stakeholders.length > 0 ? (
                  <Grid container spacing={2}>
                    {stakeholders.map((stakeholder, index) => (
                      <Grid item xs={12} md={6} lg={4} key={index}>
                        <Card>
                          <CardContent>
                            <Typography variant="h6">{stakeholder.name}</Typography>
                            <Typography variant="subtitle1" color="text.secondary">
                              {stakeholder.role}
                            </Typography>
                            <Divider sx={{ my: 1 }} />
                            <Typography variant="body2">
                              <strong>Organization:</strong> {stakeholder.organization}
                            </Typography>
                            {stakeholder.email && (
                              <Typography variant="body2">
                                <strong>Email:</strong> {stakeholder.email}
                              </Typography>
                            )}
                            {stakeholder.influence && (
                              <Typography variant="body2">
                                <strong>Influence:</strong> {stakeholder.influence}
                              </Typography>
                            )}
                            {stakeholder.interest && (
                              <Typography variant="body2">
                                <strong>Interest:</strong> {stakeholder.interest}
                              </Typography>
                            )}
                            {stakeholder.expectations && (
                              <Box sx={{ mt: 1 }}>
                                <Typography variant="body2">
                                  <strong>Expectations:</strong>
                                </Typography>
                                <Typography variant="body2">
                                  {stakeholder.expectations}
                                </Typography>
                              </Box>
                            )}
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center' }}>
                    No stakeholders defined for this project
                  </Typography>
                )}
              </Box>
            )}
            
            {/* Milestones view */}
            {activeTab === 3 && (
              <Box sx={{ p: 2, overflow: 'auto' }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Project Milestones</Typography>
                
                {milestones.length > 0 ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {milestones.map((milestone, index) => (
                      <Paper key={index} sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="h6">{milestone.name}</Typography>
                          <Chip 
                            label={milestone.date} 
                            color="primary" 
                            variant="outlined"
                          />
                        </Box>
                        <Typography variant="body1" sx={{ mt: 1 }}>
                          {milestone.description}
                        </Typography>
                        {milestone.deliverables && (
                          <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle2">Deliverables:</Typography>
                            <Typography variant="body2">
                              {milestone.deliverables}
                            </Typography>
                          </Box>
                        )}
                        {milestone.criteria && (
                          <Box sx={{ mt: 1 }}>
                            <Typography variant="subtitle2">Acceptance Criteria:</Typography>
                            <Typography variant="body2">
                              {milestone.criteria}
                            </Typography>
                          </Box>
                        )}
                      </Paper>
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center' }}>
                    No milestones defined for this project
                  </Typography>
                )}
              </Box>
            )}
            
            {/* Risks view */}
            {activeTab === 4 && (
              <Box sx={{ p: 2, overflow: 'auto' }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Project Risks</Typography>
                
                {risks.length > 0 ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {risks.map((risk, index) => (
                      <Paper key={index} sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="h6">{risk.description}</Typography>
                          <Chip 
                            label={risk.severity || 'Medium'} 
                            color={
                              risk.severity === 'High' ? 'error' : 
                              risk.severity === 'Medium' ? 'warning' : 
                              'success'
                            }
                          />
                        </Box>
                        
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
                          <Box>
                            <Typography variant="caption" color="text.secondary">Probability</Typography>
                            <Typography variant="body2">{risk.probability || 'Unknown'}</Typography>
                          </Box>
                          
                          <Box>
                            <Typography variant="caption" color="text.secondary">Impact</Typography>
                            <Typography variant="body2">{risk.impact || 'Unknown'}</Typography>
                          </Box>
                          
                          <Box>
                            <Typography variant="caption" color="text.secondary">Owner</Typography>
                            <Typography variant="body2">{risk.owner || 'Unassigned'}</Typography>
                          </Box>
                        </Box>
                        
                        {risk.mitigation && (
                          <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle2">Mitigation Strategy:</Typography>
                            <Typography variant="body2">
                              {risk.mitigation}
                            </Typography>
                          </Box>
                        )}
                        
                        {risk.contingency && (
                          <Box sx={{ mt: 1 }}>
                            <Typography variant="subtitle2">Contingency Plan:</Typography>
                            <Typography variant="body2">
                              {risk.contingency}
                            </Typography>
                          </Box>
                        )}
                      </Paper>
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center' }}>
                    No risks defined for this project
                  </Typography>
                )}
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

ProjectCharterViewer.propTypes = {
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

export default ProjectCharterViewer; 