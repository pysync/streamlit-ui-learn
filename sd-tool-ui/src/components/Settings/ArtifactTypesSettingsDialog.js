import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Switch,
    IconButton,
    DialogActions,
    Button,
} from '@mui/material';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ARTIFACT_TYPE_OPTIONS } from '../../constants/sdlcConstants';

// Sortable item component
const SortableTableRow = ({ type, index, onStickyChange }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: type.value });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <TableRow ref={setNodeRef} style={style}>
            <TableCell>
                <IconButton 
                    size="small" 
                    {...attributes} 
                    {...listeners}
                >
                    <DragIndicatorIcon />
                </IconButton>
            </TableCell>
            <TableCell>{type.label}</TableCell>
            <TableCell>Description here...</TableCell>
            <TableCell align="center">
                <Switch
                    checked={type.isSticky}
                    onChange={() => onStickyChange(type.value)}
                    size="small"
                />
            </TableCell>
        </TableRow>
    );
};

const ArtifactTypesSettingsDialog = ({ open, onClose }) => {
    const [artifactTypes, setArtifactTypes] = useState(
        ARTIFACT_TYPE_OPTIONS.map((type, index) => ({
            ...type,
            order: index,
            isSticky: false
        }))
    );

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event) => {
        const { active, over } = event;
        
        if (active.id !== over.id) {
            setArtifactTypes((items) => {
                const oldIndex = items.findIndex(item => item.value === active.id);
                const newIndex = items.findIndex(item => item.value === over.id);
                
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    const handleStickyChange = (value) => {
        setArtifactTypes(artifactTypes.map(type => 
            type.value === value ? { ...type, isSticky: !type.isSticky } : type
        ));
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Artifact Types Settings</DialogTitle>
            <DialogContent>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell width={50}></TableCell>
                                <TableCell>Type</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell align="center">Sticky</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragEnd={handleDragEnd}
                            >
                                <SortableContext
                                    items={artifactTypes.map(type => type.value)}
                                    strategy={verticalListSortingStrategy}
                                >
                                    {artifactTypes.map((type, index) => (
                                        <SortableTableRow
                                            key={type.value}
                                            type={type}
                                            index={index}
                                            onStickyChange={handleStickyChange}
                                        />
                                    ))}
                                </SortableContext>
                            </DndContext>
                        </TableBody>
                    </Table>
                </TableContainer>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={onClose} variant="contained" color="primary">
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ArtifactTypesSettingsDialog; 