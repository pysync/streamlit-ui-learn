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
} from '@mui/material';
import {
    getArtifactTypeLabel,
    getArtifactIcon,
    ARTIFACT_TYPE_DESCRIPTIONS
} from '../../constants/sdlcConstants';
import EditIcon from '@mui/icons-material/Edit';
import { useWorkspace } from '../../contexts/WorkspaceContext';

const ArtifactTypeList = ({ artifactType }) => {
    const { artifacts, selectArtifact } = useWorkspace();

    const typeArtifacts = React.useMemo(() => {
        return artifacts?.items?.filter(art => art.art_type === artifactType) || [];
    }, [artifacts, artifactType]);

    const handleArtifactClick = (artifact) => {
        selectArtifact(artifact.document_id);
    };

    return (
        <Box sx={{ height: '100%', overflow: 'auto' }}>
            <Box sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ mr: 2 }}>{getArtifactIcon(artifactType)}</Box>
                    <Typography variant="h5">
                        {getArtifactTypeLabel(artifactType)}
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
                                        <Typography variant="body2">
                                            {artifact.title || 'Untitled'}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" color="text.secondary">
                                            {new Date(artifact.updated_at).toLocaleString()}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Tooltip title="Open">
                                            <IconButton
                                                size="small"
                                                onClick={() => handleArtifactClick(artifact)}
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