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

// SDLC Phases
export const SDLC_PHASES = {
  PLANNING: 'PLANNING',
  REQUIREMENTS: 'requirements',
  DESIGN: 'design',
  TESTING: 'testing'
};

export const PHASE_LABELS = {
  [SDLC_PHASES.PLANNING]: 'Initiation & Planning',
  [SDLC_PHASES.REQUIREMENTS]: 'Requirements Elicitation & Analysis',
  [SDLC_PHASES.DESIGN]: 'System Design & Architecture',
  [SDLC_PHASES.TESTING]: 'Testing & Quality Assurance'
};

// Artifact Types
export const ARTIFACT_TYPES = {
  // **Initiation & Planning Phase**
  BUSINESS_CASE: 'business_case',
  PROJECT_CHARTER: 'project_charter',
  STAKEHOLDER_ANALYSIS: 'stakeholder_analysis',
  PROJECT_PLAN: 'project_plan',
  RISK_MANAGEMENT_PLAN: 'risk_management_plan',

  // **Requirements Elicitation & Analysis Phase**
  BUSINESS_REQUIREMENTS_SPEC: 'business_requirements_spec',
  USER_STORIES: 'user_stories',
  USE_CASE_DIAGRAMS: 'use_case_diagrams',
  FUNCTIONAL_SPECIFICATION: 'functional_specification',
  NON_FUNCTIONAL_REQUIREMENTS_SPEC: 'non_functional_requirements_spec',
  DATA_DICTIONARY: 'data_dictionary',
  REQUIREMENTS_TRACEABILITY_MATRIX: 'requirements_traceability_matrix',

  // **System Design & Architecture Phase**
  SYSTEM_ARCHITECTURE_DOCUMENT: 'system_architecture_document',
  DATABASE_DESIGN_DOCUMENT: 'database_design_document',
  API_SPECIFICATION: 'api_specification',
  UI_UX_DESIGN_SPECIFICATION: 'ui_ux_design_specification',
  TECHNICAL_DESIGN_DOCUMENT: 'technical_design_document',
  DEPLOYMENT_ARCHITECTURE: 'deployment_architecture',
  SECURITY_DESIGN_DOCUMENT: 'security_design_document',

  // **Testing & Quality Assurance Phase**
  TEST_PLAN: 'test_plan',
  TEST_CASES_SPECIFICATION: 'test_cases_specification',
  TEST_DATA: 'test_data',
  TEST_EXECUTION_REPORT: 'test_execution_report',
  DEFECT_REPORT: 'defect_report',
  PERFORMANCE_TEST_REPORT: 'performance_test_report',
  SECURITY_TEST_REPORT: 'security_test_report',
  UAT_PLAN: 'uat_plan',
  UAT_REPORT: 'uat_report'
};


export const ARTIFACT_TYPE_LABELS = {
  // Initiation & Planning
  [ARTIFACT_TYPES.BUSINESS_CASE]: 'Business Case & Justification',
  [ARTIFACT_TYPES.PROJECT_CHARTER]: 'Project Charter & Scope Definition',
  [ARTIFACT_TYPES.STAKEHOLDER_ANALYSIS]: 'Stakeholder Analysis & Communication Plan',
  [ARTIFACT_TYPES.PROJECT_PLAN]: 'Project Management Plan & Schedule',
  [ARTIFACT_TYPES.RISK_MANAGEMENT_PLAN]: 'Risk Management & Mitigation Plan',

  // Requirements
  [ARTIFACT_TYPES.BUSINESS_REQUIREMENTS_SPEC]: 'Business Requirements Specification (BRS)',
  [ARTIFACT_TYPES.USER_STORIES]: 'User Stories & Scenarios',
  [ARTIFACT_TYPES.USE_CASE_DIAGRAMS]: 'Use Case Diagrams & Flows',
  [ARTIFACT_TYPES.FUNCTIONAL_SPECIFICATION]: 'Functional Requirements Specification (FRS)',
  [ARTIFACT_TYPES.NON_FUNCTIONAL_REQUIREMENTS_SPEC]: 'Non-Functional Requirements Specification (NFR)',
  [ARTIFACT_TYPES.DATA_DICTIONARY]: 'Data Dictionary & Glossary',
  [ARTIFACT_TYPES.REQUIREMENTS_TRACEABILITY_MATRIX]: 'Requirements Traceability Matrix (RTM)',

  // Design
  [ARTIFACT_TYPES.SYSTEM_ARCHITECTURE_DOCUMENT]: 'System Architecture Document',
  [ARTIFACT_TYPES.DATABASE_DESIGN_DOCUMENT]: 'Database Design Document & Schema',
  [ARTIFACT_TYPES.API_SPECIFICATION]: 'API Specification & Documentation',
  [ARTIFACT_TYPES.UI_UX_DESIGN_SPECIFICATION]: 'UI/UX Design Specification & Wireframes',
  [ARTIFACT_TYPES.TECHNICAL_DESIGN_DOCUMENT]: 'Technical Design Document & Component Details',
  [ARTIFACT_TYPES.DEPLOYMENT_ARCHITECTURE]: 'Deployment Architecture & Infrastructure Setup',
  [ARTIFACT_TYPES.SECURITY_DESIGN_DOCUMENT]: 'Security Design Document & Threat Analysis',

  // Testing
  [ARTIFACT_TYPES.TEST_PLAN]: 'Test Plan & Strategy',
  [ARTIFACT_TYPES.TEST_CASES_SPECIFICATION]: 'Test Cases Specification & Scripts',
  [ARTIFACT_TYPES.TEST_DATA]: 'Test Data & Environment Setup',
  [ARTIFACT_TYPES.TEST_EXECUTION_REPORT]: 'Test Execution Report & Summary',
  [ARTIFACT_TYPES.DEFECT_REPORT]: 'Defect Report & Tracking Log',
  [ARTIFACT_TYPES.PERFORMANCE_TEST_REPORT]: 'Performance Test Report',
  [ARTIFACT_TYPES.SECURITY_TEST_REPORT]: 'Security Test Report',
  [ARTIFACT_TYPES.UAT_PLAN]: 'User Acceptance Testing (UAT) Plan',
  [ARTIFACT_TYPES.UAT_REPORT]: 'User Acceptance Testing (UAT) Report'
};

// Map artifact types to their corresponding SDLC phase
export const ARTIFACT_TYPE_TO_PHASE = {
  // Initiation & Planning
  [ARTIFACT_TYPES.BUSINESS_CASE]: SDLC_PHASES.PLANNING,
  [ARTIFACT_TYPES.PROJECT_CHARTER]: SDLC_PHASES.PLANNING,
  [ARTIFACT_TYPES.STAKEHOLDER_ANALYSIS]: SDLC_PHASES.PLANNING,
  [ARTIFACT_TYPES.PROJECT_PLAN]: SDLC_PHASES.PLANNING,
  [ARTIFACT_TYPES.RISK_MANAGEMENT_PLAN]: SDLC_PHASES.PLANNING,

  // Requirements
  [ARTIFACT_TYPES.BUSINESS_REQUIREMENTS_SPEC]: SDLC_PHASES.REQUIREMENTS,
  [ARTIFACT_TYPES.USER_STORIES]: SDLC_PHASES.REQUIREMENTS,
  [ARTIFACT_TYPES.USE_CASE_DIAGRAMS]: SDLC_PHASES.REQUIREMENTS,
  [ARTIFACT_TYPES.FUNCTIONAL_SPECIFICATION]: SDLC_PHASES.REQUIREMENTS,
  [ARTIFACT_TYPES.NON_FUNCTIONAL_REQUIREMENTS_SPEC]: SDLC_PHASES.REQUIREMENTS,
  [ARTIFACT_TYPES.DATA_DICTIONARY]: SDLC_PHASES.REQUIREMENTS,
  [ARTIFACT_TYPES.REQUIREMENTS_TRACEABILITY_MATRIX]: SDLC_PHASES.REQUIREMENTS,

  // Design
  [ARTIFACT_TYPES.SYSTEM_ARCHITECTURE_DOCUMENT]: SDLC_PHASES.DESIGN,
  [ARTIFACT_TYPES.DATABASE_DESIGN_DOCUMENT]: SDLC_PHASES.DESIGN,
  [ARTIFACT_TYPES.API_SPECIFICATION]: SDLC_PHASES.DESIGN,
  [ARTIFACT_TYPES.UI_UX_DESIGN_SPECIFICATION]: SDLC_PHASES.DESIGN,
  [ARTIFACT_TYPES.TECHNICAL_DESIGN_DOCUMENT]: SDLC_PHASES.DESIGN,
  [ARTIFACT_TYPES.DEPLOYMENT_ARCHITECTURE]: SDLC_PHASES.DESIGN,
  [ARTIFACT_TYPES.SECURITY_DESIGN_DOCUMENT]: SDLC_PHASES.DESIGN,

  // Testing
  [ARTIFACT_TYPES.TEST_PLAN]: SDLC_PHASES.TESTING,
  [ARTIFACT_TYPES.TEST_CASES_SPECIFICATION]: SDLC_PHASES.TESTING,
  [ARTIFACT_TYPES.TEST_DATA]: SDLC_PHASES.TESTING,
  [ARTIFACT_TYPES.TEST_EXECUTION_REPORT]: SDLC_PHASES.TESTING,
  [ARTIFACT_TYPES.DEFECT_REPORT]: SDLC_PHASES.TESTING,
  [ARTIFACT_TYPES.PERFORMANCE_TEST_REPORT]: SDLC_PHASES.TESTING,
  [ARTIFACT_TYPES.SECURITY_TEST_REPORT]: SDLC_PHASES.TESTING,
  [ARTIFACT_TYPES.UAT_PLAN]: SDLC_PHASES.TESTING,
  [ARTIFACT_TYPES.UAT_REPORT]: SDLC_PHASES.TESTING
};

// Map artifact types to their corresponding icons
export const ARTIFACT_TYPE_ICONS = {
  // Initiation & Planning
  [ARTIFACT_TYPES.BUSINESS_CASE]: ArticleIcon,
  [ARTIFACT_TYPES.PROJECT_CHARTER]: DescriptionIcon,
  [ARTIFACT_TYPES.STAKEHOLDER_ANALYSIS]: AccountTreeIcon,
  [ARTIFACT_TYPES.PROJECT_PLAN]: TimelineIcon,
  [ARTIFACT_TYPES.RISK_MANAGEMENT_PLAN]: WarningIcon,

  // Requirements
  [ARTIFACT_TYPES.BUSINESS_REQUIREMENTS_SPEC]: DescriptionIcon,
  [ARTIFACT_TYPES.USER_STORIES]: AssignmentIcon,
  [ARTIFACT_TYPES.USE_CASE_DIAGRAMS]: AutoAwesomeMotionIcon,
  [ARTIFACT_TYPES.FUNCTIONAL_SPECIFICATION]: AssignmentIcon,
  [ARTIFACT_TYPES.NON_FUNCTIONAL_REQUIREMENTS_SPEC]: AssignmentIcon,
  [ARTIFACT_TYPES.DATA_DICTIONARY]: StorageIcon,
  [ARTIFACT_TYPES.REQUIREMENTS_TRACEABILITY_MATRIX]: AccountTreeIcon,

  // Design
  [ARTIFACT_TYPES.SYSTEM_ARCHITECTURE_DOCUMENT]: SchemaIcon,
  [ARTIFACT_TYPES.DATABASE_DESIGN_DOCUMENT]: StorageIcon,
  [ARTIFACT_TYPES.API_SPECIFICATION]: ApiIcon,
  [ARTIFACT_TYPES.UI_UX_DESIGN_SPECIFICATION]: WebIcon,
  [ARTIFACT_TYPES.TECHNICAL_DESIGN_DOCUMENT]: DesignServicesIcon,
  [ARTIFACT_TYPES.DEPLOYMENT_ARCHITECTURE]: CloudIcon,
  [ARTIFACT_TYPES.SECURITY_DESIGN_DOCUMENT]: WarningIcon,

  // Testing
  [ARTIFACT_TYPES.TEST_PLAN]: DescriptionIcon,
  [ARTIFACT_TYPES.TEST_CASES_SPECIFICATION]: ListAltIcon,
  [ARTIFACT_TYPES.TEST_DATA]: StorageIcon,
  [ARTIFACT_TYPES.TEST_EXECUTION_REPORT]: CheckBoxIcon,
  [ARTIFACT_TYPES.DEFECT_REPORT]: BugReportIcon,
  [ARTIFACT_TYPES.PERFORMANCE_TEST_REPORT]: TimelineIcon,
  [ARTIFACT_TYPES.SECURITY_TEST_REPORT]: WarningIcon,
  [ARTIFACT_TYPES.UAT_PLAN]: DescriptionIcon,
  [ARTIFACT_TYPES.UAT_REPORT]: CheckBoxIcon,
};

// File extensions for each artifact type
export const getFileExtension = (artifactType) => {
  const extensionMap = {
    // Initiation & Planning
    [ARTIFACT_TYPES.BUSINESS_CASE]: '.md',
    [ARTIFACT_TYPES.PROJECT_CHARTER]: '.md',
    [ARTIFACT_TYPES.STAKEHOLDER_ANALYSIS]: '.md',
    [ARTIFACT_TYPES.PROJECT_PLAN]: '.mpp', // Microsoft Project Plan or .planner for other tools
    [ARTIFACT_TYPES.RISK_MANAGEMENT_PLAN]: '.md',

    // Requirements
    [ARTIFACT_TYPES.BUSINESS_REQUIREMENTS_SPEC]: '.md',
    [ARTIFACT_TYPES.USER_STORIES]: '.md',
    [ARTIFACT_TYPES.USE_CASE_DIAGRAMS]: '.drawio', // Or .plantuml, .uml, image formats
    [ARTIFACT_TYPES.FUNCTIONAL_SPECIFICATION]: '.md',
    [ARTIFACT_TYPES.NON_FUNCTIONAL_REQUIREMENTS_SPEC]: '.md',
    [ARTIFACT_TYPES.DATA_DICTIONARY]: '.xlsx', // Excel or .csv for data tables
    [ARTIFACT_TYPES.REQUIREMENTS_TRACEABILITY_MATRIX]: '.xlsx', // Excel or .csv

    // Design
    [ARTIFACT_TYPES.SYSTEM_ARCHITECTURE_DOCUMENT]: '.md', // Or .pdf for formal documents
    [ARTIFACT_TYPES.DATABASE_DESIGN_DOCUMENT]: '.md', // Or .pdf, .sql, .er
    [ARTIFACT_TYPES.API_SPECIFICATION]: '.json', // Or .yaml, .openapi, .swagger
    [ARTIFACT_TYPES.UI_UX_DESIGN_SPECIFICATION]: '.excalidraw', // Or .fig, .sketch, image formats
    [ARTIFACT_TYPES.TECHNICAL_DESIGN_DOCUMENT]: '.md', // Or .pdf for detailed documents
    [ARTIFACT_TYPES.DEPLOYMENT_ARCHITECTURE]: '.drawio', // Or .plantuml, .archimate, image formats
    [ARTIFACT_TYPES.SECURITY_DESIGN_DOCUMENT]: '.md', // Or .pdf

    // Testing
    [ARTIFACT_TYPES.TEST_PLAN]: '.md',
    [ARTIFACT_TYPES.TEST_CASES_SPECIFICATION]: '.xlsx', // Excel or .csv for test case tables
    [ARTIFACT_TYPES.TEST_DATA]: '.zip', // Or database dump, specific data files
    [ARTIFACT_TYPES.TEST_EXECUTION_REPORT]: '.md', // Or .pdf, .html for reports
    [ARTIFACT_TYPES.DEFECT_REPORT]: '.jira', // Placeholder, often linked to issue tracking systems
    [ARTIFACT_TYPES.PERFORMANCE_TEST_REPORT]: '.html', // Or .pdf, report formats
    [ARTIFACT_TYPES.SECURITY_TEST_REPORT]: '.html', // Or .pdf, report formats
    [ARTIFACT_TYPES.UAT_PLAN]: '.md',
    [ARTIFACT_TYPES.UAT_REPORT]: '.md'
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
  { value: ARTIFACT_TYPES.BUSINESS_CASE, label: ARTIFACT_TYPE_LABELS[ARTIFACT_TYPES.BUSINESS_CASE] },
  { value: ARTIFACT_TYPES.PROJECT_CHARTER, label: ARTIFACT_TYPE_LABELS[ARTIFACT_TYPES.PROJECT_CHARTER] },
  { value: ARTIFACT_TYPES.STAKEHOLDER_ANALYSIS, label: ARTIFACT_TYPE_LABELS[ARTIFACT_TYPES.STAKEHOLDER_ANALYSIS] },
  { value: ARTIFACT_TYPES.PROJECT_PLAN, label: ARTIFACT_TYPE_LABELS[ARTIFACT_TYPES.PROJECT_PLAN] },
  { value: ARTIFACT_TYPES.RISK_MANAGEMENT_PLAN, label: ARTIFACT_TYPE_LABELS[ARTIFACT_TYPES.RISK_MANAGEMENT_PLAN] },

  // Requirements artifacts
  { value: ARTIFACT_TYPES.BUSINESS_REQUIREMENTS_SPEC, label: ARTIFACT_TYPE_LABELS[ARTIFACT_TYPES.BUSINESS_REQUIREMENTS_SPEC] },
  { value: ARTIFACT_TYPES.USER_STORIES, label: ARTIFACT_TYPE_LABELS[ARTIFACT_TYPES.USER_STORIES] },
  { value: ARTIFACT_TYPES.USE_CASE_DIAGRAMS, label: ARTIFACT_TYPE_LABELS[ARTIFACT_TYPES.USE_CASE_DIAGRAMS] },
  { value: ARTIFACT_TYPES.FUNCTIONAL_SPECIFICATION, label: ARTIFACT_TYPE_LABELS[ARTIFACT_TYPES.FUNCTIONAL_SPECIFICATION] },
  { value: ARTIFACT_TYPES.NON_FUNCTIONAL_REQUIREMENTS_SPEC, label: ARTIFACT_TYPE_LABELS[ARTIFACT_TYPES.NON_FUNCTIONAL_REQUIREMENTS_SPEC] },
  { value: ARTIFACT_TYPES.DATA_DICTIONARY, label: ARTIFACT_TYPE_LABELS[ARTIFACT_TYPES.DATA_DICTIONARY] },
  { value: ARTIFACT_TYPES.REQUIREMENTS_TRACEABILITY_MATRIX, label: ARTIFACT_TYPE_LABELS[ARTIFACT_TYPES.REQUIREMENTS_TRACEABILITY_MATRIX] },

  // Design artifacts
  { value: ARTIFACT_TYPES.SYSTEM_ARCHITECTURE_DOCUMENT, label: ARTIFACT_TYPE_LABELS[ARTIFACT_TYPES.SYSTEM_ARCHITECTURE_DOCUMENT] },
  { value: ARTIFACT_TYPES.DATABASE_DESIGN_DOCUMENT, label: ARTIFACT_TYPE_LABELS[ARTIFACT_TYPES.DATABASE_DESIGN_DOCUMENT] },
  { value: ARTIFACT_TYPES.API_SPECIFICATION, label: ARTIFACT_TYPE_LABELS[ARTIFACT_TYPES.API_SPECIFICATION] },
  { value: ARTIFACT_TYPES.UI_UX_DESIGN_SPECIFICATION, label: ARTIFACT_TYPE_LABELS[ARTIFACT_TYPES.UI_UX_DESIGN_SPECIFICATION] },
  { value: ARTIFACT_TYPES.TECHNICAL_DESIGN_DOCUMENT, label: ARTIFACT_TYPE_LABELS[ARTIFACT_TYPES.TECHNICAL_DESIGN_DOCUMENT] },
  { value: ARTIFACT_TYPES.DEPLOYMENT_ARCHITECTURE, label: ARTIFACT_TYPE_LABELS[ARTIFACT_TYPES.DEPLOYMENT_ARCHITECTURE] },
  { value: ARTIFACT_TYPES.SECURITY_DESIGN_DOCUMENT, label: ARTIFACT_TYPE_LABELS[ARTIFACT_TYPES.SECURITY_DESIGN_DOCUMENT] },

  // Testing artifacts
  { value: ARTIFACT_TYPES.TEST_PLAN, label: ARTIFACT_TYPE_LABELS[ARTIFACT_TYPES.TEST_PLAN] },
  { value: ARTIFACT_TYPES.TEST_CASES_SPECIFICATION, label: ARTIFACT_TYPE_LABELS[ARTIFACT_TYPES.TEST_CASES_SPECIFICATION] },
  { value: ARTIFACT_TYPES.TEST_DATA, label: ARTIFACT_TYPE_LABELS[ARTIFACT_TYPES.TEST_DATA] },
  { value: ARTIFACT_TYPES.TEST_EXECUTION_REPORT, label: ARTIFACT_TYPE_LABELS[ARTIFACT_TYPES.TEST_EXECUTION_REPORT] },
  { value: ARTIFACT_TYPES.DEFECT_REPORT, label: ARTIFACT_TYPE_LABELS[ARTIFACT_TYPES.DEFECT_REPORT] },
  { value: ARTIFACT_TYPES.PERFORMANCE_TEST_REPORT, label: ARTIFACT_TYPE_LABELS[ARTIFACT_TYPES.PERFORMANCE_TEST_REPORT] },
  { value: ARTIFACT_TYPES.SECURITY_TEST_REPORT, label: ARTIFACT_TYPE_LABELS[ARTIFACT_TYPES.SECURITY_TEST_REPORT] },
  { value: ARTIFACT_TYPES.UAT_PLAN, label: ARTIFACT_TYPE_LABELS[ARTIFACT_TYPES.UAT_PLAN] },
  { value: ARTIFACT_TYPES.UAT_REPORT, label: ARTIFACT_TYPE_LABELS[ARTIFACT_TYPES.UAT_REPORT] }
];

// Add descriptions for artifact types
export const ARTIFACT_TYPE_DESCRIPTIONS = {
  // **Initiation & Planning**
  [ARTIFACT_TYPES.BUSINESS_CASE]: 'Document justifying the project from a business perspective. Outlines business need, objectives, expected benefits, costs, and ROI. Data includes: Market analysis, cost-benefit analysis, strategic alignment.',
  [ARTIFACT_TYPES.PROJECT_CHARTER]: 'Formal, short document that officially initiates the project. Defines project scope, objectives, stakeholders, high-level risks, project manager authority. Data includes: Project goals, scope statement, key milestones, budget summary, project team roles.',
  [ARTIFACT_TYPES.STAKEHOLDER_ANALYSIS]: 'Identifies and analyzes all project stakeholders (individuals, groups, organizations). Assesses their interests, influence, and potential impact on the project.  Includes a communication plan. Data includes: Stakeholder matrix (power/interest grid), communication strategy, engagement levels.',
  [ARTIFACT_TYPES.PROJECT_PLAN]: 'Comprehensive document outlining how the project will be executed, monitored, and controlled. Includes detailed schedules, resource allocation, communication plans, milestones, and roadmap. Data includes: Gantt charts, work breakdown structure (WBS), resource histograms, communication matrix, change management plan, milestones, roadmap description, roadmap visualization data.',
  [ARTIFACT_TYPES.RISK_MANAGEMENT_PLAN]: 'Identifies potential project risks, assesses their likelihood and impact, and defines mitigation and contingency strategies. Data includes: Risk register (risk ID, description, probability, impact, mitigation), risk response matrix, escalation procedures.',

  // **Requirements Elicitation & Analysis**
  [ARTIFACT_TYPES.BUSINESS_REQUIREMENTS_SPEC]: 'Describes the high-level business needs and objectives that the solution must address. Focuses on what the business wants to achieve, not how. Data includes: Business goals, strategic objectives, high-level user needs, context diagrams.',
  [ARTIFACT_TYPES.USER_STORIES]: 'Short, simple descriptions of a feature told from the perspective of the person who desires the new capability, usually a user.  Format: "As a [user type], I want [goal] so that [benefit]". Data includes: User story cards, acceptance criteria for each story, story mapping.',
  [ARTIFACT_TYPES.USE_CASE_DIAGRAMS]: 'Visual representation of the interaction between actors (users, systems) and the system to achieve specific goals. Depicts system boundaries, use cases, and actor relationships. Data includes: Use case diagrams (UML), use case descriptions, activity diagrams to detail flows.',
  [ARTIFACT_TYPES.FUNCTIONAL_SPECIFICATION]: 'Detailed description of the functions the system must perform. Explains *what* the system will do in specific terms. Data includes: Detailed functional requirements, process flows, data flow diagrams, input/output specifications, business rules.',
  [ARTIFACT_TYPES.NON_FUNCTIONAL_REQUIREMENTS_SPEC]: 'Defines the quality attributes of the system, such as performance, security, usability, reliability, scalability. Specifies *how well* the system performs its functions. Data includes: Performance metrics (response time, throughput), security requirements, usability guidelines, availability targets.',
  [ARTIFACT_TYPES.DATA_DICTIONARY]: 'Centralized repository of information about data elements used in the system. Defines meaning, data type, format, constraints, and relationships of data. Data includes: Table of data elements, definitions, data types, validation rules, allowed values.',
  [ARTIFACT_TYPES.REQUIREMENTS_TRACEABILITY_MATRIX]: 'Table that maps requirements throughout the SDLC (from requirements to design, development, testing). Ensures all requirements are addressed and verifiable. Data includes: Traceability matrix (requirements IDs, design components, test case IDs), requirements coverage analysis.',

  // **System Design & Architecture**
  [ARTIFACT_TYPES.SYSTEM_ARCHITECTURE_DOCUMENT]: 'Describes the overall structure and components of the system, their interfaces, and interactions.  High-level blueprint of the solution. Data includes: Architectural diagrams (e.g., component diagrams, deployment diagrams), architectural patterns, technology stack, system context diagram, non-functional requirement mappings to architecture.',
  [ARTIFACT_TYPES.DATABASE_DESIGN_DOCUMENT]: 'Detailed design of the database, including schema, tables, relationships, data types, indexes, and constraints. Can include ER diagrams and schema definitions. Data includes: ER diagrams, database schema (DDL scripts), table definitions, data models, data migration strategy.',
  [ARTIFACT_TYPES.API_SPECIFICATION]: 'Detailed documentation of all APIs (Application Programming Interfaces) that the system exposes or consumes. Includes endpoints, request/response formats, authentication, and error codes. Data includes: API endpoint definitions (e.g., OpenAPI/Swagger, RAML), request/response schemas (JSON, XML), authentication methods, API flow diagrams.',
  [ARTIFACT_TYPES.UI_UX_DESIGN_SPECIFICATION]: 'Detailed design of the user interface and user experience. Includes wireframes, mockups, style guides, navigation flows, and interaction patterns. Data includes: Wireframes, mockups (high-fidelity designs), style guides, user flow diagrams, usability guidelines, accessibility considerations.',
  [ARTIFACT_TYPES.TECHNICAL_DESIGN_DOCUMENT]: 'Detailed design of the internal components, modules, algorithms, and logic of the system. Focuses on the *how* of implementation. Data includes: Component diagrams (detailed), sequence diagrams, class diagrams (if applicable), algorithm descriptions, code snippets, integration details between modules.',
  [ARTIFACT_TYPES.DEPLOYMENT_ARCHITECTURE]: 'Describes the infrastructure and environment required to deploy and run the system. Includes server configurations, network diagrams, cloud services, deployment procedures, and scalability considerations. Data includes: Deployment diagrams, infrastructure diagrams, server specifications, network topology, deployment scripts, scaling strategy, environment setup instructions.',
  [ARTIFACT_TYPES.SECURITY_DESIGN_DOCUMENT]: 'Outlines the security measures implemented in the system design to protect data and prevent vulnerabilities. Includes threat analysis, security controls, authentication/authorization mechanisms, and security policies. Data includes: Threat models, security architecture diagrams, vulnerability assessments, security control descriptions, authentication/authorization flows, security policies.',

  // **Testing & Quality Assurance**
  [ARTIFACT_TYPES.TEST_PLAN]: 'Document outlining the overall testing strategy, scope, objectives, resources, schedule, and types of testing to be performed (e.g., unit, integration, system, performance, security). Data includes: Testing scope, test objectives, testing types, testing schedule, resource allocation, test environment requirements, entry/exit criteria.',
  [ARTIFACT_TYPES.TEST_CASES_SPECIFICATION]: 'Detailed descriptions of individual test cases, including steps, expected results, and preconditions. Covers different test scenarios and conditions. Data includes: Test case IDs, test case descriptions, test steps, expected results, preconditions, test data inputs, traceability to requirements.',
  [ARTIFACT_TYPES.TEST_DATA]: 'Specific data sets used to execute test cases. Can include input data, configuration data, and data for various scenarios (positive, negative, boundary, etc.). Data includes: Test data files, database dumps for testing, configuration files for test environments.',
  [ARTIFACT_TYPES.TEST_EXECUTION_REPORT]: 'Summary of test execution activities, including test cases executed, passed, failed, and pending. Provides metrics and insights into the quality of the software. Data includes: Test execution summary, test case pass/fail counts, defect metrics, environment details, execution dates, test logs (links or summaries).',
  [ARTIFACT_TYPES.DEFECT_REPORT]: 'Detailed reports for each defect found during testing. Includes description, steps to reproduce, severity, priority, and status. Often managed in a defect tracking system (e.g., Jira, Bugzilla). Data includes: Defect ID, defect description, steps to reproduce, severity, priority, assigned developer, status, resolution details, resolutionDate, attachments.',
  [ARTIFACT_TYPES.PERFORMANCE_TEST_REPORT]: 'Report specifically for performance testing (load, stress, soak). Includes performance metrics, analysis of bottlenecks, and recommendations for improvement. Data includes: Performance metrics (response time, throughput, latency), load test graphs, bottleneck analysis, performance tuning recommendations.',
  [ARTIFACT_TYPES.SECURITY_TEST_REPORT]: 'Report from security testing (vulnerability scanning, penetration testing). Details vulnerabilities found, risk levels, and remediation recommendations. Data includes: Vulnerability scan reports, penetration testing findings, risk ratings, remediation actions, security compliance status.',
  [ARTIFACT_TYPES.UAT_PLAN]: 'Plan for User Acceptance Testing, outlining the scope, objectives, participants, schedule, and criteria for user acceptance. Data includes: UAT scope, UAT objectives, UAT participants, UAT schedule, UAT entry/exit criteria, UAT test scenarios, user acceptance forms.',
  [ARTIFACT_TYPES.UAT_REPORT]: 'Report summarizing the results of User Acceptance Testing. Documents whether the system meets user needs and acceptance criteria. Data includes: UAT execution summary, user feedback, acceptance status, list of issues found during UAT, sign-off status.'
};

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
    ARTIFACT_TYPES.BUSINESS_CASE,
    ARTIFACT_TYPES.PROJECT_CHARTER,
    ARTIFACT_TYPES.STAKEHOLDER_ANALYSIS,
    ARTIFACT_TYPES.PROJECT_PLAN,
    ARTIFACT_TYPES.RISK_MANAGEMENT_PLAN,
  ],
  REQUIREMENTS_TAB: [
    ARTIFACT_TYPES.BUSINESS_REQUIREMENTS_SPEC,
    ARTIFACT_TYPES.USER_STORIES,
    ARTIFACT_TYPES.USE_CASE_DIAGRAMS,
    ARTIFACT_TYPES.FUNCTIONAL_SPECIFICATION,
    ARTIFACT_TYPES.NON_FUNCTIONAL_REQUIREMENTS_SPEC,
    ARTIFACT_TYPES.DATA_DICTIONARY,
    ARTIFACT_TYPES.REQUIREMENTS_TRACEABILITY_MATRIX,
  ],
  DESIGN_TAB: [
    ARTIFACT_TYPES.SYSTEM_ARCHITECTURE_DOCUMENT,
    ARTIFACT_TYPES.DATABASE_DESIGN_DOCUMENT,
    ARTIFACT_TYPES.API_SPECIFICATION,
    ARTIFACT_TYPES.UI_UX_DESIGN_SPECIFICATION,
    ARTIFACT_TYPES.TECHNICAL_DESIGN_DOCUMENT,
    ARTIFACT_TYPES.DEPLOYMENT_ARCHITECTURE,
    ARTIFACT_TYPES.SECURITY_DESIGN_DOCUMENT,
  ],
  TESTING_TAB: [
    ARTIFACT_TYPES.TEST_PLAN,
    ARTIFACT_TYPES.TEST_CASES_SPECIFICATION,
    ARTIFACT_TYPES.TEST_DATA,
    ARTIFACT_TYPES.TEST_EXECUTION_REPORT,
    ARTIFACT_TYPES.DEFECT_REPORT,
    ARTIFACT_TYPES.PERFORMANCE_TEST_REPORT,
    ARTIFACT_TYPES.SECURITY_TEST_REPORT,
    ARTIFACT_TYPES.UAT_PLAN,
    ARTIFACT_TYPES.UAT_REPORT,
  ],
};