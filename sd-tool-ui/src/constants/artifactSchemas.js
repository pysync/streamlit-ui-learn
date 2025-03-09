import { ARTIFACT_TYPES } from './sdlcConstants';

/**
 * Data structure schemas for artifact types
 */
export const ARTIFACT_SCHEMAS = {
  // Project Plan Schema
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
      }
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
      }
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
      }
    }
  },
  
  // Database Design Document Schema
  [ARTIFACT_TYPES.DATABASE_DESIGN_DOCUMENT]: {
    title: { type: 'string', required: true },
    description: { type: 'string' },
    databaseInfo: {
      type: 'object',
      properties: {
        name: { type: 'string', required: true },
        type: { type: 'string', required: true },
        version: { type: 'string' },
        description: { type: 'string' }
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
      }
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
      }
    },
    diagrams: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', required: true },
          name: { type: 'string', required: true },
          description: { type: 'string' },
          entities: { type: 'array', items: { type: 'string' } },
          entityPositions: { type: 'object' },
          zoom: { type: 'number', default: 1.0 },
          panOffset: { 
            type: 'object',
            properties: {
              x: { type: 'number', default: 0 },
              y: { type: 'number', default: 0 }
            }
          }
        }
      }
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
      }
    }
  }
  
  // We would add more schemas for other artifact types here
  // For brevity, I'll limit to these three key examples
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