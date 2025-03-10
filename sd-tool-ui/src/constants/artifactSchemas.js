import { ARTIFACT_TYPES } from './sdlcConstants';

/**
 * Data structure schemas for artifact types
 */
export const ARTIFACT_SCHEMAS = {
  // Business Requirements Document Schema
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
        { id: 'stakeholders', label: 'Stakeholders', content: '# Stakeholders\n\n| Role | Name | Department | Responsibilities |\n|-----|------|------------|----------------|\n| Project Sponsor | | | |\n| Business Owner | | | |\n| End Users | | | |' },
        { id: 'objectives', label: 'Objectives', content: '# Business Objectives\n\n1. \n2. \n3. ' },
        { id: 'success', label: 'Success Criteria', content: '# Success Criteria\n\n| Criteria | Measurement | Target |\n|----------|-------------|--------|\n| | | |' },
        { id: 'constraints', label: 'Constraints', content: '# Constraints\n\n## Budget\n\n## Timeline\n\n## Resources\n\n## Technical Limitations' }
      ]
    }
  },
  
  // Functional Requirements Specification Schema
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
          }
        }
      },
      default: []
    }
  },
  
  // User Stories Schema
  [ARTIFACT_TYPES.USER_STORIES]: {
    title: { type: 'string', required: true },
    description: { type: 'string' },
    epics: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', required: true },
          title: { type: 'string', required: true },
          description: { type: 'string' },
          priority: { 
            type: 'string', 
            enum: ['low', 'medium', 'high', 'critical'],
            default: 'medium'
          },
          status: { 
            type: 'string', 
            enum: ['not_started', 'in_progress', 'completed'],
            default: 'not_started'
          },
          businessValue: { type: 'string' }
        }
      },
      default: []
    },
    stories: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', required: true },
          epicId: { type: 'string' },
          title: { type: 'string', required: true },
          storyFormat: {
            type: 'object',
            properties: {
              asA: { type: 'string' },
              iWant: { type: 'string' },
              soThat: { type: 'string' }
            }
          },
          acceptanceCriteria: { type: 'array', items: { type: 'string' } },
          priority: { 
            type: 'string', 
            enum: ['low', 'medium', 'high', 'critical'],
            default: 'medium'
          },
          size: { type: 'number' },
          status: { 
            type: 'string', 
            enum: ['backlog', 'ready', 'in_progress', 'testing', 'done'],
            default: 'backlog'
          },
          assignee: { type: 'string' },
          tags: { type: 'array', items: { type: 'string' } },
          notes: { type: 'string' }
        }
      },
      default: []
    },
    personas: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', required: true },
          name: { type: 'string', required: true },
          role: { type: 'string' },
          demographics: { type: 'string' },
          goals: { type: 'string' },
          painPoints: { type: 'string' },
          behaviors: { type: 'string' },
          image: { type: 'string' }
        }
      },
      default: []
    }
  },
  
  // Technical Specification Schema
  [ARTIFACT_TYPES.TECHNICAL_SPECIFICATION]: {
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
        { id: 'overview', label: 'Technical Overview', content: '# Technical Overview\n\nProvide a high-level overview of the technical solution.' },
        { id: 'architecture', label: 'Architecture', content: '# System Architecture\n\n[Describe the overall architecture]\n\n## Components\n\n- Component 1\n- Component 2\n\n## Deployment Diagram\n\n[Include or link to diagram]' },
        { id: 'dataModels', label: 'Data Models', content: '# Data Models\n\n## Entity 1\n\n| Field | Type | Description | Constraints |\n|-------|------|-------------|------------|\n| id | UUID | Primary key | Not null |\n| name | String | | |' },
        { id: 'apis', label: 'API Specifications', content: '# API Specifications\n\n## Endpoint 1: [Endpoint Name]\n\n**URL**: [URL]\n\n**Method**: [HTTP Method]\n\n**Request Parameters**:\n```json\n{\n  "param1": "value1"\n}\n```\n\n**Response**:\n```json\n{\n  "field1": "value1"\n}\n```' },
        { id: 'nonFunctional', label: 'Non-Functional Requirements', content: '# Non-Functional Requirements\n\n## Performance\n\n- Requirement 1\n\n## Security\n\n- Requirement 1\n\n## Scalability\n\n- Requirement 1\n\n## Reliability\n\n- Requirement 1' },
        { id: 'integrations', label: 'Integrations', content: '# Integrations\n\n## Integration 1: [System Name]\n\n**Purpose**: [Purpose]\n\n**Integration Method**: [Method]\n\n**Data Flow**: [Description]' }
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
          responsibilities: { type: 'array', items: { type: 'string' } },
          dependencies: { type: 'array', items: { type: 'string' } },
          interfaces: { type: 'array', items: { type: 'string' } },
          technologies: { type: 'array', items: { type: 'string' } },
          notes: { type: 'string' }
        }
      },
      default: []
    }
  },
  
  // Database Design Schema
  [ARTIFACT_TYPES.DATABASE_DESIGN]: {
    title: { type: 'string', required: true },
    description: { type: 'string' },
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
    }
  },
  
  // Project Plan Schema (keeping this from your original)
  [ARTIFACT_TYPES.PROJECT_PLAN]: {
    title: { type: 'string', required: true },
    description: { type: 'string' },
    projectObjectives: { type: 'string' },
    projectScope: { type: 'string' },
    constraints: { type: 'string' },
    timeline: {
      type: 'object',
      properties: {
        startDate: { type: 'date', required: true },
        endDate: { type: 'date', required: true },
        workingDays: { type: 'array', items: { type: 'number' } }
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
          completionPercentage: { type: 'number' }
        }
      }
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
          references: { type: 'array', items: { type: 'string' } },
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
      }
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
      }
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
      }
    },
    risks: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', required: true },
          description: { type: 'string', required: true },
          category: { type: 'string' },
          probability: { 
            type: 'string', 
            enum: ['low', 'medium', 'high', 'very_high'],
            default: 'medium'
          },
          impact: { 
            type: 'string', 
            enum: ['low', 'medium', 'high', 'very_high'],
            default: 'medium'
          },
          mitigation: { type: 'string' },
          owner: { type: 'string' }
        }
      }
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