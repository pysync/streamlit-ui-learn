import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    Paper,
    Typography,
    IconButton,
    Tooltip,
    ButtonGroup,
} from '@mui/material';
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels';
import MarkdownEditor from '../../Shared/MarkdownEditor';
import ExcalidrawComponent from '../../Shared/ExcalidrawComponent';
import BacklogBoard from '../../Shared/BacklogBoard';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useWorkspace } from '../../../contexts/WorkspaceContext';
import { useLoading } from '../../../contexts/LoadingContext';
import { useMessage } from '../../../contexts/MessageContext';
import { ARTIFACT_TYPES } from '../../../constants/sdlcConstants';
import { useEditor } from '../../../contexts/EditorContext';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import VerticalSplitIcon from '@mui/icons-material/VerticalSplit';
import HorizontalSplitIcon from '@mui/icons-material/HorizontalSplit';
import TableRowsIcon from '@mui/icons-material/TableRows';
import ArtifactRendererFactory from '../ArtifactRendererFactory';
import { getDefaultVisualization, ARTIFACT_VISUALIZATIONS } from '../../../constants/artifactVisualizations';
import PropTypes from 'prop-types';

/**
 * Renders a Project Plan artifact with specialized editing capabilities
 */
const ProjectPlanRenderer = ({
  artifact,
  visualization,
  visualizations,
  isEditable = false,
  onVisualizationChange,
  onContentUpdate,
  layoutMode = 'single'
}) => {
    const [isNotesPaneVisible, setIsNotesPaneVisible] = useState(true);
    const [isWireframePaneVisible, setIsWireframePaneVisible] = useState(false);
    const panelGroupRef = useRef(null);

    const [noteMarkdownContent, setNoteMarkdownContent] = useState('');
    const [noteTitle, setNoteTitle] = useState('Idea Note');
    const [isFullScreen, setIsFullScreen] = useState(false);

    const { showLoading, hideLoading } = useLoading();
    const { showSuccess, showError, clearMessage } = useMessage();

    const { 
        currentWorkspace, 
        execCreateArtifact,
        execUpdateArtifact, 
        openedArtifacts,
        removeOpenedArtifact, 
        activeArtifactDocumentId,
        selectArtifact,
        addNewEmptyArtifactToOpenedList,
        setActiveArtifactDocumentId,
        updateOpenedArtifactInList,
        activeArtifact
    } = useWorkspace();

    const { registerSaveHandler, registerFullscreenHandler } = useEditor();

    useEffect(() => {
        if (artifact) {
            try {
                let contentObj = artifact.content;
                if (typeof contentObj === 'string') {
                    contentObj = JSON.parse(contentObj);
                }
                
                setNoteMarkdownContent(contentObj.markdown || '');
                setNoteTitle(artifact.title || 'Project Plan');
            } catch (e) {
                console.error("Error parsing artifact content:", e);
                setNoteMarkdownContent(artifact.content || '');
                setNoteTitle(artifact.title || 'Project Plan');
            }
        }
    }, [artifact]);

    const handleNoteContentChange = (content) => {
        setNoteMarkdownContent(content);
        
        if (onContentUpdate) {
            onContentUpdate({
                markdown: content
            });
        }
    };

    const handleNoteTitleChange = (title) => {
        setNoteTitle(title);
        
        if (artifact && isEditable) {
            execUpdateArtifact(artifact.document_id, {
                ...artifact,
                title: title
            });
        }
    };

    const handleSaveNote = () => {
        if (!artifact) return;
        
        showLoading();
        execUpdateArtifact(artifact.document_id, {
            ...artifact,
            title: noteTitle,
            content: JSON.stringify({
                markdown: noteMarkdownContent
            })
        })
        .then(() => {
            showSuccess("Project plan saved successfully");
        })
        .catch((error) => {
            showError("Failed to save project plan: " + error.toString());
        })
        .finally(() => {
            hideLoading();
        });
    };

    return (
        <Box 
            id="project-plan-renderer"
            sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
        >
            <Box sx={{ flexGrow: 1, display: 'flex', overflow: 'hidden' }}>
                <PanelGroup 
                    direction={layoutMode === 'horizontal' ? 'vertical' : 'horizontal'}
                    ref={panelGroupRef}
                >
                    {isNotesPaneVisible && (
                        <Panel
                            className="panel-item"
                            minSize={20}
                            defaultSize={isWireframePaneVisible ? 50 : 100}
                        >
                            <Box sx={{ height: '100%', overflow: 'auto' }}>
                                <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
                                    <MarkdownEditor
                                        noteTitle={noteTitle}
                                        markdownContent={noteMarkdownContent}
                                        onContentChange={handleNoteContentChange}
                                        onTitleChange={handleNoteTitleChange}
                                        onSave={handleSaveNote}
                                        artifactId={artifact?.document_id}
                                        activeArtifact={artifact}
                                    />
                                </Paper>
                            </Box>
                        </Panel>
                    )}
                    
                    {isNotesPaneVisible && isWireframePaneVisible && (
                        <PanelResizeHandle className="resizer" />
                    )}

                    {isWireframePaneVisible && (
                        <Panel
                            className="panel-item"
                            minSize={20}
                            defaultSize={isNotesPaneVisible ? 50 : 100}
                        >
                            <Box sx={{ height: '100%', overflow: 'auto' }}>
                                <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
                                    <Typography variant="h6" gutterBottom>Draft Wireframe</Typography>
                                    <ExcalidrawComponent />
                                </Paper>
                            </Box>
                        </Panel>
                    )}
                </PanelGroup>
            </Box>
        </Box>
    );
};

ProjectPlanRenderer.propTypes = {
  artifact: PropTypes.shape({
    id: PropTypes.number,
    document_id: PropTypes.string.isRequired,
    art_type: PropTypes.string.isRequired,
    title: PropTypes.string,
    content: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    dependencies: PropTypes.object,
    version: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    status: PropTypes.string,
    updated_at: PropTypes.string
  }).isRequired,
  visualization: PropTypes.object,
  visualizations: PropTypes.array,
  isEditable: PropTypes.bool,
  onVisualizationChange: PropTypes.func,
  onContentUpdate: PropTypes.func,
  layoutMode: PropTypes.string
};

export default ProjectPlanRenderer; 