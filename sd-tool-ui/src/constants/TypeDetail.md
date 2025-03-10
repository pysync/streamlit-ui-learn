{
  "ARTIFACTS": {
    "BUSINESS_CASE-1": {
      "artifactType": "BUSINESS_CASE",
      "artifactId": "BUSINESS_CASE-1",
      "subtype": null,
      "title": "New Mobile Banking App",
      "problemStatement": "Customers lack convenient mobile access to banking services.",
      "proposedSolution": "Develop a user-friendly mobile banking application.",
      "businessObjectives": "Increase customer satisfaction, reduce branch traffic.",
      "expectedBenefits": "Improved customer retention, cost savings.",
      "costs": "$500,000 development, $50,000 annual maintenance.",
      "roiAnalysis": "Projected ROI of 20% within 3 years.",
      "alternativesConsidered": "Outsourcing vs. in-house development.",
      "conclusion": "Recommend in-house native mobile app development.",
      "references": [],
      "visualization": [ { "type": "text", "label": "Text View" } ]
    },
    "PROJECT_CHARTER-1": {
      "artifactType": "PROJECT_CHARTER",
      "artifactId": "PROJECT_CHARTER-1",
      "subtype": null,
      "projectName": "Mobile Banking App Project",
      "projectManager": "Jane Doe",
      "projectSponsor": "John Smith, VP Retail Banking",
      "projectPurpose": "Provide customers mobile banking access.",
      "projectObjectives": "Launch app in 9 months, 4-star rating, 10k users.",
      "projectScope": "Core banking features: account summary, transfers, bill pay.",
      "keyMilestones": "Requirements (M1), Design (M3), Beta (M7), Launch (M9).",
      "budgetSummary": "Total budget: $550,000",
      "stakeholders": "Customers, Executives, IT, Marketing.",
      "projectTeam": "PM, BA, UI/UX, iOS Devs, Android Devs, QA.",
      "references": [{ "artifactType": "BUSINESS_CASE", "artifactId": "BUSINESS_CASE-1" }],
      "visualization": [ { "type": "text", "label": "Document View" } ]
    },
    "STAKEHOLDER_ANALYSIS-1": {
      "artifactType": "STAKEHOLDER_ANALYSIS",
      "artifactId": "STAKEHOLDER_ANALYSIS-1",
      "subtype": null,
      "stakeholderList": [
        { "name": "Jane Customer", "role": "End User", "interest": "Convenient banking", "influence": "Medium", "engagementLevel": "Inform", "communicationRequirements": "App updates" },
        { "name": "Bank Exec", "role": "Executive Sponsor", "interest": "Project ROI", "influence": "High", "engagementLevel": "Manage", "communicationRequirements": "Monthly reports" }
      ],
      "communicationPlanSummary": "Email updates to executives, in-app announcements for users.",
      "references": [{ "artifactType": "PROJECT_CHARTER", "artifactId": "PROJECT_CHARTER-1" }],
      "visualization": [ { "type": "table", "subtype": "stakeholderMatrix", "label": "Stakeholder Matrix" }, { "type": "text", "label": "Detailed List" } ]
    },
    "PROJECT_PLAN-1": {
      "artifactType": "PROJECT_PLAN",
      "artifactId": "PROJECT_PLAN-1",
      "subtype": null,
      "projectName": "Mobile Banking App Project",
      "projectManager": "Jane Doe",
      "startDate": "2024-01-15",
      "endDate": "2024-10-15",
      "projectGoals": "Launch successful mobile banking app.",
      "projectScopeSummary": "Develop core banking features for mobile platforms.",
      "budget": 550000,
      "resourcePlan": "Team of 10: PM, BA, Designer, 3 iOS Devs, 3 Android Devs, QA.",
      "communicationPlan": "Weekly team meetings, monthly executive reports.",
      "riskManagementApproach": "Regular risk assessment meetings.",
      "qualityManagementApproach": "Code reviews, unit, integration, UAT.",
      "changeManagementPlan": "Formal change requests, CCB review.",
      "milestones": [{ "milestoneId": "M1", "milestoneName": "Requirements Complete", "dueDate": "2024-02-29", "description": "Requirements phase completed.", "status": "Complete" }],
      "roadmapDescription": "Phase 1: Core Banking, Phase 2: Advanced Features, Phase 3: Expansion.",
      "projectSchedule": { "tasks": [], "references": [] },
      "roadmapData": { "lanes": [], "events": [] },
      "references": [{ "artifactType": "PROJECT_CHARTER", "artifactId": "PROJECT_CHARTER-1" }, { "artifactType": "RISK_MANAGEMENT_PLAN", "artifactId": "RISK_MANAGEMENT_PLAN-1" }],
      "visualization": [ { "type": "gantt", "subtype": "ganttChart", "label": "Gantt Chart" }, { "type": "roadmap", "subtype": "roadmapTimeline", "label": "Roadmap" }, { "type": "text", "label": "Document View" } ]
    },
    "RISK_MANAGEMENT_PLAN-1": {
      "artifactType": "RISK_MANAGEMENT_PLAN",
      "artifactId": "RISK_MANAGEMENT_PLAN-1",
      "subtype": null,
      "riskRegister": [
        { "riskId": "R1", "riskDescription": "Security vulnerability", "category": "Technical", "probability": "Medium", "impact": "High", "mitigationStrategy": "Security audits", "contingencyPlan": "Security patch", "owner": "Security Team", "status": "Open" }
      ],
      "riskAssessmentMatrix": [["Low", "Medium", "High"], ["Medium", "High", "Critical"]],
      "escalationProcedures": "High and Critical risks escalated to PM and Sponsor.",
      "references": [{ "artifactType": "PROJECT_CHARTER", "artifactId": "PROJECT_CHARTER-1" }],
      "visualization": [ { "type": "table", "subtype": "riskRegister", "label": "Risk Register" }, { "type": "text", "label": "Document View" } ]
    },
    "BUSINESS_REQUIREMENTS_SPEC-1": {
      "artifactType": "BUSINESS_REQUIREMENTS_SPEC",
      "artifactId": "BUSINESS_REQUIREMENTS_SPEC-1",
      "subtype": null,
      "introduction": "This document outlines the business requirements for the Mobile Banking App.",
      "overallDescription": "The app aims to provide core banking features to customers on mobile platforms.",
      "businessGoals": "Increase customer engagement and improve online service offerings.",
      "businessContext": "The current market trend shows a high demand for mobile banking solutions.",
      "userNeeds": "Users need to easily check balances, transfer funds, and pay bills on their mobile devices.",
      "constraints": "The application must comply with all relevant banking regulations and security standards.",
      "glossary": "Account, Transaction, Balance, User, etc.",
      "references": [{ "artifactType": "BUSINESS_CASE", "artifactId": "BUSINESS_CASE-1" }, { "artifactType": "PROJECT_CHARTER", "artifactId": "PROJECT_CHARTER-1" }],
      "visualization": [ { "type": "text", "label": "Document View" } ]
    },
    "USER_STORIES-1": {
      "artifactType": "USER_STORIES",
      "artifactId": "USER_STORIES-1",
      "subtype": null,
      "userStories": [
        { "storyId": "US1", "asA": "Customer", "iWantTo": "check my account balance", "soThat": "I can manage my finances effectively.", "acceptanceCriteria": "Balance is displayed accurately and in real-time.", "priority": "High", "storyPoints": 3, "status": "Ready" }
      ],
      "storyMap": {},
      "references": [{ "artifactType": "BUSINESS_REQUIREMENTS_SPEC", "artifactId": "BUSINESS_REQUIREMENTS_SPEC-1" }],
      "visualization": [ { "type": "list", "subtype": "userStoriesList", "label": "User Stories List" }, { "type": "cards", "subtype": "userStoryCards", "label": "User Story Cards" }, { "type": "text", "label": "Detailed User Stories" } ]
    },
    "USE_CASE_DIAGRAMS-1": {
      "artifactType": "USE_CASE_DIAGRAMS",
      "artifactId": "USE_CASE_DIAGRAMS-1",
      "subtype": null,
      "useCases": [
        { "useCaseId": "UC1", "useCaseName": "View Account Balance", "actors": ["Customer"], "description": "Allows customer to view their current account balance.", "preConditions": "Customer is logged in.", "postConditions": "Account balance is displayed.", "basicFlow": "Customer requests balance, system retrieves and displays.", "alternativeFlows": "System error, display error message." }
      ],
      "useCaseDiagramData": { "nodes": [], "edges": [] },
      "references": [{ "artifactType": "USER_STORIES", "artifactId": "USER_STORIES-1" }],
      "visualization": [ { "type": "diagram", "diagramType": "useCase", "subtype": "useCaseDiagram", "label": "Use Case Diagram" }, { "type": "text", "label": "Use Case Descriptions" } ]
    },
    "FUNCTIONAL_SPECIFICATION-1": {
      "artifactType": "FUNCTIONAL_SPECIFICATION",
      "artifactId": "FUNCTIONAL_SPECIFICATION-1",
      "subtype": null,
      "introduction": "This document provides a detailed specification of the functional requirements for the Mobile Banking App.",
      "overallDescription": "The application will enable users to perform core banking functions.",
      "functionalRequirements": [
        { "requirementId": "FR1", "requirementDescription": "The system shall allow users to view their account balance.", "input": "User request to view balance.", "output": "Display of account balance.", "processing": "System retrieves balance from database.", "rules": "Balance must be current and accurate." }
      ],
      "processFlows": "Link to process flow diagram.",
      "dataFlowDiagrams": "Link to data flow diagram.",
      "glossary": "Terms: Account, Transaction, Balance, User, etc.",
      "references": [{ "artifactType": "BUSINESS_REQUIREMENTS_SPEC", "artifactId": "BUSINESS_REQUIREMENTS_SPEC-1" }, { "artifactType": "USER_STORIES", "artifactId": "USER_STORIES-1" }, { "artifactType": "USE_CASE_DIAGRAMS", "artifactId": "USE_CASE_DIAGRAMS-1" }],
      "visualization": [ { "type": "text", "label": "Document View" }, { "type": "list", "subtype": "functionalRequirementsList", "label": "Requirements List" } ]
    },
    "NON_FUNCTIONAL_REQUIREMENTS_SPEC-1": {
      "artifactType": "NON_FUNCTIONAL_REQUIREMENTS_SPEC",
      "artifactId": "NON_FUNCTIONAL_REQUIREMENTS_SPEC-1",
      "subtype": null,
      "introduction": "This document details the non-functional requirements for the Mobile Banking App.",
      "overallDescription": "The app must be performant, secure, and user-friendly.",
      "nfrCategories": ["Performance", "Security", "Usability"],
      "nfrDetails": [
        { "nfrId": "NFR1", "category": "Performance", "requirementDescription": "Balance query response time should be less than 2 seconds.", "metric": "Response Time", "targetValue": "<2 seconds" }
      ],
      "priority": "High",
      "references": [{ "artifactType": "BUSINESS_REQUIREMENTS_SPEC", "artifactId": "BUSINESS_REQUIREMENTS_SPEC-1" }],
      "visualization": [ { "type": "table", "subtype": "nfrDetailsTable", "label": "NFR Details Table" }, { "type": "text", "label": "Detailed NFRs" } ]
    },
    "DATA_DICTIONARY-1": {
      "artifactType": "DATA_DICTIONARY",
      "artifactId": "DATA_DICTIONARY-1",
      "subtype": null,
      "dataElements": [
        { "elementName": "AccountID", "definition": "Unique identifier for a bank account.", "dataType": "Integer", "format": "Numeric, 10 digits", "constraints": "Required, Unique", "validationRules": "Must be a valid integer.", "source": "Core Banking System", "relatedElements": ["CustomerID", "TransactionID"] }
      ],
      "glossaryTerms": [{ "term": "Account", "definition": "A financial account held at the bank." }],
      "dataModelOverview": "Link to data model diagram.",
      "references": [{ "artifactType": "BUSINESS_REQUIREMENTS_SPEC", "artifactId": "BUSINESS_REQUIREMENTS_SPEC-1" }, { "artifactType": "FUNCTIONAL_SPECIFICATION", "artifactId": "FUNCTIONAL_SPECIFICATION-1" }],
      "visualization": [ { "type": "table", "subtype": "dataDictionaryTable", "label": "Data Dictionary Table" }, { "type": "text", "label": "Glossary Terms" } ]
    },
    "REQUIREMENTS_TRACEABILITY_MATRIX-1": {
      "artifactType": "REQUIREMENTS_TRACEABILITY_MATRIX",
      "artifactId": "REQUIREMENTS_TRACEABILITY_MATRIX-1",
      "subtype": null,
      "traceabilityMatrixData": [["FR1 to Design1", "FR1 to Test1"]],
      "requirementsList": ["FR1"],
      "traceableItemsList": ["Design1", "Test1"],
      "references": [{ "artifactType": "FUNCTIONAL_SPECIFICATION", "artifactId": "FUNCTIONAL_SPECIFICATION-1" }, { "artifactType": "NON_FUNCTIONAL_REQUIREMENTS_SPEC", "artifactId": "NON_FUNCTIONAL_REQUIREMENTS_SPEC-1" }, { "artifactType": "SYSTEM_ARCHITECTURE_DOCUMENT", "artifactId": "SYSTEM_ARCHITECTURE_DOCUMENT-1" }, { "artifactType": "TEST_CASES_SPECIFICATION", "artifactId": "TEST_CASES_SPECIFICATION-1" }],
      "visualization": [ { "type": "table", "subtype": "traceabilityMatrix", "label": "Traceability Matrix" }, { "type": "text", "label": "Textual Summary" } ]
    },
    "SYSTEM_ARCHITECTURE_DOCUMENT-1": {
      "artifactType": "SYSTEM_ARCHITECTURE_DOCUMENT",
      "artifactId": "SYSTEM_ARCHITECTURE_DOCUMENT-1",
      "subtype": null,
      "introduction": "This document describes the high-level system architecture for the Mobile Banking App.",
      "architectureOverview": "The system is designed using a microservices architecture.",
      "architecturalPatterns": ["Microservices", "REST API", "Event-Driven"],
      "componentDescriptions": [{ "componentName": "Account Service", "description": "Manages account-related operations.", "interfaces": "REST APIs", "references": ["Database Service"] }],
      "deploymentView": "Cloud-based deployment on AWS.",
      "technologyStack": ["Java", "Spring Boot", "PostgreSQL", "AWS"],
      "qualityAttributes": "Scalability, Security, Reliability.",
      "diagramData": { "nodes": [], "edges": [] },
      "references": [{ "artifactType": "FUNCTIONAL_SPECIFICATION", "artifactId": "FUNCTIONAL_SPECIFICATION-1" }, { "artifactType": "NON_FUNCTIONAL_REQUIREMENTS_SPEC", "artifactId": "NON_FUNCTIONAL_REQUIREMENTS_SPEC-1" }],
      "visualization": [ { "type": "diagram", "diagramType": "systemArchitecture", "subtype": "componentDiagram", "label": "Component Diagram" }, { "type": "text", "label": "Document View" } ]
    },
    "DATABASE_DESIGN_DOCUMENT-1": {
      "artifactType": "DATABASE_DESIGN_DOCUMENT",
      "artifactId": "DATABASE_DESIGN_DOCUMENT-1",
      "subtype": "OVERVIEW",
      "introduction": "This document details the database design for the Mobile Banking App.",
      "conceptualDataModel": {},
      "logicalDataModel": "SQL DDL scripts for database schema.",
      "physicalDataModel": "Database-specific schema for PostgreSQL.",
      "dataMigrationStrategy": "ETL process from legacy system.",
      "references": [{ "artifactType": "SYSTEM_ARCHITECTURE_DOCUMENT", "artifactId": "SYSTEM_ARCHITECTURE_DOCUMENT-1" }, { "artifactType": "DATA_DICTIONARY", "artifactId": "DATA_DICTIONARY-1" }],
      "visualization": [ { "type": "diagram", "diagramType": "erDiagram", "subtype": "erDiagram", "label": "ER Diagram" }, { "type": "text", "subtype": "schemaDefinition", "label": "Schema Definition" }, { "type": "text", "label": "Document View" } ],
      "tables": { // Nested tables directly within DATABASE_DESIGN_DOCUMENT
        "DATABASE_TABLE-Accounts-1": { // Key is still artifactId but nested
          "artifactType": "DATABASE_DESIGN_DOCUMENT",
          "subtype": "TABLE_DEFINITION",
          "tableName": "Accounts",
          "columns": [{ "columnName": "account_id", "dataType": "INT", "constraints": "PRIMARY KEY" }],
          "indexes": [],
          "relationships": [],
          "references": [],
          "visualization": [ { "type": "table", "subtype": "tableSchema", "label": "Table Schema" } ]
        },
        "DATABASE_TABLE-Transactions-1": {
          "artifactType": "DATABASE_DESIGN_DOCUMENT",
          "subtype": "TABLE_DEFINITION",
          "tableName": "Transactions",
          "columns": [{ "columnName": "transaction_id", "dataType": "INT", "constraints": "PRIMARY KEY" }],
          "indexes": [],
          "relationships": [],
          "references": [],
          "visualization": [ { "type": "table", "subtype": "tableSchema", "label": "Table Schema" } ]
        }
      }
    },
    "API_SPECIFICATION-1": {
      "artifactType": "API_SPECIFICATION",
      "artifactId": "API_SPECIFICATION-1",
      "subtype": "OVERVIEW",
      "introduction": "This document specifies the REST APIs for the Mobile Banking App.",
      "apiOverview": "APIs for account management, transaction processing, and user authentication.",
      "authenticationAndAuthorization": "OAuth 2.0 based authentication and RBAC authorization.",
      "errorCodes": "List of standard HTTP error codes and API-specific error codes.",
      "exampleRequestsResponses": "Examples of request and response formats for key API endpoints.",
      "apiDiagrams": {},
      "references": [{ "artifactType": "SYSTEM_ARCHITECTURE_DOCUMENT", "artifactId": "SYSTEM_ARCHITECTURE_DOCUMENT-1" }],
      "visualization": [ { "type": "apiDoc", "subtype": "swaggerUI", "label": "Interactive API Doc (Swagger UI)" }, { "type": "text", "label": "Raw Specification (JSON/YAML)" } ],
      "endpoints": { // Nested endpoints directly within API_SPECIFICATION
        "API_ENDPOINT-Accounts-1": { // Key is still artifactId but nested
          "artifactType": "API_SPECIFICATION",
          "subtype": "REST_ENDPOINT",
          "endpointPath": "/accounts",
          "method": "GET",
          "requestBodySchema": {},
          "responseBodySchema": {},
          "authentication": "OAuth 2.0",
          "parameters": [],
          "description": "Retrieve a list of user accounts.",
          "references": [{ "artifactType": "DATABASE_DESIGN_DOCUMENT", "artifactId": "DATABASE_DESIGN_DOCUMENT-1" }, { "artifactType": "FUNCTIONAL_SPECIFICATION", "artifactId": "FUNCTIONAL_SPECIFICATION-1" }],
          "visualization": [ { "type": "text", "label": "Endpoint Details" } ]
        },
        "API_ENDPOINT-Transactions-1": {
          "artifactType": "API_SPECIFICATION",
          "subtype": "REST_ENDPOINT",
          "endpointPath": "/transactions",
          "method": "POST",
          "requestBodySchema": {},
          "responseBodySchema": {},
          "authentication": "OAuth 2.0",
          "parameters": [],
          "description": "Create a new transaction.",
          "references": [{ "artifactType": "DATABASE_DESIGN_DOCUMENT", "artifactId": "DATABASE_DESIGN_DOCUMENT-1" }, { "artifactType": "FUNCTIONAL_SPECIFICATION", "artifactId": "FUNCTIONAL_SPECIFICATION-1" }],
          "visualization": [ { "type": "text", "label": "Endpoint Details" } ]
        }
      }
    },
    "UI_UX_DESIGN_SPECIFICATION-1": {
      "artifactType": "UI_UX_DESIGN_SPECIFICATION",
      "artifactId": "UI_UX_DESIGN_SPECIFICATION-1",
      "subtype": "OVERVIEW",
      "introduction": "This document details the UI/UX design for the Mobile Banking App.",
      "userPersonas": [{ "personaName": "Tech-Savvy Sarah", "description": "Young professional, frequent mobile user." }],
      "userFlows": "Diagram of user flows for key features.",
      "wireframes": [{ "screenName": "Account Summary", "wireframeImageLink": "link-to-wireframe-accounts.png", "annotations": "Displays account balances and transaction history." }],
      "mockups": [{ "screenName": "Account Summary Mockup", "mockupImageLink": "link-to-mockup-accounts.png", "annotations": "High fidelity mockup of account summary screen." }],
      "styleGuide": "Document detailing the app's visual style.",
      "interactionPatterns": "Standard navigation and interaction patterns used.",
      "navigationFlow": "Diagram showing the app's navigation structure.",
      "accessibilityConsiderations": "WCAG compliance guidelines followed.",
      "screenMaps": { "nodes": [], "edges": [] },
      "references": [{ "artifactType": "USER_STORIES", "artifactId": "USER_STORIES-1" }, { "artifactType": "FUNCTIONAL_SPECIFICATION", "artifactId": "FUNCTIONAL_SPECIFICATION-1" }, { "artifactType": "NON_FUNCTIONAL_REQUIREMENTS_SPEC", "artifactId": "NON_FUNCTIONAL_REQUIREMENTS_SPEC-1" }],
      "visualization": [ { "type": "uiDesign", "subtype": "wireframeGallery", "label": "Wireframe Gallery" }, { "type": "uiDesign", "subtype": "mockupCarousel", "label": "Mockup Carousel" }, { "type": "diagram", "diagramType": "screenFlow", "subtype": "screenMapDiagram", "label": "Screen Map Diagram" }, { "type": "text", "label": "Document View" } ],
      "screens": { // Nested screens directly within UI_UX_DESIGN_SPECIFICATION
        "UI_SCREEN-Login-1": { // Key is still artifactId but nested
          "artifactType": "UI_UX_DESIGN_SPECIFICATION",
          "subtype": "SCREEN_DESIGN",
          "screenName": "Login Screen",
          "wireframes": [],
          "mockups": [],
          "screenMaps": null,
          "references": [{ "artifactType": "FUNCTIONAL_SPECIFICATION", "artifactId": "FUNCTIONAL_SPECIFICATION-1" }, { "artifactType": "API_SPECIFICATION", "artifactId": "API_SPECIFICATION-1" }],
          "visualization": [ { "type": "uiDesign", "subtype": "wireframe", "label": "Wireframe View" } ]
        },
        "UI_SCREEN-AccountSummary-1": {
          "artifactType": "UI_UX_DESIGN_SPECIFICATION",
          "subtype": "SCREEN_DESIGN",
          "screenName": "Account Summary Screen",
          "wireframes": [],
          "mockups": [],
          "screenMaps": null,
          "references": [{ "artifactType": "FUNCTIONAL_SPECIFICATION", "artifactId": "FUNCTIONAL_SPECIFICATION-1" }, { "artifactType": "API_SPECIFICATION", "artifactId": "API_SPECIFICATION-1" }],
          "visualization": [ { "type": "uiDesign", "subtype": "mockup", "label": "Mockup View" } ]
        }
      }
    },
    "TECHNICAL_DESIGN_DOCUMENT-1": {
      "artifactType": "TECHNICAL_DESIGN_DOCUMENT",
      "artifactId": "TECHNICAL_DESIGN_DOCUMENT-1",
      "subtype": null,
      "introduction": "This document provides the detailed technical design of the Mobile Banking App.",
      "componentDetails": [{ "componentName": "Account Service", "description": "Provides account management functionalities.", "functionality": "CRUD operations for accounts, balance inquiries.", "algorithms": "Balance calculation algorithm.", "dataStructures": "Account data model.", "interfaces": "REST APIs.", "references": ["Database Service", "Auth Service"], "configuration": "Server configuration details." }],
      "moduleDescriptions": "Detailed descriptions of key modules within the system.",
      "integrationDetails": "Details on integration with external banking systems.",
      "codeSnippets": "Example code snippets for critical functionalities.",
      "sequenceDiagrams": {},
      "classDiagrams": {},
      "references": [{ "artifactType": "SYSTEM_ARCHITECTURE_DOCUMENT", "artifactId": "SYSTEM_ARCHITECTURE_DOCUMENT-1" }, { "artifactType": "DATABASE_DESIGN_DOCUMENT", "artifactId": "DATABASE_DESIGN_DOCUMENT-1" }, { "artifactType": "API_SPECIFICATION", "artifactId": "API_SPECIFICATION-1" }],
      "visualization": [ { "type": "text", "label": "Document View" }, { "type": "diagram", "diagramType": "sequenceDiagram", "subtype": "sequenceDiagram", "label": "Sequence Diagram" }, { "type": "diagram", "diagramType": "classDiagram", "subtype": "classDiagram", "label": "Class Diagram" } ]
    },
    "DEPLOYMENT_ARCHITECTURE-1": {
      "artifactType": "DEPLOYMENT_ARCHITECTURE",
      "artifactId": "DEPLOYMENT_ARCHITECTURE-1",
      "subtype": null,
      "introduction": "This document outlines the deployment architecture for the Mobile Banking App.",
      "deploymentDiagram": {},
      "infrastructureDiagram": {},
      "environmentDetails": "Details of Dev, Staging, and Production environments.",
      "serverSpecifications": "Specifications for application servers and database servers.",
      "networkTopology": "Description of network architecture and security zones.",
      "deploymentProcess": "Steps for deploying the application to each environment.",
      "scalingStrategy": "Horizontal scaling strategy for handling increased load.",
      "monitoringAndLogging": "Monitoring and logging setup for application and infrastructure.",
      "backupAndRecovery": "Backup and recovery procedures.",
      "references": [{ "artifactType": "SYSTEM_ARCHITECTURE_DOCUMENT", "artifactId": "SYSTEM_ARCHITECTURE_DOCUMENT-1" }, { "artifactType": "NON_FUNCTIONAL_REQUIREMENTS_SPEC", "artifactId": "NON_FUNCTIONAL_REQUIREMENTS_SPEC-1" }],
      "visualization": [ { "type": "diagram", "diagramType": "deployment", "subtype": "deploymentDiagram", "label": "Deployment Diagram" }, { "type": "diagram", "diagramType": "infrastructure", "subtype": "infrastructureDiagram", "label": "Infrastructure Diagram" }, { "type": "text", "label": "Document View" } ]
    },
    "SECURITY_DESIGN_DOCUMENT-1": {
      "artifactType": "SECURITY_DESIGN_DOCUMENT",
      "artifactId": "SECURITY_DESIGN_DOCUMENT-1",
      "subtype": null,
      "introduction": "This document details the security design for the Mobile Banking App.",
      "threatModel": "Description of the threat model and potential attack vectors.",
      "vulnerabilityAssessments": "Summary of vulnerability assessment activities.",
      "securityControls": [{ "controlName": "Authentication", "description": "Multi-factor authentication for user login.", "implementationDetails": "OAuth 2.0 with TOTP." }],
      "authenticationMechanism": "OAuth 2.0 based authentication.",
      "authorizationMechanism": "Role-Based Access Control (RBAC).",
      "dataProtectionMeasures": "Data encryption at rest and in transit.",
      "securityPolicies": "Links to relevant security policies and standards.",
      "incidentResponsePlan": "Plan for handling security incidents and data breaches.",
      "complianceRequirements": "GDPR, PCI DSS compliance.",
      "references": [{ "artifactType": "NON_FUNCTIONAL_REQUIREMENTS_SPEC", "artifactId": "NON_FUNCTIONAL_REQUIREMENTS_SPEC-1" }, { "artifactType": "SYSTEM_ARCHITECTURE_DOCUMENT", "artifactId": "SYSTEM_ARCHITECTURE_DOCUMENT-1" }],
      "visualization": [ { "type": "text", "label": "Document View" }, { "type": "table", "subtype": "securityControlsTable", "label": "Security Controls Table" } ]
    },
    "TEST_PLAN-1": {
      "artifactType": "TEST_PLAN",
      "artifactId": "TEST_PLAN-1",
      "subtype": null,
      "introduction": "This document outlines the test plan and strategy for the Mobile Banking App.",
      "testObjectives": "Ensure functionality, performance, security, and usability of the app.",
      "testScope": "Scope includes all core features, APIs, UI, and security aspects.",
      "testingTypes": ["Unit Testing", "Integration Testing", "System Testing", "Performance Testing", "Security Testing", "UAT"],
      "testingApproach": "Agile testing approach with continuous integration.",
      "testEnvironment": "Description of the test environment setup.",
      "testSchedule": "Timeline and schedule for different testing phases.",
      "entryCriteria": "Criteria for entering each phase of testing.",
      "exitCriteria": "Criteria for exiting each phase of testing.",
      "rolesAndResponsibilities": "Roles and responsibilities of team members in testing.",
      "testTools": ["JUnit", "Selenium", "JMeter", "OWASP ZAP"],
      "references": [{ "artifactType": "FUNCTIONAL_SPECIFICATION", "artifactId": "FUNCTIONAL_SPECIFICATION-1" }, { "artifactType": "NON_FUNCTIONAL_REQUIREMENTS_SPEC", "artifactId": "NON_FUNCTIONAL_REQUIREMENTS_SPEC-1" }, { "artifactType": "SYSTEM_ARCHITECTURE_DOCUMENT", "artifactId": "SYSTEM_ARCHITECTURE_DOCUMENT-1" }],
      "visualization": [ { "type": "text", "label": "Document View" }, { "type": "list", "subtype": "testPlanSummary", "label": "Test Plan Summary" } ]
    },
    "TEST_CASES_SPECIFICATION-1": {
      "artifactType": "TEST_CASES_SPECIFICATION",
      "artifactId": "TEST_CASES_SPECIFICATION-1",
      "subtype": null,
      "testCases": [
        { "testCaseId": "TC1", "testCaseTitle": "Login Functionality", "description": "Verify user login with valid and invalid credentials.", "preconditions": "User account setup.", "testSteps": ["Enter valid username", "Enter valid password", "Click Login"], "expectedResult": "User should be logged in successfully.", "testDataReferences": "valid_credentials.csv", "priority": "High", "status": "Ready", "traceabilityToRequirements": "FR1" }
      ],
      "testSuiteOrganization": "Test suites organized by feature area.",
      "references": [{ "artifactType": "FUNCTIONAL_SPECIFICATION", "artifactId": "FUNCTIONAL_SPECIFICATION-1" }, { "artifactType": "TEST_PLAN", "artifactId": "TEST_PLAN-1" }],
      "visualization": [ { "type": "table", "subtype": "testCasesTable", "label": "Test Cases Table" }, { "type": "text", "label": "Detailed Test Cases" } ]
    },
    "TEST_DATA-1": {
      "artifactType": "TEST_DATA",
      "artifactId": "TEST_DATA-1",
      "subtype": null,
      "testDataDescription": "Description of test data used for various test scenarios.",
      "testDataSets": "Links to test data files and databases.",
      "environmentConfiguration": "Details on test data environment setup.",
      "dataGenerationScripts": "Scripts used to generate test data.",
      "references": [{ "artifactType": "TEST_PLAN", "artifactId": "TEST_PLAN-1" }, { "artifactType": "TEST_CASES_SPECIFICATION", "artifactId": "TEST_CASES_SPECIFICATION-1" }, { "artifactType": "DATABASE_DESIGN_DOCUMENT", "artifactId": "DATABASE_DESIGN_DOCUMENT-1" }],
      "visualization": [ { "type": "text", "label": "Document View" }, { "type": "list", "subtype": "testDataSummary", "label": "Test Data Summary" } ]
    },
    "TEST_EXECUTION_REPORT-1": {
      "artifactType": "TEST_EXECUTION_REPORT",
      "artifactId": "TEST_EXECUTION_REPORT-1",
      "subtype": null,
      "executionSummary": "Summary of test execution results.",
      "testRunDetails": [{ "testCaseId": "TC1", "executionDate": "2024-08-15", "executor": "QA Tester", "status": "Passed", "result": "Test case passed as expected.", "defectsFound": [] }],
      "testMetrics": "Pass rate: 95%, Fail rate: 5%.",
      "environmentDetails": "Testing environment details.",
      "testLogs": "Links to detailed test logs.",
      "references": [{ "artifactType": "TEST_PLAN", "artifactId": "TEST_PLAN-1" }, { "artifactType": "TEST_CASES_SPECIFICATION", "artifactId": "TEST_CASES_SPECIFICATION-1" }, { "artifactType": "TEST_DATA", "artifactId": "TEST_DATA-1" }],
      "visualization": [ { "type": "report", "subtype": "testExecutionSummary", "label": "Execution Summary Report" }, { "type": "table", "subtype": "testRunDataTable", "label": "Test Run Data Table" }, { "type": "chart", "subtype": "testMetricsChart", "label": "Test Metrics Chart" } ]
    },
    "DEFECT_REPORT-1": {
      "artifactType": "DEFECT_REPORT",
      "artifactId": "DEFECT_REPORT-1",
      "subtype": null,
      "defects": [{ "defectId": "DEF1", "defectTitle": "Incorrect Login Error Message", "description": "Error message displayed is not user-friendly.", "stepsToReproduce": "Attempt login with invalid credentials.", "severity": "Medium", "priority": "High", "status": "Open", "reportedBy": "QA Tester", "assignedTo": "Developer", "resolutionDetails": null, "resolutionDate": null, "attachments": [] }],
      "defectMetrics": "Total defects: 10, Open defects: 5, Resolved defects: 5.",
      "references": [{ "artifactType": "TEST_EXECUTION_REPORT", "artifactId": "TEST_EXECUTION_REPORT-1" }, { "artifactType": "FUNCTIONAL_SPECIFICATION", "artifactId": "FUNCTIONAL_SPECIFICATION-1" }],
      "visualization": [ { "type": "list", "subtype": "defectList", "label": "Defect List" }, { "type": "cards", "subtype": "defectCards", "label": "Defect Cards" }, { "type": "report", "subtype": "defectMetricsReport", "label": "Defect Metrics Report" } ]
    },
    "PERFORMANCE_TEST_REPORT-1": {
      "artifactType": "PERFORMANCE_TEST_REPORT",
      "artifactId": "PERFORMANCE_TEST_REPORT-1",
      "subtype": null,
      "testObjectives": "Assess application performance under load.",
      "environmentDetails": "Performance testing environment setup.",
      "testScenarios": "Load test, stress test, soak test.",
      "performanceMetrics": [{ "metricName": "Response Time", "value": "1.2s", "unit": "seconds" }],
      "loadTestGraphs": "Links to load test performance graphs.",
      "bottleneckAnalysis": "Analysis of performance bottlenecks identified.",
      "recommendations": "Recommendations for performance improvements.",
      "references": [{ "artifactType": "TEST_PLAN", "artifactId": "TEST_PLAN-1" }, { "artifactType": "NON_FUNCTIONAL_REQUIREMENTS_SPEC", "artifactId": "NON_FUNCTIONAL_REQUIREMENTS_SPEC-1" }, { "artifactType": "DEPLOYMENT_ARCHITECTURE", "artifactId": "DEPLOYMENT_ARCHITECTURE-1" }],
      "visualization": [ { "type": "report", "subtype": "performanceReport", "label": "Performance Report" }, { "type": "chart", "subtype": "responseTimeGraph", "label": "Response Time Graph" }, { "type": "table", "subtype": "performanceMetricsTable", "label": "Performance Metrics Table" } ]
    },
    "SECURITY_TEST_REPORT-1": {
      "artifactType": "SECURITY_TEST_REPORT",
      "artifactId": "SECURITY_TEST_REPORT-1",
      "subtype": null,
      "testObjectives": "Identify potential security vulnerabilities in the application.",
      "environmentDetails": "Security testing environment details.",
      "testingMethodology": "Vulnerability scanning, penetration testing.",
      "vulnerabilitiesFound": [{ "vulnerabilityId": "VULN1", "description": "SQL Injection vulnerability in login module.", "riskLevel": "High", "cvssScore": "9.0", "affectedComponents": "Login API", "remediationRecommendations": "Implement parameterized queries." }],
      "securityMetrics": "Number of vulnerabilities found, severity distribution.",
      "complianceStatus": "Compliance status against security standards.",
      "references": [{ "artifactType": "TEST_PLAN", "artifactId": "TEST_PLAN-1" }, { "artifactType": "SECURITY_DESIGN_DOCUMENT", "artifactId": "SECURITY_DESIGN_DOCUMENT-1" }, { "artifactType": "NON_FUNCTIONAL_REQUIREMENTS_SPEC", "artifactId": "NON_FUNCTIONAL_REQUIREMENTS_SPEC-1" }],
      "visualization": [ { "type": "report", "subtype": "securityReport", "label": "Security Report" }, { "type": "table", "subtype": "vulnerabilityListTable", "label": "Vulnerability List Table" }, { "type": "chart", "subtype": "riskDistributionChart", "label": "Risk Distribution Chart" } ]
    },
    "UAT_PLAN-1": {
      "artifactType": "UAT_PLAN",
      "artifactId": "UAT_PLAN-1",
      "subtype": null,
      "introduction": "This document outlines the User Acceptance Testing (UAT) plan.",
      "uatObjectives": "Verify that the application meets user needs and acceptance criteria.",
      "uatScope": "Scope of UAT including features and user workflows to be tested.",
      "uatParticipants": "List of users and stakeholders participating in UAT.",
      "uatSchedule": "Schedule for UAT execution.",
      "uatEnvironment": "Description of the UAT environment.",
      "uatEntryCriteria": "Criteria for starting UAT.",
      "uatExitCriteria": "Criteria for UAT completion and sign-off.",
      "uatTestScenarios": "Description of UAT test scenarios and user stories to be tested.",
      "uatRolesAndResponsibilities": "Roles and responsibilities during UAT.",
      "references": [{ "artifactType": "TEST_PLAN", "artifactId": "TEST_PLAN-1" }, { "artifactType": "TEST_CASES_SPECIFICATION", "artifactId": "TEST_CASES_SPECIFICATION-1" }, { "artifactType": "TEST_DATA", "artifactId": "TEST_DATA-1" }],
      "visualization": [ { "type": "text", "label": "Document View" }, { "type": "list", "subtype": "uatPlanSummary", "label": "UAT Plan Summary" } ]
    },
    "UAT_REPORT-1": {
      "artifactType": "UAT_REPORT",
      "artifactId": "UAT_REPORT-1",
      "subtype": null,
      "uatExecutionSummary": "Summary of UAT execution and outcomes.",
      "userFeedback": "Summary of user feedback collected during UAT.",
      "acceptanceStatus": "Accepted",
      "issuesFoundDuringUAT": [{ "issueId": "UATI1", "description": "Minor usability issue with navigation." }],
      "uatSignOff": "UAT sign-off status and sign-off date.",
      "uatTestCasesExecuted": "Summary of UAT test cases executed and results.",
      "references": [{ "artifactType": "UAT_PLAN", "artifactId": "UAT_PLAN-1" }, { "artifactType": "TEST_EXECUTION_REPORT", "artifactId": "TEST_EXECUTION_REPORT-1" }, { "artifactType": "DEFECT_REPORT", "artifactId": "DEFECT_REPORT-1" }],
      "visualization": [ { "type": "report", "subtype": "uatReportSummary", "label": "UAT Report Summary" }, { "type": "text", "subtype": "userFeedbackText", "label": "User Feedback Text" }, { "type": "list", "subtype": "uatIssuesList", "label": "UAT Issues List" } ]
    }
  }
}