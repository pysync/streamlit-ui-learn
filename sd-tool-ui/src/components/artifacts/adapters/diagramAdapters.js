/**
 * Adapters for diagram-based artifacts
 * These functions transform artifact content to match the expected format for DiagramViewer
 */

import { ARTIFACT_TYPES } from '../../../constants/sdlcConstants';

/**
 * Transforms database design artifact to diagram format
 * @param {Object} artifact - The database design artifact
 * @returns {Object} Transformed content for DiagramViewer
 */
export const databaseDesignAdapter = (artifact) => {
  let content = artifact.content;
  
  // Parse content if it's a string
  if (typeof content === 'string') {
    try {
      content = JSON.parse(content);
    } catch (e) {
      // If parsing fails, create a basic structure
      return {
        type: 'database',
        entities: [],
        relationships: []
      };
    }
  }
  
  // If content is already in the right format, return it
  if (content && content.type === 'database' && Array.isArray(content.entities)) {
    return content;
  }
  
  // If we have entities but not in the right format
  if (content && Array.isArray(content.entities)) {
    return {
      type: 'database',
      entities: content.entities.map(entity => ({
        id: entity.id || `entity-${Math.random().toString(36).substr(2, 9)}`,
        name: entity.name || 'Unnamed Entity',
        attributes: Array.isArray(entity.attributes) ? entity.attributes : [],
        position: entity.position || { x: 0, y: 0 }
      })),
      relationships: Array.isArray(content.relationships) ? content.relationships.map(rel => ({
        id: rel.id || `rel-${Math.random().toString(36).substr(2, 9)}`,
        source: rel.source,
        target: rel.target,
        sourceCardinality: rel.sourceCardinality || '1',
        targetCardinality: rel.targetCardinality || '*',
        label: rel.label || ''
      })) : []
    };
  }
  
  // Default structure
  return {
    type: 'database',
    entities: [],
    relationships: []
  };
};

/**
 * Transforms class diagram artifact to diagram format
 * @param {Object} artifact - The class diagram artifact
 * @returns {Object} Transformed content for DiagramViewer
 */
export const classDiagramAdapter = (artifact) => {
  let content = artifact.content;
  
  // Parse content if it's a string
  if (typeof content === 'string') {
    try {
      content = JSON.parse(content);
    } catch (e) {
      // If parsing fails, create a basic structure
      return {
        type: 'class',
        classes: [],
        relationships: []
      };
    }
  }
  
  // If content is already in the right format, return it
  if (content && content.type === 'class' && Array.isArray(content.classes)) {
    return content;
  }
  
  // If we have classes but not in the right format
  if (content && Array.isArray(content.classes)) {
    return {
      type: 'class',
      classes: content.classes.map(cls => ({
        id: cls.id || `class-${Math.random().toString(36).substr(2, 9)}`,
        name: cls.name || 'Unnamed Class',
        attributes: Array.isArray(cls.attributes) ? cls.attributes : [],
        methods: Array.isArray(cls.methods) ? cls.methods : [],
        position: cls.position || { x: 0, y: 0 }
      })),
      relationships: Array.isArray(content.relationships) ? content.relationships.map(rel => ({
        id: rel.id || `rel-${Math.random().toString(36).substr(2, 9)}`,
        source: rel.source,
        target: rel.target,
        type: rel.type || 'association',
        label: rel.label || ''
      })) : []
    };
  }
  
  // Default structure
  return {
    type: 'class',
    classes: [],
    relationships: []
  };
};

/**
 * Transforms sequence diagram artifact to diagram format
 * @param {Object} artifact - The sequence diagram artifact
 * @returns {Object} Transformed content for DiagramViewer
 */
export const sequenceDiagramAdapter = (artifact) => {
  let content = artifact.content;
  
  // Parse content if it's a string
  if (typeof content === 'string') {
    try {
      content = JSON.parse(content);
    } catch (e) {
      // If it's a string but not JSON, it might be a mermaid diagram
      if (content.includes('sequenceDiagram')) {
        return {
          type: 'sequence',
          format: 'mermaid',
          source: content
        };
      }
      
      // Otherwise, create a basic structure
      return {
        type: 'sequence',
        participants: [],
        messages: []
      };
    }
  }
  
  // If content is already in the right format, return it
  if (content && content.type === 'sequence') {
    return content;
  }
  
  // If we have participants but not in the right format
  if (content && Array.isArray(content.participants)) {
    return {
      type: 'sequence',
      participants: content.participants.map(participant => ({
        id: participant.id || `participant-${Math.random().toString(36).substr(2, 9)}`,
        name: participant.name || 'Unnamed Participant',
        type: participant.type || 'actor'
      })),
      messages: Array.isArray(content.messages) ? content.messages.map(msg => ({
        id: msg.id || `msg-${Math.random().toString(36).substr(2, 9)}`,
        from: msg.from,
        to: msg.to,
        text: msg.text || '',
        type: msg.type || 'sync'
      })) : []
    };
  }
  
  // Default structure
  return {
    type: 'sequence',
    participants: [],
    messages: []
  };
};

/**
 * Transforms deployment diagram artifact to diagram format
 * @param {Object} artifact - The deployment diagram artifact
 * @returns {Object} Transformed content for DiagramViewer
 */
export const deploymentDiagramAdapter = (artifact) => {
  let content = artifact.content;
  
  // Parse content if it's a string
  if (typeof content === 'string') {
    try {
      content = JSON.parse(content);
    } catch (e) {
      // If parsing fails, create a basic structure
      return {
        type: 'deployment',
        nodes: [],
        connections: []
      };
    }
  }
  
  // If content is already in the right format, return it
  if (content && content.type === 'deployment' && Array.isArray(content.nodes)) {
    return content;
  }
  
  // If we have nodes but not in the right format
  if (content && Array.isArray(content.nodes)) {
    return {
      type: 'deployment',
      nodes: content.nodes.map(node => ({
        id: node.id || `node-${Math.random().toString(36).substr(2, 9)}`,
        name: node.name || 'Unnamed Node',
        type: node.type || 'server',
        artifacts: Array.isArray(node.artifacts) ? node.artifacts : [],
        position: node.position || { x: 0, y: 0 }
      })),
      connections: Array.isArray(content.connections) ? content.connections.map(conn => ({
        id: conn.id || `conn-${Math.random().toString(36).substr(2, 9)}`,
        source: conn.source,
        target: conn.target,
        label: conn.label || '',
        protocol: conn.protocol || 'HTTP'
      })) : []
    };
  }
  
  // Default structure
  return {
    type: 'deployment',
    nodes: [],
    connections: []
  };
};

/**
 * Get the appropriate adapter for a given artifact type
 * @param {string} artifactType - The artifact type
 * @returns {Function} The adapter function for the artifact type
 */
export const getDiagramAdapter = (artifactType) => {
  switch (artifactType) {
    case ARTIFACT_TYPES.DATABASE_DESIGN:
      return databaseDesignAdapter;
    case ARTIFACT_TYPES.CLASS_DIAGRAM:
      return classDiagramAdapter;
    case ARTIFACT_TYPES.SEQUENCE_DIAGRAM:
      return sequenceDiagramAdapter;
    case ARTIFACT_TYPES.DEPLOYMENT_DIAGRAM:
      return deploymentDiagramAdapter;
    default:
      return (artifact) => artifact.content;
  }
}; 