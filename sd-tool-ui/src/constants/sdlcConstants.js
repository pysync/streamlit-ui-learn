import NoteIcon from '@mui/icons-material/Note';
import DescriptionIcon from '@mui/icons-material/Description';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import ApiIcon from '@mui/icons-material/Api';
import ListAltIcon from '@mui/icons-material/ListAlt';
import StorageIcon from '@mui/icons-material/Storage';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import BugReportIcon from '@mui/icons-material/BugReport';
import AssignmentIcon from '@mui/icons-material/Assignment';
import TimelineIcon from '@mui/icons-material/Timeline';
import WarningIcon from '@mui/icons-material/Warning';
import WebIcon from '@mui/icons-material/Web';
import SchemaIcon from '@mui/icons-material/Schema';
import CloudIcon from '@mui/icons-material/Cloud';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

// SDLC Phases
export const SDLC_PHASES = {
  PLANNING: 'PLANNING',
  REQUIREMENTS: 'requirements',
  DESIGN: 'design',
  TESTING: 'testing'
};

export const PHASE_LABELS = {
  [SDLC_PHASES.PLANNING]: 'Initiation & Planning',
  [SDLC_PHASES.REQUIREMENTS]: 'Requirements',
  [SDLC_PHASES.DESIGN]: 'Design',
  [SDLC_PHASES.TESTING]: 'Testing'
};

// Artifact Types
export const ARTIFACT_TYPES = {
  // Initiation & Planning artifacts
  BRAINSTORMING_NOTE: 'brainstorming_note',
  PROJECT_CHARTER: 'project_charter',
  ROADMAP: 'roadmap',
  RISK_ANALYSIS: 'risk_analysis',

  // Requirements artifacts
  SRS_DOCUMENT: 'srs_document',
  FUNCTIONAL_REQUIREMENTS: 'functional_requirements',
  NON_FUNCTIONAL_REQUIREMENTS: 'non_functional_requirements',
  REQUIREMENTS_TRACE_MATRIX: 'requirements_trace_matrix',
  UAT_DOCUMENTS: 'uat_documents',

  // Design artifacts
  BASIC_DESIGN: 'basic_design',
  WIREFRAME: 'wireframe',
  SCREEN_MAP: 'screen_map',
  SYSTEM_DIAGRAM: 'system_diagram',
  DATA_DESIGN: 'data_design',
  API_SPEC: 'api_spec',
  INFRA_DOCS: 'infra_docs',

  // Testing artifacts
  TEST_PLAN: 'test_plan',
  TEST_CASES: 'test_cases',
  TEST_RESULTS: 'test_results',
  DEFECT_LOGS: 'defect_logs'
};

export const ARTIFACT_TYPE_LABELS = {
  // Initiation & Planning
  [ARTIFACT_TYPES.BRAINSTORMING_NOTE]: 'Brainstorming Notes',
  [ARTIFACT_TYPES.PROJECT_CHARTER]: 'Project Charter & Feasibility Study',
  [ARTIFACT_TYPES.ROADMAP]: 'Roadmap & Master Schedule',
  [ARTIFACT_TYPES.RISK_ANALYSIS]: 'Risk & Stakeholder Analysis',

  // Requirements
  [ARTIFACT_TYPES.SRS_DOCUMENT]: 'SRS Document',
  [ARTIFACT_TYPES.FUNCTIONAL_REQUIREMENTS]: 'Functional Requirements Document',
  [ARTIFACT_TYPES.NON_FUNCTIONAL_REQUIREMENTS]: 'Non-Functional Requirements Document',
  [ARTIFACT_TYPES.REQUIREMENTS_TRACE_MATRIX]: 'Requirements Traceability Matrix',
  [ARTIFACT_TYPES.UAT_DOCUMENTS]: 'User Acceptance Test Documents',

  // Design
  [ARTIFACT_TYPES.BASIC_DESIGN]: 'Basic/Preliminary Design Document',
  [ARTIFACT_TYPES.WIREFRAME]: 'Wireframe / UI/UX Design',
  [ARTIFACT_TYPES.SCREEN_MAP]: 'Screen Map/Layout',
  [ARTIFACT_TYPES.SYSTEM_DIAGRAM]: 'System & Component Diagrams',
  [ARTIFACT_TYPES.DATA_DESIGN]: 'Data & Database Design',
  [ARTIFACT_TYPES.API_SPEC]: 'API & Integration Specifications',
  [ARTIFACT_TYPES.INFRA_DOCS]: 'Infrastructure & Environment Setup',

  // Testing
  [ARTIFACT_TYPES.TEST_PLAN]: 'Test Plans & Strategies',
  [ARTIFACT_TYPES.TEST_CASES]: 'Test Cases & Scripts',
  [ARTIFACT_TYPES.TEST_RESULTS]: 'Test Execution Results',
  [ARTIFACT_TYPES.DEFECT_LOGS]: 'Defect Tracking & Resolution Logs'
};

// Map artifact types to their corresponding SDLC phase
export const ARTIFACT_TYPE_TO_PHASE = {
  // Initiation & Planning
  [ARTIFACT_TYPES.BRAINSTORMING_NOTE]: SDLC_PHASES.PLANNING,
  [ARTIFACT_TYPES.PROJECT_CHARTER]: SDLC_PHASES.PLANNING,
  [ARTIFACT_TYPES.ROADMAP]: SDLC_PHASES.PLANNING,
  [ARTIFACT_TYPES.RISK_ANALYSIS]: SDLC_PHASES.PLANNING,

  // Requirements
  [ARTIFACT_TYPES.SRS_DOCUMENT]: SDLC_PHASES.REQUIREMENTS,
  [ARTIFACT_TYPES.FUNCTIONAL_REQUIREMENTS]: SDLC_PHASES.REQUIREMENTS,
  [ARTIFACT_TYPES.NON_FUNCTIONAL_REQUIREMENTS]: SDLC_PHASES.REQUIREMENTS,
  [ARTIFACT_TYPES.REQUIREMENTS_TRACE_MATRIX]: SDLC_PHASES.REQUIREMENTS,
  [ARTIFACT_TYPES.UAT_DOCUMENTS]: SDLC_PHASES.REQUIREMENTS,

  // Design
  [ARTIFACT_TYPES.BASIC_DESIGN]: SDLC_PHASES.DESIGN,
  [ARTIFACT_TYPES.WIREFRAME]: SDLC_PHASES.DESIGN,
  [ARTIFACT_TYPES.SCREEN_MAP]: SDLC_PHASES.DESIGN,
  [ARTIFACT_TYPES.SYSTEM_DIAGRAM]: SDLC_PHASES.DESIGN,
  [ARTIFACT_TYPES.DATA_DESIGN]: SDLC_PHASES.DESIGN,
  [ARTIFACT_TYPES.API_SPEC]: SDLC_PHASES.DESIGN,
  [ARTIFACT_TYPES.INFRA_DOCS]: SDLC_PHASES.DESIGN,

  // Testing
  [ARTIFACT_TYPES.TEST_PLAN]: SDLC_PHASES.TESTING,
  [ARTIFACT_TYPES.TEST_CASES]: SDLC_PHASES.TESTING,
  [ARTIFACT_TYPES.TEST_RESULTS]: SDLC_PHASES.TESTING,
  [ARTIFACT_TYPES.DEFECT_LOGS]: SDLC_PHASES.TESTING
};

// Map artifact types to their corresponding icons
export const ARTIFACT_TYPE_ICONS = {
  [ARTIFACT_TYPES.BRAINSTORMING_NOTE]: NoteIcon,
  [ARTIFACT_TYPES.PROJECT_CHARTER]: DescriptionIcon,
  [ARTIFACT_TYPES.ROADMAP]: TimelineIcon,
  [ARTIFACT_TYPES.RISK_ANALYSIS]: WarningIcon,
  
  [ARTIFACT_TYPES.SRS_DOCUMENT]: DescriptionIcon,
  [ARTIFACT_TYPES.FUNCTIONAL_REQUIREMENTS]: AssignmentIcon,
  [ARTIFACT_TYPES.NON_FUNCTIONAL_REQUIREMENTS]: AssignmentIcon,
  [ARTIFACT_TYPES.REQUIREMENTS_TRACE_MATRIX]: AccountTreeIcon,
  [ARTIFACT_TYPES.UAT_DOCUMENTS]: CheckBoxIcon,
  
  [ARTIFACT_TYPES.BASIC_DESIGN]: DesignServicesIcon,
  [ARTIFACT_TYPES.WIREFRAME]: WebIcon,
  [ARTIFACT_TYPES.SCREEN_MAP]: ListAltIcon,
  [ARTIFACT_TYPES.SYSTEM_DIAGRAM]: SchemaIcon,
  [ARTIFACT_TYPES.DATA_DESIGN]: StorageIcon,
  [ARTIFACT_TYPES.API_SPEC]: ApiIcon,
  [ARTIFACT_TYPES.INFRA_DOCS]: CloudIcon,
  
  [ARTIFACT_TYPES.TEST_PLAN]: DescriptionIcon,
  [ARTIFACT_TYPES.TEST_CASES]: ListAltIcon,
  [ARTIFACT_TYPES.TEST_RESULTS]: CheckBoxIcon,
  [ARTIFACT_TYPES.DEFECT_LOGS]: BugReportIcon
};

// File extensions for each artifact type
export const getFileExtension = (artifactType) => {
  const extensionMap = {
    // Initiation & Planning
    [ARTIFACT_TYPES.BRAINSTORMING_NOTE]: '.md',
    [ARTIFACT_TYPES.PROJECT_CHARTER]: '.md',
    [ARTIFACT_TYPES.ROADMAP]: '.md',
    [ARTIFACT_TYPES.RISK_ANALYSIS]: '.md',

    // Requirements
    [ARTIFACT_TYPES.SRS_DOCUMENT]: '.md',
    [ARTIFACT_TYPES.FUNCTIONAL_REQUIREMENTS]: '.md',
    [ARTIFACT_TYPES.NON_FUNCTIONAL_REQUIREMENTS]: '.md',
    [ARTIFACT_TYPES.REQUIREMENTS_TRACE_MATRIX]: '.md',
    [ARTIFACT_TYPES.UAT_DOCUMENTS]: '.md',

    // Design
    [ARTIFACT_TYPES.BASIC_DESIGN]: '.md',
    [ARTIFACT_TYPES.WIREFRAME]: '.excalidraw',
    [ARTIFACT_TYPES.SCREEN_MAP]: '.json',
    [ARTIFACT_TYPES.SYSTEM_DIAGRAM]: '.diagram',
    [ARTIFACT_TYPES.DATA_DESIGN]: '.json',
    [ARTIFACT_TYPES.API_SPEC]: '.json',
    [ARTIFACT_TYPES.INFRA_DOCS]: '.md',

    // Testing
    [ARTIFACT_TYPES.TEST_PLAN]: '.md',
    [ARTIFACT_TYPES.TEST_CASES]: '.md',
    [ARTIFACT_TYPES.TEST_RESULTS]: '.md',
    [ARTIFACT_TYPES.DEFECT_LOGS]: '.md'
  };
  return extensionMap[artifactType] || '.txt';
};

// Utility functions
export const getArtifactTypeLabel = (value) => {
  return ARTIFACT_TYPE_LABELS[value] || value;
};

export const getArtifactIcon = (artifactType) => {
  const IconComponent = ARTIFACT_TYPE_ICONS[artifactType];
  return IconComponent ? <IconComponent /> : <DescriptionIcon />;
};

// Add this after ARTIFACT_TYPES object definition
export const ARTIFACT_TYPE_OPTIONS = [
  // Initiation & Planning artifacts
  { value: ARTIFACT_TYPES.BRAINSTORMING_NOTE, label: ARTIFACT_TYPE_LABELS[ARTIFACT_TYPES.BRAINSTORMING_NOTE] },
  { value: ARTIFACT_TYPES.PROJECT_CHARTER, label: ARTIFACT_TYPE_LABELS[ARTIFACT_TYPES.PROJECT_CHARTER] },
  { value: ARTIFACT_TYPES.ROADMAP, label: ARTIFACT_TYPE_LABELS[ARTIFACT_TYPES.ROADMAP] },
  { value: ARTIFACT_TYPES.RISK_ANALYSIS, label: ARTIFACT_TYPE_LABELS[ARTIFACT_TYPES.RISK_ANALYSIS] },

  // Requirements artifacts
  { value: ARTIFACT_TYPES.SRS_DOCUMENT, label: ARTIFACT_TYPE_LABELS[ARTIFACT_TYPES.SRS_DOCUMENT] },
  { value: ARTIFACT_TYPES.FUNCTIONAL_REQUIREMENTS, label: ARTIFACT_TYPE_LABELS[ARTIFACT_TYPES.FUNCTIONAL_REQUIREMENTS] },
  { value: ARTIFACT_TYPES.NON_FUNCTIONAL_REQUIREMENTS, label: ARTIFACT_TYPE_LABELS[ARTIFACT_TYPES.NON_FUNCTIONAL_REQUIREMENTS] },
  { value: ARTIFACT_TYPES.REQUIREMENTS_TRACE_MATRIX, label: ARTIFACT_TYPE_LABELS[ARTIFACT_TYPES.REQUIREMENTS_TRACE_MATRIX] },
  { value: ARTIFACT_TYPES.UAT_DOCUMENTS, label: ARTIFACT_TYPE_LABELS[ARTIFACT_TYPES.UAT_DOCUMENTS] },

  // Design artifacts
  { value: ARTIFACT_TYPES.BASIC_DESIGN, label: ARTIFACT_TYPE_LABELS[ARTIFACT_TYPES.BASIC_DESIGN] },
  { value: ARTIFACT_TYPES.WIREFRAME, label: ARTIFACT_TYPE_LABELS[ARTIFACT_TYPES.WIREFRAME] },
  { value: ARTIFACT_TYPES.SCREEN_MAP, label: ARTIFACT_TYPE_LABELS[ARTIFACT_TYPES.SCREEN_MAP] },
  { value: ARTIFACT_TYPES.SYSTEM_DIAGRAM, label: ARTIFACT_TYPE_LABELS[ARTIFACT_TYPES.SYSTEM_DIAGRAM] },
  { value: ARTIFACT_TYPES.DATA_DESIGN, label: ARTIFACT_TYPE_LABELS[ARTIFACT_TYPES.DATA_DESIGN] },
  { value: ARTIFACT_TYPES.API_SPEC, label: ARTIFACT_TYPE_LABELS[ARTIFACT_TYPES.API_SPEC] },
  { value: ARTIFACT_TYPES.INFRA_DOCS, label: ARTIFACT_TYPE_LABELS[ARTIFACT_TYPES.INFRA_DOCS] },

  // Testing artifacts
  { value: ARTIFACT_TYPES.TEST_PLAN, label: ARTIFACT_TYPE_LABELS[ARTIFACT_TYPES.TEST_PLAN] },
  { value: ARTIFACT_TYPES.TEST_CASES, label: ARTIFACT_TYPE_LABELS[ARTIFACT_TYPES.TEST_CASES] },
  { value: ARTIFACT_TYPES.TEST_RESULTS, label: ARTIFACT_TYPE_LABELS[ARTIFACT_TYPES.TEST_RESULTS] },
  { value: ARTIFACT_TYPES.DEFECT_LOGS, label: ARTIFACT_TYPE_LABELS[ARTIFACT_TYPES.DEFECT_LOGS] }
];

// Add descriptions for artifact types
export const ARTIFACT_TYPE_DESCRIPTIONS = {
  [ARTIFACT_TYPES.BRAINSTORMING_NOTE]: 'Initial ideas, concepts, and brainstorming sessions for the project',
  [ARTIFACT_TYPES.PROJECT_CHARTER]: 'Formal document defining project scope, objectives, and participants',
  [ARTIFACT_TYPES.ROADMAP]: 'High-level timeline and milestones for project delivery',
  [ARTIFACT_TYPES.RISK_ANALYSIS]: 'Assessment of potential risks and mitigation strategies',

  [ARTIFACT_TYPES.SRS_DOCUMENT]: 'Comprehensive software requirements specification document',
  [ARTIFACT_TYPES.FUNCTIONAL_REQUIREMENTS]: 'Detailed functional requirements and user stories',
  [ARTIFACT_TYPES.NON_FUNCTIONAL_REQUIREMENTS]: 'Performance, security, and other non-functional requirements',
  [ARTIFACT_TYPES.REQUIREMENTS_TRACE_MATRIX]: 'Matrix mapping requirements to design and test cases',
  [ARTIFACT_TYPES.UAT_DOCUMENTS]: 'User acceptance testing criteria and scenarios',

  [ARTIFACT_TYPES.BASIC_DESIGN]: 'High-level system architecture and design decisions',
  [ARTIFACT_TYPES.WIREFRAME]: 'UI/UX wireframes and mockups',
  [ARTIFACT_TYPES.SCREEN_MAP]: 'Navigation flow and screen relationships',
  [ARTIFACT_TYPES.SYSTEM_DIAGRAM]: 'System architecture and component diagrams',
  [ARTIFACT_TYPES.DATA_DESIGN]: 'Database schema and data flow designs',
  [ARTIFACT_TYPES.API_SPEC]: 'API specifications and integration details',
  [ARTIFACT_TYPES.INFRA_DOCS]: 'Infrastructure setup and deployment documentation',

  [ARTIFACT_TYPES.TEST_PLAN]: 'Overall testing strategy and approach',
  [ARTIFACT_TYPES.TEST_CASES]: 'Detailed test cases and scenarios',
  [ARTIFACT_TYPES.TEST_RESULTS]: 'Test execution results and reports',
  [ARTIFACT_TYPES.DEFECT_LOGS]: 'Bug tracking and resolution documentation'
}; 