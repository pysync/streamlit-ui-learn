// src/components/Artifact/ArtifactSelectDialog.js
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
  Chip,
  InputAdornment,
  IconButton,
  Divider,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import { 
  ARTIFACT_TYPE_OPTIONS, 
  ARTIFACT_TYPE_TO_PHASE, 
  PHASE_LABELS,
  getArtifactTypeLabel 
} from '../../constants/sdlcConstants';
import { useWorkspace } from '../../contexts/WorkspaceContext';
import { useLoading } from '../../contexts/LoadingContext';
import { useMessage } from '../../contexts/MessageContext';

/**
 * A reusable dialog component for selecting artifacts
 * @param {boolean} open - Whether the dialog is open
 * @param {function} onClose - Function to call when dialog is closed
 * @param {array} selectedArtifacts - Array of already selected artifact IDs
 * @param {function} onSelect - Function to call with selected artifact IDs
 */
const ArtifactSelectDialog = ({ open, onClose, selectedArtifacts = [], onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [artifactTypeFilter, setArtifactTypeFilter] = useState('');
  const [artifactsData, setArtifactsData] = useState([]);
  const [selected, setSelected] = useState([]); // keep track ids
  const { currentWorkspace, artifacts } = useWorkspace();
  const { showLoading, hideLoading } = useLoading();
  const { showError } = useMessage();

  // Initialize selected artifacts from props
  useEffect(() => {
    if (selectedArtifacts && selectedArtifacts.length > 0) {
      setSelected(selectedArtifacts);
    } else {
      setSelected([]);
    }
  }, [selectedArtifacts, open]);

  // Load artifacts when dialog opens
  useEffect(() => {
    if (open && artifacts && artifacts.items) {
      setArtifactsData(artifacts.items);
    }
  }, [open, artifacts]);

  // Filter artifacts based on search term and type filter
  const filteredArtifacts = artifactsData.filter(artifact => {
    const matchesSearch = searchTerm === '' || 
      (artifact.title && artifact.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (artifact.document_id && artifact.document_id.toLowerCase().includes(searchTerm.toLowerCase()));
      
    const matchesType = artifactTypeFilter === '' || artifact.art_type === artifactTypeFilter;
    
    return matchesSearch && matchesType;
  });

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleTypeFilterChange = (event) => {
    setArtifactTypeFilter(event.target.value);
  };

  const handleToggle = (artId) => { // by dc id
    const currentIndex = selected.indexOf(artId);
    const newSelected = [...selected];
    
    if (currentIndex === -1) {
      newSelected.push(artId);
    } else {
      newSelected.splice(currentIndex, 1);
    }
    
    setSelected(newSelected);
  };

  const handleSelectConfirm = () => {
    onSelect(selected);
    onClose();
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Add grouping function
  const groupedOptions = ARTIFACT_TYPE_OPTIONS.reduce((acc, option) => {
    const phase = ARTIFACT_TYPE_TO_PHASE[option.value];
    if (!acc[phase]) {
      acc[phase] = [];
    }
    acc[phase].push(option);
    return acc;
  }, {});

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Select references</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex',  pt: 1, mb: 2, gap: 2, alignItems: 'center' }}>
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
                  <TableCell padding="checkbox">
                    <Checkbox
                      disabled
                      indeterminate={selected.length > 0 && selected.length < filteredArtifacts.length}
                      checked={filteredArtifacts.length > 0 && selected.length === filteredArtifacts.length}
                    />
                  </TableCell>
                  <TableCell>Document ID</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Updated</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredArtifacts.map((artifact) => {
                  const isSelected = selected.indexOf(artifact.id) !== -1;
                  
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      aria-checked={isSelected}
                      tabIndex={-1}
                      key={artifact.id}
                      selected={isSelected}
                      onClick={() => handleToggle(artifact.id)}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox checked={isSelected} />
                      </TableCell>
                      <TableCell>{artifact.document_id}</TableCell>
                      <TableCell>{artifact.title}</TableCell>
                      <TableCell>{getArtifactTypeLabel(artifact.art_type)}</TableCell>
                      <TableCell>{formatDate(artifact.updated_at)}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Selected: {selected.length}
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {selected.length > 0 && artifactsData.filter(a => selected.includes(a.id)).map(artifact => (
              <Chip 
                key={artifact.document_id}
                label={artifact.title || artifact.document_id}
                onDelete={() => handleToggle(artifact.id)}
                color="primary"
                variant="outlined"
                size="small"
              />
            ))}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSelectConfirm} variant="contained" color="primary">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ArtifactSelectDialog;