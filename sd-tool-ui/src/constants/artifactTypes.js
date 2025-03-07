// src/constants/artifactTypes.js

export const ARTIFACT_TYPES = [
  { value: 'note', label: 'Note' },
  { value: 'document', label: 'Document (SRS)' },
  { value: 'basic_design', label: 'Basic Design' },
  { value: 'detail_design', label: 'Detail Design' },
  { value: 'api_list', label: 'API List' },
  { value: 'screen_list', label: 'Screen List' },
  { value: 'database_schema', label: 'Database Schema' },
  { value: 'sequence_diagram', label: 'Sequence Diagram' },
  { value: 'class_diagram', label: 'Class Diagram' },
  { value: 'use_case', label: 'Use Case' },
  { value: 'other', label: 'Other' }
];

export const getArtifactTypeLabel = (value) => {
  const type = ARTIFACT_TYPES.find(type => type.value === value);
  return type ? type.label : value;
};

export const getFileExtension = (artifactType) => {
  const extensionMap = {
    'note': '.md',
    'document': '.md',
    'basic_design': '.md',
    'detail_design': '.md',
    'api_list': '.json',
    'screen_list': '.json',
    'database_schema': '.json',
    'sequence_diagram': '.excalidraw',
    'class_diagram': '.excalidraw',
    'use_case': '.md',
    'other': '.txt'
  };
  
  return extensionMap[artifactType] || '.txt';
};