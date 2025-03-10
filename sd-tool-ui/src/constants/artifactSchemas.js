import { ARTIFACT_TYPES } from './sdlcConstants';

/**
 * Data structure schemas for artifact types
 */
export const ARTIFACT_SCHEMAS = {
  // Project Charter Schema
  [ARTIFACT_TYPES.PROJECT_CHARTER]: {
    title: { type: 'string', required: true },
    description: { type: 'string' },
    sections: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', required: true },
          label: { type: 'string', required: true },
          content: { type: 'string' }
        }
      },
      default: [
        { id: 'overview', label: 'Overview', content: '# Project Overview\n\nBrief description of the project and its purpose.' },
        { id: 'vision', label: 'Vision & Goals', content: '# Vision Statement\n\nA clear statement of what the project aims to achieve.\n\n## Project Goals\n\n1. \n2. \n3. ' },
        { id: 'scope', label: 'Scope', content: '# Project Scope\n\n## In Scope\n\n- \n- \n\n## Out of Scope\n\n- \n- ' },
        { id: 'stakeholders', label: 'Stakeholders', content: '# Key Stakeholders\n\n| Role | Name | Department | Responsibilities |\n|-----|------|------------|----------------|\n| Project Sponsor | | | |\n| Project Manager | | | |\n| Business Owner | | | |\n| Technical Lead | | | |' },
        { id: 'timeline', label: 'Timeline', content: '# Project Timeline\n\n| Milestone | Target Date | Deliverables |\n|-----------|-------------|-------------|\n| Project Start | | |\n| Requirements Complete | | |\n| Design Complete | | |\n| Development Complete | | |\n| Testing Complete | | |\n| Project Launch | | |' },
        { id: 'budget', label: 'Budget', content: '# Budget Summary\n\n| Category | Amount | Notes |\n|----------|--------|-------|\n| Personnel | | |\n| Hardware | | |\n| Software | | |\n| Services | | |\n| Contingency | | |\n| **Total** | | |' },
        { id: 'risks', label: 'Risks', content: '# Initial Risk Assessment\n\n| Risk | Impact | Probability | Mitigation Strategy |\n|------|--------|------------|---------------------|\n| | | | |' },
        { id: 'approvals', label: 'Approvals', content: '# Approvals\n\n| Role | Name | Signature | Date |\n|------|------|-----------|------|\n| Project Sponsor | | | |\n| Project Manager | | | |\n| Business Owner | | | |' }
      ]
    }
  },

  // Project Plan Schema
  [ARTIFACT_TYPES.PROJECT_PLAN]: {
    title: { type: 'string', required: true },
    description: { type: 'string' },
    sections: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', required: true },
          label: { type: 'string', required: true },
          content: { type: 'string' }
        }
      },
      default: [
        { id: 'introduction', label: 'Introduction', content: '# Introduction\n\nThis project plan outlines the approach, resources, and timeline for the project.' },
        { id: 'approach', label: 'Approach', content: '# Project Approach\n\nDescription of the methodology and approach to be used for this project.' },
        { id: 'organization', label: 'Organization', content: '# Project Organization\n\n## Team Structure\n\n[Describe the team structure]\n\n## Roles and Responsibilities\n\n| Role | Responsibilities | Assigned To |\n|------|-----------------|------------|\n| | | |' },
        { id: 'communication', label: 'Communication', content: '# Communication Plan\n\n| Stakeholder Group | Information Needs | Frequency | Format | Owner |\n|-------------------|-------------------|-----------|--------|-------|\n| | | | | |' },
        { id: 'quality', label: 'Quality', content: '# Quality Management\n\n## Quality Objectives\n\n- \n- \n\n## Quality Assurance Approach\n\n[Describe the QA approach]\n\n## Quality Control Measures\n\n- \n- ' }
      ]
    },
    timeline: {
      type: 'object',
      properties: {
        startDate: { type: 'date', required: true },
        endDate: { type: 'date', required: true },
        workingDays: { type: 'array', items: { type: 'number' } }
      },
      default: {
        startDate: new Date(),
        endDate: new Date(new Date().setMonth(new Date().getMonth() + 3)),
        workingDays: [1, 2, 3, 4, 5] // Monday to Friday
      }
    },
    phases: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', required: true },
          name: { type: 'string', required: true },
          startDate: { type: 'date', required: true },
          endDate: { type: 'date', required: true },
          color: { type: 'string' },
          description: { type: 'string' },
          completionPercentage: { type: 'number', default: 0 }
        }
      },
      default: []
    },
    tasks: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', required: true },
          name: { type: 'string', required: true },
          phaseId: { type: 'string' },
          startDate: { type: 'date', required: true },
          endDate: { type: 'date', required: true },
          dependencies: { type: 'array', items: { type: 'string' } },
          assignees: { type: 'array', items: { type: 'string' } },
          status: { 
            type: 'string', 
            enum: ['not_started', 'in_progress', 'completed', 'on_hold'],
            default: 'not_started'
          },
          completionPercentage: { type: 'number', default: 0 },
          priority: { 
            type: 'string', 
            enum: ['low', 'medium', 'high', 'critical'],
            default: 'medium'
          },
          notes: { type: 'string' }
        }
      },
      default: []
    },
    milestones: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', required: true },
          name: { type: 'string', required: true },
          date: { type: 'date', required: true },
          description: { type: 'string' },
          deliverables: { type: 'array', items: { type: 'string' } },
          status: { 
            type: 'string', 
            enum: ['pending', 'completed', 'at_risk', 'missed'],
            default: 'pending'
          }
        }
      },
      default: []
    },
    resources: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', required: true },
          name: { type: 'string', required: true },
          role: { type: 'string' },
          email: { type: 'string' },
          availability: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                startDate: { type: 'date', required: true },
                endDate: { type: 'date', required: true },
                percentage: { type: 'number', default: 100 }
              }
            }
          }
        }
      },
      default: []
    }
  },

  // Business Requirements Schema
  [ARTIFACT_TYPES.BUSINESS_REQUIREMENTS]: {
    title: { type: 'string', required: true },
    description: { type: 'string' },
    sections: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', required: true },
          label: { type: 'string', required: true },
          content: { type: 'string' }
        }
      },
      default: [
        { id: 'overview', label: 'Overview', content: '# Overview\n\nProvide a high-level overview of the business need.' },
        { id: 'background', label: 'Background', content: '# Background\n\nRelevant background information and context for these requirements.' },
        { id: 'stakeholders', label: 'Stakeholders', content: '# Stakeholders\n\n| Role | Name | Department | Interests |\n|-----|------|------------|----------|\n| | | | |' },
        { id: 'objectives', label: 'Objectives', content: '# Business Objectives\n\n1. \n2. \n3. ' },
        { id: 'success', label: 'Success Criteria', content: '# Success Criteria\n\n| Criteria | Measurement | Target |\n|----------|-------------|--------|\n| | | |' },
        { id: 'constraints', label: 'Constraints', content: '# Constraints\n\n## Budget\n\n## Timeline\n\n## Resources\n\n## Technical Limitations' },
        { id: 'assumptions', label: 'Assumptions', content: '# Assumptions\n\n- \n- \n- ' },
        { id: 'requirements', label: 'Requirements', content: '# Business Requirements\n\n| ID | Requirement | Priority | Source | Rationale |\n|----|-------------|----------|--------|----------|\n| BR001 | | | | |\n| BR002 | | | | |' }
      ]
    },
    businessRequirements: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', required: true },
          description: { type: 'string', required: true },
          priority: { 
            type: 'string', 
            enum: ['low', 'medium', 'high', 'critical'],
            default: 'medium'
          },
          source: { type: 'string' },
          rationale: { type: 'string' },
          acceptanceCriteria: { type: 'string' },
          notes: { type: 'string' }
        }
      },
      default: []
    }
  },

  // Functional Requirements Schema
  [ARTIFACT_TYPES.FUNCTIONAL_REQUIREMENTS]: {
    title: { type: 'string', required: true },
    description: { type: 'string' },
    sections: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', required: true },
          label: { type: 'string', required: true },
          content: { type: 'string' }
        }
      },
      default: [
        { id: 'overview', label: 'Overview', content: '# Overview\n\nProvide a high-level overview of the functionality.' },
        { id: 'scope', label: 'Scope', content: '# Scope\n\n## In Scope\n\n- Feature 1\n- Feature 2\n\n## Out of Scope\n\n- Feature 3\n- Feature 4' },
        { id: 'userRoles', label: 'User Roles', content: '# User Roles\n\n| Role | Description | Permissions |\n|------|-------------|------------|\n| Admin | | |\n| User | | |' },
        { id: 'requirements', label: 'Requirements', content: '# Functional Requirements\n\n## Functions List\n\n| ID | Module | Name | Screen | Detail | Status | Priority |\n|-----|---------|------|--------|---------|---------|----------|\n| F001 | | | | | planned | medium |' },
        { id: 'useCases', label: 'Use Cases', content: '# Use Cases\n\n## UC1: [Use Case Name]\n\n**Actor**: [Actor Name]\n\n**Preconditions**:\n- [Precondition 1]\n\n**Steps**:\n1. [Step 1]\n2. [Step 2]\n\n**Postconditions**:\n- [Postcondition 1]\n\n**Alternate Flows**:\n- [Alternate Flow 1]' },
        { id: 'interfaces', label: 'Interfaces', content: '# User Interfaces\n\n## Screen 1: [Screen Name]\n\n**Description**: [Brief description]\n\n**Mockup**: [Link or embedded image]\n\n**Elements**:\n- [UI Element 1]: [Description]\n- [UI Element 2]: [Description]' }
      ]
    },
    functions: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', required: true },
          module: { type: 'string', required: true },
          name: { type: 'string', required: true },
          screen: { type: 'string' },
          detail: { type: 'string' },
          status: { 
            type: 'string', 
            enum: ['planned', 'in-progress', 'completed', 'on-hold'],
            default: 'planned'
          },
          priority: { 
            type: 'string', 
            enum: ['low', 'medium', 'high', 'critical'],
            default: 'medium'
          }
        }
      },
      default: []
    },
    userRoles: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', required: true },
          name: { type: 'string', required: true },
          description: { type: 'string' },
          permissions: { type: 'array', items: { type: 'string' } }
        }
      },
      default: []
    },
    useCases: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', required: true },
          name: { type: 'string', required: true },
          actor: { type: 'string', required: true },
          preconditions: { type: 'array', items: { type: 'string' } },
          steps: { type: 'array', items: { type: 'string' }, required: true },
          postconditions: { type: 'array', items: { type: 'string' } },
          alternateFlows: { type: 'array', items: { type: 'string' } }
        }
      },
      default: []
    }
  },

  // Non-Functional Requirements Schema
  [ARTIFACT_TYPES.NON_FUNCTIONAL_REQUIREMENTS]: {
    title: { type: 'string', required: true },
    description: { type: 'string' },
    sections: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', required: true },
          label: { type: 'string', required: true },
          content: { type: 'string' }
        }
      },
      default: [
        { id: 'overview', label: 'Overview', content: '# Overview\n\nProvide a high-level overview of the non-functional requirements.' },
        { id: 'performance', label: 'Performance', content: '# Performance Requirements\n\n| ID | Requirement | Metric | Target | Priority |\n|-----|------------|--------|--------|----------|\n| NFR001 | | | | |' },
        { id: 'security', label: 'Security', content: '# Security Requirements\n\n| ID | Requirement | Implementation | Priority |\n|-----|------------|----------------|----------|\n| NFR101 | | | |' },
        { id: 'usability', label: 'Usability', content: '# Usability Requirements\n\n| ID | Requirement | User Type | Priority |\n|-----|------------|-----------|----------|\n| NFR201 | | | |' },
        { id: 'reliability', label: 'Reliability', content: '# Reliability Requirements\n\n| ID | Requirement | Metric | Target | Priority |\n|-----|------------|--------|--------|----------|\n| NFR301 | | | | |' },
        { id: 'scalability', label: 'Scalability', content: '# Scalability Requirements\n\n| ID | Requirement | Metric | Target | Priority |\n|-----|------------|--------|--------|----------|\n| NFR401 | | | | |' }
      ]
    },
    requirements: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', required: true },
          category: { 
            type: 'string', 
            enum: ['performance', 'security', 'usability', 'reliability', 'scalability', 'maintainability', 'portability', 'other'],
            default: 'performance'
          },
          description: { type: 'string', required: true },
          metric: { type: 'string' },
          target: { type: 'string' },
          priority: { 
            type: 'string', 
            enum: ['low', 'medium', 'high', 'critical'],
            default: 'medium'
          },
          testMethod: { type: 'string' },
          notes: { type: 'string' }
        }
      },
      default: []
    }
  },

  // User Stories Schema
  [ARTIFACT_TYPES.USER_STORIES]: {
    title: { type: 'string', required: true },
    description: { type: 'string' },
    sections: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', required: true },
          label: { type: 'string', required: true },
          content: { type: 'string' }
        }
      },
      default: [
        { id: 'overview', label: 'Overview', content: '# User Stories Overview\n\nThis document contains user stories that describe the functionality from an end-user perspective.' },
        { id: 'epics', label: 'Epics', content: '# Epics\n\n## Epic 1: [Epic Name]\n\n**Description**: [Epic description]\n\n**User Stories**:\n- US001\n- US002' }
      ]
    },
    stories: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', required: true },
          title: { type: 'string', required: true },
          asA: { type: 'string', required: true },
          iWant: { type: 'string', required: true },
          soThat: { type: 'string', required: true },
          acceptanceCriteria: { 
            type: 'array', 
            items: { type: 'string' },
            default: []
          },
          priority: { 
            type: 'string', 
            enum: ['low', 'medium', 'high', 'critical'],
            default: 'medium'
          },
          status: { 
            type: 'string', 
            enum: ['backlog', 'planned', 'in-progress', 'completed', 'on-hold'],
            default: 'backlog'
          },
          epicId: { type: 'string' },
          estimatedPoints: { type: 'number', default: 0 },
          relatedRequirements: { type: 'array', items: { type: 'string' }, default: [] },
          notes: { type: 'string' }
        }
      },
      default: []
    },
    epics: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', required: true },
          name: { type: 'string', required: true },
          description: { type: 'string' },
          priority: { 
            type: 'string', 
            enum: ['low', 'medium', 'high', 'critical'],
            default: 'medium'
          },
          status: { 
            type: 'string', 
            enum: ['backlog', 'planned', 'in-progress', 'completed', 'on-hold'],
            default: 'backlog'
          }
        }
      },
      default: []
    }
  },

  // System Architecture Schema
  [ARTIFACT_TYPES.SYSTEM_ARCHITECTURE]: {
    title: { type: 'string', required: true },
    description: { type: 'string' },
    sections: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', required: true },
          label: { type: 'string', required: true },
          content: { type: 'string' }
        }
      },
      default: [
        { id: 'overview', label: 'Overview', content: '# Architecture Overview\n\nProvide a high-level overview of the system architecture.' },
        { id: 'principles', label: 'Principles', content: '# Architectural Principles\n\n1. [Principle 1]\n2. [Principle 2]' },
        { id: 'patterns', label: 'Patterns', content: '# Architectural Patterns\n\n## [Pattern 1]\n\n[Description of how this pattern is applied]' },
        { id: 'components', label: 'Components', content: '# System Components\n\n## [Component 1]\n\n**Purpose**: [Purpose]\n\n**Responsibilities**:\n- [Responsibility 1]\n- [Responsibility 2]\n\n**Interfaces**:\n- [Interface 1]' },
        { id: 'deployment', label: 'Deployment', content: '# Deployment Architecture\n\n[Description of deployment architecture]' },
        { id: 'quality', label: 'Quality', content: '# Quality Attributes\n\n## Performance\n\n[Performance considerations]\n\n## Security\n\n[Security considerations]\n\n## Scalability\n\n[Scalability considerations]' },
        { id: 'technology', label: 'Technology', content: '# Technology Stack\n\n| Layer | Technology | Version | Purpose |\n|-------|------------|---------|--------|\n| | | | |' }
      ]
    },
    components: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', required: true },
          name: { type: 'string', required: true },
          description: { type: 'string' },
          type: { type: 'string' },
          responsibilities: { type: 'array', items: { type: 'string' } },
          interfaces: { type: 'array', items: { type: 'string' } },
          dependencies: { type: 'array', items: { type: 'string' } },
          technologies: { type: 'array', items: { type: 'string' } }
        }
      },
      default: []
    },
    interfaces: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', required: true },
          name: { type: 'string', required: true },
          description: { type: 'string' },
          type: { 
            type: 'string', 
            enum: ['synchronous', 'asynchronous', 'rest', 'soap', 'message', 'file', 'other'],
            default: 'rest'
          },
          provider: { type: 'string' },
          consumer: { type: 'string' },
          operations: { type: 'array', items: { type: 'string' } }
        }
      },
      default: []
    },
    diagrams: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', required: true },
          name: { type: 'string', required: true },
          type: { 
            type: 'string', 
            enum: ['context', 'container', 'component', 'deployment', 'sequence', 'other'],
            default: 'context'
          },
          description: { type: 'string' },
          content: { type: 'string' } // Could be SVG, JSON for diagram tool, or URL
        }
      },
      default: []
    }
  },

  // Database Design Schema
  [ARTIFACT_TYPES.DATABASE_DESIGN]: {
    title: { type: 'string', required: true },
    description: { type: 'string' },
    sections: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', required: true },
          label: { type: 'string', required: true },
          content: { type: 'string' }
        }
      },
      default: [
        { id: 'overview', label: 'Overview', content: '# Database Design Overview\n\nProvide a high-level overview of the database design.' },
        { id: 'conceptual', label: 'Conceptual Model', content: '# Conceptual Data Model\n\n[Description of the conceptual data model]' },
        { id: 'logical', label: 'Logical Model', content: '# Logical Data Model\n\n[Description of the logical data model]' },
        { id: 'physical', label: 'Physical Model', content: '# Physical Data Model\n\n[Description of the physical data model]' },
        { id: 'tables', label: 'Tables', content: '# Table Definitions\n\n## [Table 1]\n\n| Column | Data Type | Constraints | Description |\n|--------|-----------|-------------|-------------|\n| | | | |' },
        { id: 'relationships', label: 'Relationships', content: '# Entity Relationships\n\n| Entity 1 | Relationship | Entity 2 | Description |\n|----------|--------------|----------|-------------|\n| | | | |' },
        { id: 'indexes', label: 'Indexes', content: '# Indexes\n\n| Name | Table | Columns | Unique | Description |\n|------|-------|---------|--------|-------------|\n| | | | | |' },
        { id: 'migration', label: 'Migration', content: '# Data Migration Strategy\n\n[Description of the data migration strategy]' }
      ]
    },
    databaseInfo: {
      type: 'object',
      properties: {
        name: { type: 'string', required: true },
        type: { type: 'string', required: true },
        version: { type: 'string' },
        description: { type: 'string' }
      },
      default: {
        name: '',
        type: '',
        version: '',
        description: ''
      }
    },
    entities: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', required: true },
          name: { type: 'string', required: true },
          description: { type: 'string' },
          physicalName: { type: 'string' },
          attributes: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: { type: 'string', required: true },
                description: { type: 'string' },
                dataType: { type: 'string', required: true },
                constraints: { type: 'array', items: { type: 'string' } },
                defaultValue: { type: 'string' },
                notes: { type: 'string' }
              }
            }
          }
        }
      },
      default: []
    },
    relationships: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', required: true },
          name: { type: 'string' },
          sourceEntityId: { type: 'string', required: true },
          targetEntityId: { type: 'string', required: true },
          sourceCardinality: { type: 'string', required: true },
          targetCardinality: { type: 'string', required: true },
          relationshipType: { 
            type: 'string', 
            enum: ['one_to_one', 'one_to_many', 'many_to_many'],
            default: 'one_to_many'
          },
          onDelete: { type: 'string' },
          onUpdate: { type: 'string' },
          notes: { type: 'string' }
        }
      },
      default: []
    },
    indexes: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string', required: true },
          table: { type: 'string', required: true },
          columns: { type: 'array', items: { type: 'string' }, required: true },
          unique: { type: 'boolean', default: false },
          description: { type: 'string' }
        }
      },
      default: []
    }
  },

  // API Specification Schema
  [ARTIFACT_TYPES.API_SPECIFICATION]: {
    title: { type: 'string', required: true },
    description: { type: 'string' },
    sections: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', required: true },
          label: { type: 'string', required: true },
          content: { type: 'string' }
        }
      },
      default: [
        { id: 'overview', label: 'Overview', content: '# API Overview\n\nProvide a high-level overview of' }
      ]
    }
  }
};

/**
 * Create a default/empty object based on an artifact type schema
 * @param {string} artifactType - The artifact type
 * @return {Object} A default empty object following the schema
 */
export const createEmptyArtifact = (artifactType) => {
  const schema = ARTIFACT_SCHEMAS[artifactType];
  if (!schema) return null;
  
  const result = {};
  
  // Create basic metadata
  result.artifactType = artifactType;
  result.artifactId = `${artifactType.toUpperCase()}-${Date.now()}`;
  result.title = '';
  result.description = '';
  
  // Add references and visualization arrays
  result.references = [];
  result.visualization = [...(ARTIFACT_VISUALIZATIONS[artifactType] || [])];
  
  // Process schema to add empty arrays and default values
  Object.entries(schema).forEach(([key, config]) => {
    if (config.type === 'array') {
      result[key] = [];
    } else if (config.type === 'object' && config.properties) {
      result[key] = {};
      Object.entries(config.properties).forEach(([propKey, propConfig]) => {
        if (propConfig.default !== undefined) {
          result[key][propKey] = propConfig.default;
        }
      });
    } else if (config.default !== undefined) {
      result[key] = config.default;
    } else if (config.type === 'string') {
      result[key] = '';
    } else if (config.type === 'number') {
      result[key] = 0;
    } else if (config.type === 'boolean') {
      result[key] = false;
    }
  });
  
  return result;
};

/**
 * Validate an artifact object against its schema
 * @param {Object} artifact - The artifact object to validate
 * @return {Object} Validation result with isValid and errors properties
 */
export const validateArtifact = (artifact) => {
  const schema = ARTIFACT_SCHEMAS[artifact.artifactType];
  if (!schema) {
    return { isValid: false, errors: ['Unknown artifact type'] };
  }
  
  const errors = [];
  
  // Validate the artifact against its schema
  Object.entries(schema).forEach(([key, config]) => {
    // Check required fields
    if (config.required && !artifact[key]) {
      errors.push(`Missing required field: ${key}`);
    }
    
    // Additional validation could be added here based on types, patterns, etc.
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
}; 