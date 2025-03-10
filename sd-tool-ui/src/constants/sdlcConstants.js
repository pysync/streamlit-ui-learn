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
import ArticleIcon from '@mui/icons-material/Article'; // Add new icons if needed
import AutoAwesomeMotionIcon from '@mui/icons-material/AutoAwesomeMotion'; // For Use Cases/Business Flows
import FlagIcon from '@mui/icons-material/Flag';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PeopleIcon from '@mui/icons-material/People';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import SpeedIcon from '@mui/icons-material/Speed';
import PersonIcon from '@mui/icons-material/Person';
import CodeIcon from '@mui/icons-material/Code';
import IntegrationInstructionsIcon from '@mui/icons-material/IntegrationInstructions';
import ChecklistIcon from '@mui/icons-material/Checklist';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import HandymanIcon from '@mui/icons-material/Handyman';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';

/**
 * Software Development Lifecycle Constants
 */


// SDLC Phases
export const SDLC_PHASES = {
  PLANNING: 'planning',
  REQUIREMENTS: 'requirements',
  DESIGN: 'design',
  IMPLEMENTATION: 'implementation',
  TESTING: 'testing',
  DEPLOYMENT: 'deployment',
  MAINTENANCE: 'maintenance'
};

// SDLC Phase Labels - Human-readable labels for each phase
export const PHASE_LABELS = {
  [SDLC_PHASES.PLANNING]: 'Planning',
  [SDLC_PHASES.REQUIREMENTS]: 'Requirements',
  [SDLC_PHASES.DESIGN]: 'Design',
  [SDLC_PHASES.IMPLEMENTATION]: 'Implementation',
  [SDLC_PHASES.TESTING]: 'Testing',
  [SDLC_PHASES.DEPLOYMENT]: 'Deployment',
  [SDLC_PHASES.MAINTENANCE]: 'Maintenance'
};

// Optional: Add phase descriptions if needed
export const PHASE_DESCRIPTIONS = {
  [SDLC_PHASES.PLANNING]: 'Define project scope, objectives, and approach',
  [SDLC_PHASES.REQUIREMENTS]: 'Gather and document project requirements',
  [SDLC_PHASES.DESIGN]: 'Create technical specifications and system design',
  [SDLC_PHASES.IMPLEMENTATION]: 'Develop and code the solution',
  [SDLC_PHASES.TESTING]: 'Verify and validate the solution',
  [SDLC_PHASES.DEPLOYMENT]: 'Release and deploy to production',
  [SDLC_PHASES.MAINTENANCE]: 'Support and maintain the live system'
};


// Artifact Types - Streamlined and organized by phase
export const ARTIFACT_TYPES = {
  // Planning Phase
  PROJECT_CHARTER: 'project_charter',
  PROJECT_PLAN: 'project_plan',
  STAKEHOLDER_ANALYSIS: 'stakeholder_analysis',
  RISK_MANAGEMENT_PLAN: 'risk_management_plan',
  
  // Requirements Phase
  BUSINESS_REQUIREMENTS: 'business_requirements',
  FUNCTIONAL_REQUIREMENTS: 'functional_requirements',
  NON_FUNCTIONAL_REQUIREMENTS: 'non_functional_requirements',
  USER_STORIES: 'user_stories',
  
  // Design Phase
  SYSTEM_ARCHITECTURE: 'system_architecture',
  DATABASE_DESIGN: 'database_design',
  API_SPECIFICATION: 'api_specification',
  UI_DESIGN: 'ui_design',
  
  // Implementation Phase
  TECHNICAL_SPECIFICATION: 'technical_specification',
  CODE_DOCUMENTATION: 'code_documentation',
  
  // Testing Phase
  TEST_PLAN: 'test_plan',
  TEST_CASES: 'test_cases',
  TEST_RESULTS: 'test_results',
  
  // Deployment Phase
  DEPLOYMENT_PLAN: 'deployment_plan',
  RELEASE_NOTES: 'release_notes',
  
  // Maintenance Phase
  MAINTENANCE_PLAN: 'maintenance_plan',
  CHANGE_REQUEST: 'change_request'
};

// Artifact Type Labels - Human-readable labels for each artifact type
export const ARTIFACT_TYPE_LABELS = {
  [ARTIFACT_TYPES.PROJECT_CHARTER]: 'Project Charter',
  [ARTIFACT_TYPES.PROJECT_PLAN]: 'Project Plan',
  [ARTIFACT_TYPES.STAKEHOLDER_ANALYSIS]: 'Stakeholder Analysis',
  [ARTIFACT_TYPES.RISK_MANAGEMENT_PLAN]: 'Risk Management Plan',
  
  [ARTIFACT_TYPES.BUSINESS_REQUIREMENTS]: 'Business Requirements',
  [ARTIFACT_TYPES.FUNCTIONAL_REQUIREMENTS]: 'Functional Requirements',
  [ARTIFACT_TYPES.NON_FUNCTIONAL_REQUIREMENTS]: 'Non-Functional Requirements',
  [ARTIFACT_TYPES.USER_STORIES]: 'User Stories',
  
  [ARTIFACT_TYPES.SYSTEM_ARCHITECTURE]: 'System Architecture',
  [ARTIFACT_TYPES.DATABASE_DESIGN]: 'Database Design',
  [ARTIFACT_TYPES.API_SPECIFICATION]: 'API Specification',
  [ARTIFACT_TYPES.UI_DESIGN]: 'UI Design',
  
  [ARTIFACT_TYPES.TECHNICAL_SPECIFICATION]: 'Technical Specification',
  [ARTIFACT_TYPES.CODE_DOCUMENTATION]: 'Code Documentation',
  
  [ARTIFACT_TYPES.TEST_PLAN]: 'Test Plan',
  [ARTIFACT_TYPES.TEST_CASES]: 'Test Cases',
  [ARTIFACT_TYPES.TEST_RESULTS]: 'Test Results',
  
  [ARTIFACT_TYPES.DEPLOYMENT_PLAN]: 'Deployment Plan',
  [ARTIFACT_TYPES.RELEASE_NOTES]: 'Release Notes',
  
  [ARTIFACT_TYPES.MAINTENANCE_PLAN]: 'Maintenance Plan',
  [ARTIFACT_TYPES.CHANGE_REQUEST]: 'Change Request'
};

// Artifact Type Descriptions
export const ARTIFACT_TYPE_DESCRIPTIONS = {
  [ARTIFACT_TYPES.PROJECT_CHARTER]: 'Defines the project purpose, objectives, scope, and key stakeholders',
  [ARTIFACT_TYPES.PROJECT_PLAN]: 'Detailed plan including timeline, resources, and milestones',
  [ARTIFACT_TYPES.STAKEHOLDER_ANALYSIS]: 'Analysis of project stakeholders and their interests',
  [ARTIFACT_TYPES.RISK_MANAGEMENT_PLAN]: 'Identification and mitigation strategies for project risks',
  
  [ARTIFACT_TYPES.BUSINESS_REQUIREMENTS]: 'High-level business needs and objectives',
  [ARTIFACT_TYPES.FUNCTIONAL_REQUIREMENTS]: 'Detailed functional capabilities the system must provide',
  [ARTIFACT_TYPES.NON_FUNCTIONAL_REQUIREMENTS]: 'Quality attributes like performance, security, and usability',
  [ARTIFACT_TYPES.USER_STORIES]: 'User-centric requirements in the format "As a... I want... So that..."',
  
  [ARTIFACT_TYPES.SYSTEM_ARCHITECTURE]: 'Overall system structure, components, and their relationships',
  [ARTIFACT_TYPES.DATABASE_DESIGN]: 'Database schema, relationships, and data models',
  [ARTIFACT_TYPES.API_SPECIFICATION]: 'API endpoints, request/response formats, and authentication',
  [ARTIFACT_TYPES.UI_DESIGN]: 'User interface layouts, wireframes, and interaction patterns',
  
  [ARTIFACT_TYPES.TECHNICAL_SPECIFICATION]: 'Detailed technical implementation guidelines',
  [ARTIFACT_TYPES.CODE_DOCUMENTATION]: 'Documentation of code structure, modules, and functions',
  
  [ARTIFACT_TYPES.TEST_PLAN]: 'Strategy and approach for testing the system',
  [ARTIFACT_TYPES.TEST_CASES]: 'Specific test scenarios and expected results',
  [ARTIFACT_TYPES.TEST_RESULTS]: 'Outcomes and findings from test execution',
  
  [ARTIFACT_TYPES.DEPLOYMENT_PLAN]: 'Strategy and steps for deploying the system',
  [ARTIFACT_TYPES.RELEASE_NOTES]: 'Summary of features, fixes, and changes in a release',
  
  [ARTIFACT_TYPES.MAINTENANCE_PLAN]: 'Strategy for ongoing system maintenance and support',
  [ARTIFACT_TYPES.CHANGE_REQUEST]: 'Formal request for a change to the system'
};

// Artifact Type Icons (using Material-UI icon components)
export const ARTIFACT_TYPE_ICONS = {
  [ARTIFACT_TYPES.PROJECT_CHARTER]: FlagIcon,
  [ARTIFACT_TYPES.PROJECT_PLAN]: CalendarMonthIcon,
  [ARTIFACT_TYPES.STAKEHOLDER_ANALYSIS]: PeopleIcon,
  [ARTIFACT_TYPES.RISK_MANAGEMENT_PLAN]: WarningIcon,
  
  [ARTIFACT_TYPES.BUSINESS_REQUIREMENTS]: BusinessCenterIcon,
  [ARTIFACT_TYPES.FUNCTIONAL_REQUIREMENTS]: ListAltIcon,
  [ARTIFACT_TYPES.NON_FUNCTIONAL_REQUIREMENTS]: SpeedIcon,
  [ARTIFACT_TYPES.USER_STORIES]: PersonIcon,
  
  [ARTIFACT_TYPES.SYSTEM_ARCHITECTURE]: AccountTreeIcon,
  [ARTIFACT_TYPES.DATABASE_DESIGN]: StorageIcon,
  [ARTIFACT_TYPES.API_SPECIFICATION]: ApiIcon,
  [ARTIFACT_TYPES.UI_DESIGN]: DesignServicesIcon,
  
  [ARTIFACT_TYPES.TECHNICAL_SPECIFICATION]: CodeIcon,
  [ARTIFACT_TYPES.CODE_DOCUMENTATION]: IntegrationInstructionsIcon,
  
  [ARTIFACT_TYPES.TEST_PLAN]: AssignmentIcon,
  [ARTIFACT_TYPES.TEST_CASES]: ChecklistIcon,
  [ARTIFACT_TYPES.TEST_RESULTS]: FactCheckIcon,
  
  [ARTIFACT_TYPES.DEPLOYMENT_PLAN]: RocketLaunchIcon,
  [ARTIFACT_TYPES.RELEASE_NOTES]: NewReleasesIcon,
  
  [ARTIFACT_TYPES.MAINTENANCE_PLAN]: HandymanIcon,
  [ARTIFACT_TYPES.CHANGE_REQUEST]: ChangeCircleIcon
};

// Artifact Visualizations
export const ARTIFACT_VISUALIZATIONS = {
  [ARTIFACT_TYPES.PROJECT_PLAN]: [
    { id: 'document', type: 'document', label: 'Document View' },
    { id: 'gantt', type: 'gantt', label: 'Gantt Chart' },
    { id: 'kanban', type: 'kanban', label: 'Kanban Board' }
  ],
  [ARTIFACT_TYPES.BUSINESS_REQUIREMENTS]: [
    { id: 'document', type: 'document', label: 'Document View' },
    { id: 'table', type: 'table', label: 'Requirements Table' }
  ],
  [ARTIFACT_TYPES.FUNCTIONAL_REQUIREMENTS]: [
    { id: 'document', type: 'document', label: 'Document View' },
    { id: 'table', type: 'table', label: 'Functions Table' },
    { id: 'diagram', type: 'diagram', label: 'Process Flow' }
  ],
  [ARTIFACT_TYPES.NON_FUNCTIONAL_REQUIREMENTS]: [
    { id: 'document', type: 'document', label: 'Document View' },
    { id: 'table', type: 'table', label: 'Requirements Table' }
  ],
  [ARTIFACT_TYPES.USER_STORIES]: [
    { id: 'document', type: 'document', label: 'Document View' },
    { id: 'table', type: 'table', label: 'Stories Table' },
    { id: 'kanban', type: 'kanban', label: 'Story Board' }
  ],
  [ARTIFACT_TYPES.SYSTEM_ARCHITECTURE]: [
    { id: 'document', type: 'document', label: 'Document View' },
    { id: 'diagram', type: 'diagram', label: 'Architecture Diagram' }
  ],
  [ARTIFACT_TYPES.DATABASE_DESIGN]: [
    { id: 'document', type: 'document', label: 'Document View' },
    { id: 'diagram', type: 'diagram', label: 'ER Diagram' },
    { id: 'table', type: 'table', label: 'Tables Definition' }
  ],
  [ARTIFACT_TYPES.API_SPECIFICATION]: [
    { id: 'document', type: 'document', label: 'Document View' },
    { id: 'table', type: 'table', label: 'Endpoints Table' },
    { id: 'swagger', type: 'swagger', label: 'Swagger UI' }
  ],
  [ARTIFACT_TYPES.UI_DESIGN]: [
    { id: 'document', type: 'document', label: 'Document View' },
    { id: 'wireframe', type: 'wireframe', label: 'Wireframes' }
  ],
  [ARTIFACT_TYPES.TECHNICAL_SPECIFICATION]: [
    { id: 'document', type: 'document', label: 'Document View' },
    { id: 'diagram', type: 'diagram', label: 'Component Diagram' }
  ],
  [ARTIFACT_TYPES.TEST_CASES]: [
    { id: 'document', type: 'document', label: 'Document View' },
    { id: 'table', type: 'table', label: 'Test Cases Table' }
  ],
  [ARTIFACT_TYPES.TEST_RESULTS]: [
    { id: 'document', type: 'document', label: 'Document View' },
    { id: 'table', type: 'table', label: 'Results Table' },
    { id: 'chart', type: 'chart', label: 'Test Metrics' }
  ]
};

// Default visualization for each artifact type
export const DEFAULT_VISUALIZATIONS = {
  [ARTIFACT_TYPES.PROJECT_CHARTER]: 'document',
  [ARTIFACT_TYPES.PROJECT_PLAN]: 'gantt',
  [ARTIFACT_TYPES.STAKEHOLDER_ANALYSIS]: 'document',
  [ARTIFACT_TYPES.RISK_MANAGEMENT_PLAN]: 'document',
  
  [ARTIFACT_TYPES.BUSINESS_REQUIREMENTS]: 'document',
  [ARTIFACT_TYPES.FUNCTIONAL_REQUIREMENTS]: 'document',
  [ARTIFACT_TYPES.NON_FUNCTIONAL_REQUIREMENTS]: 'document',
  [ARTIFACT_TYPES.USER_STORIES]: 'table',
  
  [ARTIFACT_TYPES.SYSTEM_ARCHITECTURE]: 'diagram',
  [ARTIFACT_TYPES.DATABASE_DESIGN]: 'diagram',
  [ARTIFACT_TYPES.API_SPECIFICATION]: 'document',
  [ARTIFACT_TYPES.UI_DESIGN]: 'wireframe',
  
  [ARTIFACT_TYPES.TECHNICAL_SPECIFICATION]: 'document',
  [ARTIFACT_TYPES.CODE_DOCUMENTATION]: 'document',
  
  [ARTIFACT_TYPES.TEST_PLAN]: 'document',
  [ARTIFACT_TYPES.TEST_CASES]: 'table',
  [ARTIFACT_TYPES.TEST_RESULTS]: 'table',
  
  [ARTIFACT_TYPES.DEPLOYMENT_PLAN]: 'document',
  [ARTIFACT_TYPES.RELEASE_NOTES]: 'document',
  
  [ARTIFACT_TYPES.MAINTENANCE_PLAN]: 'document',
  [ARTIFACT_TYPES.CHANGE_REQUEST]: 'document'
};


// Map artifact types to SDLC phases
export const ARTIFACT_TYPE_PHASES = {
  [ARTIFACT_TYPES.PROJECT_CHARTER]: SDLC_PHASES.PLANNING,
  [ARTIFACT_TYPES.PROJECT_PLAN]: SDLC_PHASES.PLANNING,
  [ARTIFACT_TYPES.STAKEHOLDER_ANALYSIS]: SDLC_PHASES.PLANNING,
  [ARTIFACT_TYPES.RISK_MANAGEMENT_PLAN]: SDLC_PHASES.PLANNING,
  
  [ARTIFACT_TYPES.BUSINESS_REQUIREMENTS]: SDLC_PHASES.REQUIREMENTS,
  [ARTIFACT_TYPES.FUNCTIONAL_REQUIREMENTS]: SDLC_PHASES.REQUIREMENTS,
  [ARTIFACT_TYPES.NON_FUNCTIONAL_REQUIREMENTS]: SDLC_PHASES.REQUIREMENTS,
  [ARTIFACT_TYPES.USER_STORIES]: SDLC_PHASES.REQUIREMENTS,
  
  [ARTIFACT_TYPES.SYSTEM_ARCHITECTURE]: SDLC_PHASES.DESIGN,
  [ARTIFACT_TYPES.DATABASE_DESIGN]: SDLC_PHASES.DESIGN,
  [ARTIFACT_TYPES.API_SPECIFICATION]: SDLC_PHASES.DESIGN,
  [ARTIFACT_TYPES.UI_DESIGN]: SDLC_PHASES.DESIGN,
  
  [ARTIFACT_TYPES.TECHNICAL_SPECIFICATION]: SDLC_PHASES.IMPLEMENTATION,
  [ARTIFACT_TYPES.CODE_DOCUMENTATION]: SDLC_PHASES.IMPLEMENTATION,
  
  [ARTIFACT_TYPES.TEST_PLAN]: SDLC_PHASES.TESTING,
  [ARTIFACT_TYPES.TEST_CASES]: SDLC_PHASES.TESTING,
  [ARTIFACT_TYPES.TEST_RESULTS]: SDLC_PHASES.TESTING,
  
  [ARTIFACT_TYPES.DEPLOYMENT_PLAN]: SDLC_PHASES.DEPLOYMENT,
  [ARTIFACT_TYPES.RELEASE_NOTES]: SDLC_PHASES.DEPLOYMENT,
  
  [ARTIFACT_TYPES.MAINTENANCE_PLAN]: SDLC_PHASES.MAINTENANCE,
  [ARTIFACT_TYPES.CHANGE_REQUEST]: SDLC_PHASES.MAINTENANCE
};


// File extensions for each artifact type
export const getFileExtension = (artifactType) => {
  const extensionMap = {
    // Initiation & Planning
    [ARTIFACT_TYPES.PROJECT_CHARTER]: '.md',
    [ARTIFACT_TYPES.PROJECT_PLAN]: '.mpp', // Microsoft Project Plan or .planner for other tools
    [ARTIFACT_TYPES.STAKEHOLDER_ANALYSIS]: '.md',
    [ARTIFACT_TYPES.RISK_MANAGEMENT_PLAN]: '.md',

    // Requirements
    [ARTIFACT_TYPES.BUSINESS_REQUIREMENTS]: '.md',
    [ARTIFACT_TYPES.USER_STORIES]: '.md',
    [ARTIFACT_TYPES.FUNCTIONAL_REQUIREMENTS]: '.md',
    [ARTIFACT_TYPES.NON_FUNCTIONAL_REQUIREMENTS]: '.md',

    // Design
    [ARTIFACT_TYPES.SYSTEM_ARCHITECTURE]: '.md',
    [ARTIFACT_TYPES.DATABASE_DESIGN]: '.md',
    [ARTIFACT_TYPES.API_SPECIFICATION]: '.json', // Or .yaml, .openapi, .swagger
    [ARTIFACT_TYPES.UI_DESIGN]: '.excalidraw', // Or .fig, .sketch, image formats

    // Implementation
    [ARTIFACT_TYPES.TECHNICAL_SPECIFICATION]: '.md',
    [ARTIFACT_TYPES.CODE_DOCUMENTATION]: '.md',

    // Testing
    [ARTIFACT_TYPES.TEST_PLAN]: '.md',
    [ARTIFACT_TYPES.TEST_CASES]: '.xlsx', // Excel or .csv for test case tables
    [ARTIFACT_TYPES.TEST_RESULTS]: '.md',

    // Deployment
    [ARTIFACT_TYPES.DEPLOYMENT_PLAN]: '.drawio', // Or .plantuml, .archimate, image formats
    [ARTIFACT_TYPES.RELEASE_NOTES]: '.md',

    // Maintenance
    [ARTIFACT_TYPES.MAINTENANCE_PLAN]: '.md',
    [ARTIFACT_TYPES.CHANGE_REQUEST]: '.md'
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

// ARTIFACT_TYPE_OPTIONS
export const ARTIFACT_TYPE_OPTIONS = [
  // Initiation & Planning artifacts
  { value: ARTIFACT_TYPES.PROJECT_CHARTER, label: ARTIFACT_TYPE_LABELS[ARTIFACT_TYPES.PROJECT_CHARTER] },
  { value: ARTIFACT_TYPES.PROJECT_PLAN, label: ARTIFACT_TYPE_LABELS[ARTIFACT_TYPES.PROJECT_PLAN] },
  { value: ARTIFACT_TYPES.STAKEHOLDER_ANALYSIS, label: ARTIFACT_TYPE_LABELS[ARTIFACT_TYPES.STAKEHOLDER_ANALYSIS] },
  { value: ARTIFACT_TYPES.RISK_MANAGEMENT_PLAN, label: ARTIFACT_TYPE_LABELS[ARTIFACT_TYPES.RISK_MANAGEMENT_PLAN] },

  // Requirements artifacts
  { value: ARTIFACT_TYPES.BUSINESS_REQUIREMENTS, label: ARTIFACT_TYPE_LABELS[ARTIFACT_TYPES.BUSINESS_REQUIREMENTS] },
  { value: ARTIFACT_TYPES.USER_STORIES, label: ARTIFACT_TYPE_LABELS[ARTIFACT_TYPES.USER_STORIES] },
  { value: ARTIFACT_TYPES.FUNCTIONAL_REQUIREMENTS, label: ARTIFACT_TYPE_LABELS[ARTIFACT_TYPES.FUNCTIONAL_REQUIREMENTS] },
  { value: ARTIFACT_TYPES.NON_FUNCTIONAL_REQUIREMENTS, label: ARTIFACT_TYPE_LABELS[ARTIFACT_TYPES.NON_FUNCTIONAL_REQUIREMENTS] },

  // Design artifacts
  { value: ARTIFACT_TYPES.SYSTEM_ARCHITECTURE, label: ARTIFACT_TYPE_LABELS[ARTIFACT_TYPES.SYSTEM_ARCHITECTURE] },
  { value: ARTIFACT_TYPES.DATABASE_DESIGN, label: ARTIFACT_TYPE_LABELS[ARTIFACT_TYPES.DATABASE_DESIGN] },
  { value: ARTIFACT_TYPES.API_SPECIFICATION, label: ARTIFACT_TYPE_LABELS[ARTIFACT_TYPES.API_SPECIFICATION] },
  { value: ARTIFACT_TYPES.UI_DESIGN, label: ARTIFACT_TYPE_LABELS[ARTIFACT_TYPES.UI_DESIGN] },

  // Implementation
  { value: ARTIFACT_TYPES.TECHNICAL_SPECIFICATION, label: ARTIFACT_TYPE_LABELS[ARTIFACT_TYPES.TECHNICAL_SPECIFICATION] },
  { value: ARTIFACT_TYPES.CODE_DOCUMENTATION, label: ARTIFACT_TYPE_LABELS[ARTIFACT_TYPES.CODE_DOCUMENTATION] },

  // Testing
  { value: ARTIFACT_TYPES.TEST_PLAN, label: ARTIFACT_TYPE_LABELS[ARTIFACT_TYPES.TEST_PLAN] },
  { value: ARTIFACT_TYPES.TEST_CASES, label: ARTIFACT_TYPE_LABELS[ARTIFACT_TYPES.TEST_CASES] },
  { value: ARTIFACT_TYPES.TEST_RESULTS, label: ARTIFACT_TYPE_LABELS[ARTIFACT_TYPES.TEST_RESULTS] },

  // Deployment
  { value: ARTIFACT_TYPES.DEPLOYMENT_PLAN, label: ARTIFACT_TYPE_LABELS[ARTIFACT_TYPES.DEPLOYMENT_PLAN] },
  { value: ARTIFACT_TYPES.RELEASE_NOTES, label: ARTIFACT_TYPE_LABELS[ARTIFACT_TYPES.RELEASE_NOTES] },

  // Maintenance
  { value: ARTIFACT_TYPES.MAINTENANCE_PLAN, label: ARTIFACT_TYPE_LABELS[ARTIFACT_TYPES.MAINTENANCE_PLAN] },
  { value: ARTIFACT_TYPES.CHANGE_REQUEST, label: ARTIFACT_TYPE_LABELS[ARTIFACT_TYPES.CHANGE_REQUEST] }
];

// Define Tab List for UI Grouping
export const TAB_LIST = [
  { key: 'PLANNING_TAB', label: PHASE_LABELS[SDLC_PHASES.PLANNING] },
  { key: 'REQUIREMENTS_TAB', label: PHASE_LABELS[SDLC_PHASES.REQUIREMENTS] },
  { key: 'DESIGN_TAB', label: PHASE_LABELS[SDLC_PHASES.DESIGN] },
  { key: 'TESTING_TAB', label: PHASE_LABELS[SDLC_PHASES.TESTING] },
];

// Define Tab Map to group Artifact Types under Tabs
export const TAB_MAP = {
  PLANNING_TAB: [
    ARTIFACT_TYPES.PROJECT_CHARTER,
    ARTIFACT_TYPES.PROJECT_PLAN,
    ARTIFACT_TYPES.STAKEHOLDER_ANALYSIS,
    ARTIFACT_TYPES.RISK_MANAGEMENT_PLAN,
  ],
  REQUIREMENTS_TAB: [
    ARTIFACT_TYPES.BUSINESS_REQUIREMENTS,
    ARTIFACT_TYPES.USER_STORIES,
    ARTIFACT_TYPES.FUNCTIONAL_REQUIREMENTS,
    ARTIFACT_TYPES.NON_FUNCTIONAL_REQUIREMENTS,
  ],
  DESIGN_TAB: [
    ARTIFACT_TYPES.SYSTEM_ARCHITECTURE,
    ARTIFACT_TYPES.DATABASE_DESIGN,
    ARTIFACT_TYPES.API_SPECIFICATION,
    ARTIFACT_TYPES.UI_DESIGN,
  ],
  TESTING_TAB: [
    ARTIFACT_TYPES.TEST_PLAN,
    ARTIFACT_TYPES.TEST_CASES,
    ARTIFACT_TYPES.TEST_RESULTS,
  ],
  DEPLOYMENT_TAB: [
    ARTIFACT_TYPES.DEPLOYMENT_PLAN,
    ARTIFACT_TYPES.RELEASE_NOTES,
  ],
  MAINTENANCE_TAB: [
    ARTIFACT_TYPES.MAINTENANCE_PLAN,
    ARTIFACT_TYPES.CHANGE_REQUEST,
  ],
};

