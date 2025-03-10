/**
 * Adapters for document-based artifacts
 * These functions transform artifact content to match the expected format for DocumentViewer
 */

import { ARTIFACT_TYPES } from '../../../constants/sdlcConstants';
import { ARTIFACT_SCHEMAS } from '../../../constants/artifactSchemas';

/**
 * Transforms a project charter artifact to document format
 * @param {Object} artifact - The project charter artifact
 * @returns {Object} Transformed content for DocumentViewer
 */
export const projectCharterAdapter = (artifact) => {
  let content = artifact.content;
  
  // Parse content if it's a string
  if (typeof content === 'string') {
    try {
      content = JSON.parse(content);
    } catch (e) {
      // If parsing fails, create a basic structure
      return {
        sections: [
          { id: 'content', label: 'Content', content: content || '' }
        ]
      };
    }
  }
  
  // If content is already in the right format, return it
  if (content && content.sections) {
    return content;
  }
  
  // Get default sections from schema
  const schema = ARTIFACT_SCHEMAS[ARTIFACT_TYPES.PROJECT_CHARTER];
  const defaultSections = schema?.default?.sections || [
    { id: 'overview', label: 'Overview', content: '' },
    { id: 'vision', label: 'Vision & Goals', content: '' },
    { id: 'scope', label: 'Scope', content: '' },
    { id: 'stakeholders', label: 'Stakeholders', content: '' },
    { id: 'timeline', label: 'Timeline', content: '' },
    { id: 'budget', label: 'Budget', content: '' },
    { id: 'risks', label: 'Risks', content: '' }
  ];
  
  // Map content fields to sections if possible
  const sections = defaultSections.map(section => {
    if (content && content[section.id]) {
      return {
        ...section,
        content: content[section.id]
      };
    }
    return section;
  });
  
  return { sections };
};

/**
 * Transforms a business requirements artifact to document format
 * @param {Object} artifact - The business requirements artifact
 * @returns {Object} Transformed content for DocumentViewer
 */
export const businessRequirementsAdapter = (artifact) => {
  let content = artifact.content;
  
  // Parse content if it's a string
  if (typeof content === 'string') {
    try {
      content = JSON.parse(content);
    } catch (e) {
      // If parsing fails, create a basic structure
      return {
        sections: [
          { id: 'content', label: 'Content', content: content || '' }
        ]
      };
    }
  }
  
  // If content is already in the right format, return it
  if (content && content.sections) {
    return content;
  }
  
  // Get default sections from schema
  const schema = ARTIFACT_SCHEMAS[ARTIFACT_TYPES.BUSINESS_REQUIREMENTS];
  const defaultSections = schema?.default?.sections || [
    { id: 'introduction', label: 'Introduction', content: '' },
    { id: 'background', label: 'Background', content: '' },
    { id: 'objectives', label: 'Business Objectives', content: '' },
    { id: 'requirements', label: 'Business Requirements', content: '' },
    { id: 'constraints', label: 'Constraints', content: '' },
    { id: 'assumptions', label: 'Assumptions', content: '' }
  ];
  
  // Map content fields to sections if possible
  const sections = defaultSections.map(section => {
    if (content && content[section.id]) {
      return {
        ...section,
        content: content[section.id]
      };
    }
    return section;
  });
  
  // Handle requirements list if present
  const requirements = content && Array.isArray(content.requirements) 
    ? content.requirements 
    : [];
  
  return { 
    sections,
    requirements
  };
};

/**
 * Transforms a functional requirements artifact to document format
 * @param {Object} artifact - The functional requirements artifact
 * @returns {Object} Transformed content for DocumentViewer
 */
export const functionalRequirementsAdapter = (artifact) => {
  let content = artifact.content;
  
  // Parse content if it's a string
  if (typeof content === 'string') {
    try {
      content = JSON.parse(content);
    } catch (e) {
      // If parsing fails, create a basic structure
      return {
        sections: [
          { id: 'content', label: 'Content', content: content || '' }
        ]
      };
    }
  }
  
  // If content is already in the right format, return it
  if (content && content.sections) {
    return content;
  }
  
  // Get default sections from schema
  const schema = ARTIFACT_SCHEMAS[ARTIFACT_TYPES.FUNCTIONAL_REQUIREMENTS];
  const defaultSections = schema?.default?.sections || [
    { id: 'introduction', label: 'Introduction', content: '' },
    { id: 'scope', label: 'Scope', content: '' },
    { id: 'userRequirements', label: 'User Requirements', content: '' },
    { id: 'systemRequirements', label: 'System Requirements', content: '' },
    { id: 'interfaces', label: 'Interfaces', content: '' },
    { id: 'constraints', label: 'Constraints', content: '' }
  ];
  
  // Map content fields to sections if possible
  const sections = defaultSections.map(section => {
    if (content && content[section.id]) {
      return {
        ...section,
        content: content[section.id]
      };
    }
    return section;
  });
  
  // Handle requirements list if present
  const requirements = content && Array.isArray(content.requirements) 
    ? content.requirements 
    : [];
  
  return { 
    sections,
    requirements
  };
};

/**
 * Transforms a technical design artifact to document format
 * @param {Object} artifact - The technical design artifact
 * @returns {Object} Transformed content for DocumentViewer
 */
export const technicalDesignAdapter = (artifact) => {
  let content = artifact.content;
  
  // Parse content if it's a string
  if (typeof content === 'string') {
    try {
      content = JSON.parse(content);
    } catch (e) {
      // If parsing fails, create a basic structure
      return {
        sections: [
          { id: 'content', label: 'Content', content: content || '' }
        ]
      };
    }
  }
  
  // If content is already in the right format, return it
  if (content && content.sections) {
    return content;
  }
  
  // Get default sections from schema
  const schema = ARTIFACT_SCHEMAS[ARTIFACT_TYPES.TECHNICAL_DESIGN];
  const defaultSections = schema?.default?.sections || [
    { id: 'introduction', label: 'Introduction', content: '' },
    { id: 'architecture', label: 'Architecture Overview', content: '' },
    { id: 'components', label: 'Component Design', content: '' },
    { id: 'database', label: 'Database Design', content: '' },
    { id: 'interfaces', label: 'Interface Design', content: '' },
    { id: 'security', label: 'Security Considerations', content: '' },
    { id: 'performance', label: 'Performance Considerations', content: '' }
  ];
  
  // Map content fields to sections if possible
  const sections = defaultSections.map(section => {
    if (content && content[section.id]) {
      return {
        ...section,
        content: content[section.id]
      };
    }
    return section;
  });
  
  return { sections };
};

/**
 * Transforms a test plan artifact to document format
 * @param {Object} artifact - The test plan artifact
 * @returns {Object} Transformed content for DocumentViewer
 */
export const testPlanAdapter = (artifact) => {
  let content = artifact.content;
  
  // Parse content if it's a string
  if (typeof content === 'string') {
    try {
      content = JSON.parse(content);
    } catch (e) {
      // If parsing fails, create a basic structure
      return {
        sections: [
          { id: 'content', label: 'Content', content: content || '' }
        ]
      };
    }
  }
  
  // If content is already in the right format, return it
  if (content && content.sections) {
    return content;
  }
  
  // Get default sections from schema
  const schema = ARTIFACT_SCHEMAS[ARTIFACT_TYPES.TEST_PLAN];
  const defaultSections = schema?.default?.sections || [
    { id: 'introduction', label: 'Introduction', content: '' },
    { id: 'scope', label: 'Test Scope', content: '' },
    { id: 'strategy', label: 'Test Strategy', content: '' },
    { id: 'approach', label: 'Test Approach', content: '' },
    { id: 'environment', label: 'Test Environment', content: '' },
    { id: 'schedule', label: 'Test Schedule', content: '' },
    { id: 'resources', label: 'Resources', content: '' },
    { id: 'risks', label: 'Risks and Mitigations', content: '' }
  ];
  
  // Map content fields to sections if possible
  const sections = defaultSections.map(section => {
    if (content && content[section.id]) {
      return {
        ...section,
        content: content[section.id]
      };
    }
    return section;
  });
  
  return { sections };
};

/**
 * Transforms a user manual artifact to document format
 * @param {Object} artifact - The user manual artifact
 * @returns {Object} Transformed content for DocumentViewer
 */
export const userManualAdapter = (artifact) => {
  let content = artifact.content;
  
  // Parse content if it's a string
  if (typeof content === 'string') {
    try {
      content = JSON.parse(content);
    } catch (e) {
      // If parsing fails, create a basic structure
      return {
        sections: [
          { id: 'content', label: 'Content', content: content || '' }
        ]
      };
    }
  }
  
  // If content is already in the right format, return it
  if (content && content.sections) {
    return content;
  }
  
  // Get default sections from schema
  const schema = ARTIFACT_SCHEMAS[ARTIFACT_TYPES.USER_MANUAL];
  const defaultSections = schema?.default?.sections || [
    { id: 'introduction', label: 'Introduction', content: '' },
    { id: 'installation', label: 'Installation Guide', content: '' },
    { id: 'gettingStarted', label: 'Getting Started', content: '' },
    { id: 'features', label: 'Features', content: '' },
    { id: 'howTo', label: 'How-to Guides', content: '' },
    { id: 'troubleshooting', label: 'Troubleshooting', content: '' },
    { id: 'faq', label: 'FAQ', content: '' }
  ];
  
  // Map content fields to sections if possible
  const sections = defaultSections.map(section => {
    if (content && content[section.id]) {
      return {
        ...section,
        content: content[section.id]
      };
    }
    return section;
  });
  
  return { sections };
};

/**
 * Get the appropriate adapter for a given artifact type
 * @param {string} artifactType - The artifact type
 * @returns {Function} The adapter function for the artifact type
 */
export const getDocumentAdapter = (artifactType) => {
  switch (artifactType) {
    case ARTIFACT_TYPES.PROJECT_CHARTER:
      return projectCharterAdapter;
    case ARTIFACT_TYPES.BUSINESS_REQUIREMENTS:
      return businessRequirementsAdapter;
    case ARTIFACT_TYPES.FUNCTIONAL_REQUIREMENTS:
      return functionalRequirementsAdapter;
    case ARTIFACT_TYPES.TECHNICAL_DESIGN:
      return technicalDesignAdapter;
    case ARTIFACT_TYPES.TEST_PLAN:
      return testPlanAdapter;
    case ARTIFACT_TYPES.USER_MANUAL:
      return userManualAdapter;
    default:
      return (artifact) => artifact.content;
  }
}; 