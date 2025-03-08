import React from 'react';
import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    IconButton,
    Tooltip,
    Link,
} from '@mui/material';
import {
    getArtifactTypeLabel,
    getArtifactIcon,
    ARTIFACT_TYPE_DESCRIPTIONS
} from '../../constants/sdlcConstants';
import EditIcon from '@mui/icons-material/Edit';
import { useWorkspace } from '../../contexts/WorkspaceContext';

const ArtifactTypeList = ({ artifactType }) => {
    const { artifacts, selectArtifact, addOpenedArtifact } = useWorkspace();

    const typeArtifacts = React.useMemo(() => {
        return artifacts?.items?.filter(art => art.art_type === artifactType) || [];
    }, [artifacts, artifactType]);

    const handleArtifactClick = (artifact) => {
        addOpenedArtifact(artifact);
        selectArtifact(artifact.document_id);
    };

    const typeLabel = getArtifactTypeLabel(artifactType);

    return (
        <Box sx={{ height: '100%', overflow: 'auto' }}>
            <Box sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ mr: 2 }}>{getArtifactIcon(artifactType)}</Box>
                    <Typography variant="h5">
                        {typeLabel} List
                    </Typography>
                </Box>

                <Typography variant="body2" color="text.secondary" paragraph>
                    {ARTIFACT_TYPE_DESCRIPTIONS[artifactType]}
                </Typography>

                <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                        <TableHead>
                            <TableRow sx={{ backgroundColor: 'action.hover' }}>
                                <TableCell>Title</TableCell>
                                <TableCell>Last Modified</TableCell>
                                <TableCell width={100} align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {typeArtifacts.map((artifact) => (
                                <TableRow key={artifact.document_id} hover>
                                    <TableCell>
                                        <Link
                                            component="button"
                                            variant="body2"
                                            onClick={() => handleArtifactClick(artifact)}
                                            sx={{
                                                textAlign: 'left',
                                                textDecoration: 'none',
                                                '&:hover': {
                                                    textDecoration: 'underline',
                                                    cursor: 'pointer'
                                                }
                                            }}
                                        >
                                            {artifact.title || 'Untitled'}
                                        </Link>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" color="text.secondary">
                                            {new Date(artifact.updated_at).toLocaleString()}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Tooltip title="Open in New Tab">
                                            <IconButton
                                                size="small"
                                                onClick={() => handleArtifactClick(artifact)}
                                                sx={{
                                                    '&:hover': {
                                                        color: 'primary.main'
                                                    }
                                                }}
                                            >
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Box>
    );
};

export default ArtifactTypeList; 