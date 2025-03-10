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
  Card,
  CardContent,
  CardActions,
  Chip,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import AssignmentIcon from '@mui/icons-material/Assignment';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import MarkdownEditor from '../../common/MarkdownEditor';
import MarkdownViewer from '../../common/MarkdownViewer';
import TabHeader from '../../shared/TabHeader';
import SplitView from '../../shared/SplitView';
import RelatedItemsPanel from '../../shared/RelatedItemsPanel';
import { useWorkspace } from '../../../contexts/WorkspaceContext';
import { ARTIFACT_SCHEMAS } from '../../../constants/artifactSchemas';
import { ARTIFACT_TYPES } from '../../../constants/sdlcConstants';

/**
 * Specialized viewer for User Stories artifacts
 */
const UserStoriesViewer = ({
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
  const [stories, setStories] = useState([]);
  const [selectedStory, setSelectedStory] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editStory, setEditStory] = useState(null);
  
  // Get the schema for User Stories
  const schema = ARTIFACT_SCHEMAS[ARTIFACT_TYPES.USER_STORIES];
  
  // Parse artifact content and initialize data
  useEffect(() => {
    if (artifact) {
      let parsedStories = [];
      
      // Handle different content formats
      if (typeof artifact.content === 'string') {
        try {
          // Try to parse as JSON
          const parsed = JSON.parse(artifact.content);
          if (parsed.stories && Array.isArray(parsed.stories)) {
            parsedStories = parsed.stories;
          }
        } catch (e) {
          console.warn('Failed to parse artifact content as JSON:', e);
          // If not JSON, create a placeholder
          parsedStories = [];
        }
      } else if (artifact.content) {
        // Already parsed object
        if (artifact.content.stories && Array.isArray(artifact.content.stories)) {
          parsedStories = artifact.content.stories;
        }
      }
      
      // If no stories, use default from schema
      if (parsedStories.length === 0 && schema?.default?.stories) {
        parsedStories = schema.default.stories;
      }
      
      setStories(parsedStories);
      
      // Set selected story to first story if not already set
      if ((!selectedStory || !parsedStories.find(s => s.id === selectedStory)) && parsedStories.length > 0) {
        setSelectedStory(parsedStories[0].id);
      }
    }
  }, [artifact, schema, selectedStory]);
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  // Handle story selection
  const handleStorySelect = (storyId) => {
    setSelectedStory(storyId);
  };
  
  // Toggle edit mode
  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };
  
  // Handle save
  const handleSave = () => {
    if (!artifact) return;
    
    const updatedContent = {
      stories
    };
    
    onContentUpdate(updatedContent);
    setIsEditing(false);
  };
  
  // Open dialog to add/edit story
  const handleAddStory = () => {
    setEditStory({
      id: `story-${Date.now()}`,
      title: '',
      description: '',
      acceptanceCriteria: '',
      priority: 'medium',
      status: 'new',
      assignee: '',
      points: 0,
      tags: []
    });
    setDialogOpen(true);
  };
  
  // Open dialog to edit story
  const handleEditStory = (story) => {
    setEditStory({ ...story });
    setDialogOpen(true);
  };
  
  // Handle story change in dialog
  const handleStoryChange = (field, value) => {
    setEditStory(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Save story from dialog
  const handleSaveStory = () => {
    if (!editStory) return;
    
    const storyIndex = stories.findIndex(s => s.id === editStory.id);
    
    if (storyIndex >= 0) {
      // Update existing story
      const updatedStories = [...stories];
      updatedStories[storyIndex] = editStory;
      setStories(updatedStories);
    } else {
      // Add new story
      setStories([...stories, editStory]);
    }
    
    setDialogOpen(false);
    setEditStory(null);
  };
  
  // Delete story
  const handleDeleteStory = (storyId) => {
    const updatedStories = stories.filter(s => s.id !== storyId);
    setStories(updatedStories);
    
    if (selectedStory === storyId && updatedStories.length > 0) {
      setSelectedStory(updatedStories[0].id);
    } else if (updatedStories.length === 0) {
      setSelectedStory(null);
    }
  };
  
  // Get selected story data
  const getSelectedStoryData = () => {
    return stories.find(s => s.id === selectedStory) || null;
  };
  
  // Create header actions array for TabHeader
  const headerActions = [
    {
      icon: isEditing ? <SaveIcon /> : <EditIcon />,
      tooltip: isEditing ? "Save" : "Edit",
      onClick: isEditing ? handleSave : toggleEditMode,
      disabled: !isEditable
    },
    {
      icon: <VisibilityIcon />,
      tooltip: "View",
      onClick: () => {},
      disabled: isEditing
    }
  ];
  
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
        title={artifact?.title || 'User Stories'}
        actions={headerActions}
      />
      
      <SplitView
        direction={layoutMode === 'horizontal' ? 'horizontal' : 'vertical'}
        primaryContent={
          <Box sx={{ 
            p: 0, 
            height: '100%', 
            display: 'flex',
            flexDirection: 'column'
          }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={activeTab} onChange={handleTabChange}>
                <Tab label="Stories" icon={<AssignmentIcon />} iconPosition="start" />
                <Tab label="Backlog" icon={<FormatListBulletedIcon />} iconPosition="start" />
              </Tabs>
            </Box>
            
            {/* Stories view */}
            {activeTab === 0 && (
              <Box sx={{ display: 'flex', height: 'calc(100% - 48px)' }}>
                <Box sx={{ width: 250, borderRight: 1, borderColor: 'divider', overflow: 'auto' }}>
                  {isEditing && (
                    <Button
                      variant="outlined"
                      startIcon={<AddIcon />}
                      onClick={handleAddStory}
                      sx={{ m: 1, width: 'calc(100% - 16px)' }}
                    >
                      Add Story
                    </Button>
                  )}
                  
                  {stories.length > 0 ? (
                    <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                      {stories.map((story) => (
                        <Box 
                          component="li" 
                          key={story.id}
                          sx={{ 
                            p: 1,
                            cursor: 'pointer',
                            backgroundColor: selectedStory === story.id ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
                            '&:hover': {
                              backgroundColor: 'rgba(0, 0, 0, 0.08)'
                            }
                          }}
                          onClick={() => handleStorySelect(story.id)}
                        >
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="subtitle2" noWrap>
                              {story.title || 'Untitled Story'}
                            </Typography>
                            
                            <Chip 
                              label={story.status || 'new'} 
                              size="small"
                              color={
                                story.status === 'completed' ? 'success' :
                                story.status === 'in-progress' ? 'primary' :
                                story.status === 'blocked' ? 'error' :
                                'default'
                              }
                            />
                          </Box>
                          
                          {story.assignee && (
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                              <PersonIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                              <Typography variant="caption" color="text.secondary">
                                {story.assignee}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      ))}
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>
                      No stories defined
                    </Typography>
                  )}
                </Box>
                
                <Box sx={{ flexGrow: 1, p: 2, overflow: 'auto' }}>
                  {selectedStory ? (
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Typography variant="h5">
                          {getSelectedStoryData()?.title || 'Untitled Story'}
                        </Typography>
                        
                        {isEditing && (
                          <Box>
                            <IconButton onClick={() => handleEditStory(getSelectedStoryData())}>
                              <EditIcon />
                            </IconButton>
                            <IconButton onClick={() => handleDeleteStory(selectedStory)}>
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        )}
                      </Box>
                      
                      <Grid container spacing={2} sx={{ mb: 3 }}>
                        <Grid item xs={6} sm={3}>
                          <Typography variant="caption" color="text.secondary">Status</Typography>
                          <Typography variant="body1">
                            {getSelectedStoryData()?.status || 'New'}
                          </Typography>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Typography variant="caption" color="text.secondary">Priority</Typography>
                          <Typography variant="body1">
                            {getSelectedStoryData()?.priority || 'Medium'}
                          </Typography>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Typography variant="caption" color="text.secondary">Assignee</Typography>
                          <Typography variant="body1">
                            {getSelectedStoryData()?.assignee || 'Unassigned'}
                          </Typography>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Typography variant="caption" color="text.secondary">Points</Typography>
                          <Typography variant="body1">
                            {getSelectedStoryData()?.points || '0'}
                          </Typography>
                        </Grid>
                      </Grid>
                      
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="h6" sx={{ mb: 1 }}>Description</Typography>
                        <Paper variant="outlined" sx={{ p: 2 }}>
                          <MarkdownViewer content={getSelectedStoryData()?.description || ''} />
                        </Paper>
                      </Box>
                      
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="h6" sx={{ mb: 1 }}>Acceptance Criteria</Typography>
                        <Paper variant="outlined" sx={{ p: 2 }}>
                          <MarkdownViewer content={getSelectedStoryData()?.acceptanceCriteria || ''} />
                        </Paper>
                      </Box>
                      
                      {getSelectedStoryData()?.tags && getSelectedStoryData().tags.length > 0 && (
                        <Box sx={{ mb: 3 }}>
                          <Typography variant="h6" sx={{ mb: 1 }}>Tags</Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {getSelectedStoryData().tags.map((tag, index) => (
                              <Chip key={index} label={tag} />
                            ))}
                          </Box>
                        </Box>
                      )}
                    </Box>
                  ) : (
                    <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center' }}>
                      {stories.length > 0 ? 'Select a story to view details' : 'No stories defined'}
                    </Typography>
                  )}
                </Box>
              </Box>
            )}
            
            {/* Backlog view */}
            {activeTab === 1 && (
              <Box sx={{ p: 2, overflow: 'auto' }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Product Backlog</Typography>
                
                {stories.length > 0 ? (
                  <Box>
                    {['high', 'medium', 'low'].map(priority => {
                      const priorityStories = stories.filter(s => (s.priority || 'medium').toLowerCase() === priority);
                      
                      if (priorityStories.length === 0) return null;
                      
                      return (
                        <Box key={priority} sx={{ mb: 3 }}>
                          <Typography variant="subtitle1" sx={{ 
                            mb: 1,
                            color: priority === 'high' ? 'error.main' : 
                                  priority === 'medium' ? 'warning.main' : 
                                  'success.main'
                          }}>
                            {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
                          </Typography>
                          
                          {priorityStories.map(story => (
                            <Card key={story.id} sx={{ mb: 1 }}>
                              <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                  <Typography variant="h6" component="div">
                                    {story.title || 'Untitled Story'}
                                  </Typography>
                                  
                                  <Chip 
                                    label={story.status || 'new'} 
                                    size="small"
                                    color={
                                      story.status === 'completed' ? 'success' :
                                      story.status === 'in-progress' ? 'primary' :
                                      story.status === 'blocked' ? 'error' :
                                      'default'
                                    }
                                  />
                                </Box>
                                
                                {story.description && (
                                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                    {story.description.length > 100 ? 
                                      `${story.description.substring(0, 100)}...` : 
                                      story.description}
                                  </Typography>
                                )}
                                
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    {story.assignee && (
                                      <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                                        <PersonIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                                        <Typography variant="caption" color="text.secondary">
                                          {story.assignee}
                                        </Typography>
                                      </Box>
                                    )}
                                    
                                    {story.points > 0 && (
                                      <Chip 
                                        label={`${story.points} ${story.points === 1 ? 'point' : 'points'}`} 
                                        size="small" 
                                        variant="outlined"
                                      />
                                    )}
                                  </Box>
                                  
                                  <Button 
                                    size="small" 
                                    onClick={() => {
                                      handleStorySelect(story.id);
                                      setActiveTab(0);
                                    }}
                                  >
                                    View Details
                                  </Button>
                                </Box>
                              </CardContent>
                            </Card>
                          ))}
                        </Box>
                      );
                    })}
                  </Box>
                ) : (
                  <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center' }}>
                    No stories in the backlog
                  </Typography>
                )}
              </Box>
            )}
          </Box>
        }
        secondaryContent={secondaryContent}
        showSecondary={layoutMode !== 'single' && !!secondaryContent}
      />
      
      {/* Add/Edit Story Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editStory?.id && stories.some(s => s.id === editStory.id) ? 'Edit Story' : 'Add Story'}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            fullWidth
            margin="normal"
            value={editStory?.title || ''}
            onChange={(e) => handleStoryChange('title', e.target.value)}
          />
          
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Status</InputLabel>
                <Select
                  value={editStory?.status || 'new'}
                  label="Status"
                  onChange={(e) => handleStoryChange('status', e.target.value)}
                >
                  <MenuItem value="new">New</MenuItem>
                  <MenuItem value="ready">Ready</MenuItem>
                  <MenuItem value="in-progress">In Progress</MenuItem>
                  <MenuItem value="blocked">Blocked</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Priority</InputLabel>
                <Select
                  value={editStory?.priority || 'medium'}
                  label="Priority"
                  onChange={(e) => handleStoryChange('priority', e.target.value)}
                >
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="low">Low</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Assignee"
                fullWidth
                margin="normal"
                value={editStory?.assignee || ''}
                onChange={(e) => handleStoryChange('assignee', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Story Points"
                type="number"
                fullWidth
                margin="normal"
                value={editStory?.points || 0}
                onChange={(e) => handleStoryChange('points', parseInt(e.target.value) || 0)}
              />
            </Grid>
          </Grid>
          
          <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>Description</Typography>
          <TextField
            multiline
            rows={4}
            fullWidth
            placeholder="As a [user type], I want to [action] so that [benefit]"
            value={editStory?.description || ''}
            onChange={(e) => handleStoryChange('description', e.target.value)}
          />
          
          <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>Acceptance Criteria</Typography>
          <TextField
            multiline
            rows={4}
            fullWidth
            placeholder="Given [context], when [action], then [result]"
            value={editStory?.acceptanceCriteria || ''}
            onChange={(e) => handleStoryChange('acceptanceCriteria', e.target.value)}
          />
          
          <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>Tags (comma separated)</Typography>
          <TextField
            fullWidth
            placeholder="frontend, api, ux"
            value={(editStory?.tags || []).join(', ')}
            onChange={(e) => handleStoryChange('tags', e.target.value.split(',').map(tag => tag.trim()).filter(Boolean))}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveStory} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

UserStoriesViewer.propTypes = {
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

export default UserStoriesViewer; 