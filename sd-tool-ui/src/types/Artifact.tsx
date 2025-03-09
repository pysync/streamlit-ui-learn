/**
 * Standard Artifact Interface
 */
export interface Artifact {
  // Common Properties
  id: string;               // Unique identifier
  document_id: string;      // Document ID
  type: string;             // Artifact type
  title: string;            // Title
  content: any;             // Content (string or object)
  version: string|number;   // Version number
  status: string;           // Status
  lastModified: string;     // Last modified timestamp
  references: Array<{       // References to other artifacts
    id: string,
    type: string,
    relationship: string
  }>;
  visualizations: Array<{   // Available visualizations
    id: string,
    type: string,
    config: object
  }>;
} 