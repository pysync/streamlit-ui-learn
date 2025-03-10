import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
    InputAdornment,
    Typography,
    Divider
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import { 
    ARTIFACT_TYPE_OPTIONS, 
    ARTIFACT_TYPE_PHASES, 
    PHASE_LABELS,
    getArtifactTypeLabel 
} from '../../constants/sdlcConstants';
import { useWorkspace } from '../../contexts/WorkspaceContext';

const SearchArtifactDialog = ({ open, onClose, onSelect }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [artifactTypeFilter, setArtifactTypeFilter] = useState('');
    const { artifacts } = useWorkspace();

    // Filter artifacts based on search term and type filter
    const filteredArtifacts = artifacts?.items?.filter(artifact => {
        const matchesSearch = searchTerm === '' || 
            (artifact.title && artifact.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (artifact.document_id && artifact.document_id.toLowerCase().includes(searchTerm.toLowerCase()));
            
        const matchesType = artifactTypeFilter === '' || artifact.art_type === artifactTypeFilter;
        
        return matchesSearch && matchesType;
    }) || [];

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleTypeFilterChange = (event) => {
        setArtifactTypeFilter(event.target.value);
    };

    const handleSelect = (artifact) => {
        onSelect(artifact);
        onClose();
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString();
    };

    // Add grouping function
    const groupedOptions = ARTIFACT_TYPE_OPTIONS.reduce((acc, option) => {
        const phase = ARTIFACT_TYPE_PHASES[option.value];
        if (!acc[phase]) {
            acc[phase] = [];
        }
        acc[phase].push(option);
        return acc;
    }, {});

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Search Artifacts</DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', pt: 1, mb: 2, gap: 2, alignItems: 'center' }}>
                    <TextField
                        label="Search"
                        variant="outlined"
                        size="small"
                        fullWidth
                        value={searchTerm}
                        onChange={handleSearch}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <FormControl variant="outlined" size="small" sx={{ minWidth: 200 }}>
                        <InputLabel>Type</InputLabel>
                        <Select
                            value={artifactTypeFilter}
                            onChange={handleTypeFilterChange}
                            label="Type"
                            startAdornment={
                                <InputAdornment position="start">
                                    <FilterListIcon fontSize="small" />
                                </InputAdornment>
                            }
                        >
                            <MenuItem value="">
                                <em>All Types</em>
                            </MenuItem>
                            {Object.entries(groupedOptions).map(([phase, options]) => [
                                <Divider key={`divider-${phase}`}>
                                    <Typography variant="caption" color="text.secondary">
                                        {PHASE_LABELS[phase]}
                                    </Typography>
                                </Divider>,
                                ...options.map(option => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))
                            ])}
                        </Select>
                    </FormControl>
                </Box>

                {filteredArtifacts.length === 0 ? (
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', my: 4 }}>
                        No artifacts found matching your filters.
                    </Typography>
                ) : (
                    <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
                        <Table stickyHeader size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Title</TableCell>
                                    <TableCell>Type</TableCell>
                                    <TableCell>Updated</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredArtifacts.map((artifact) => (
                                    <TableRow
                                        hover
                                        key={artifact.id}
                                        onClick={() => handleSelect(artifact)}
                                        sx={{ cursor: 'pointer' }}
                                    >
                                        <TableCell>{artifact.title || 'Untitled'}</TableCell>
                                        <TableCell>{getArtifactTypeLabel(artifact.art_type)}</TableCell>
                                        <TableCell>{formatDate(artifact.updated_at)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default SearchArtifactDialog; 