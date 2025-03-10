import { z } from 'zod';

// Define the schema for a single function
export const FunctionSchema = z.object({
  id: z.string()
    .regex(/^F\d{3}$/, 'ID must be in format F001, F002, etc.'),
  module: z.string()
    .min(1, 'Module is required')
    .max(50, 'Module name too long'),
  name: z.string()
    .min(1, 'Function name is required')
    .max(100, 'Function name too long'),
  screen: z.string()
    .max(100, 'Screen name too long')
    .optional(),
  detail: z.string()
    .max(500, 'Detail description too long')
    .optional(),
  status: z.enum(['planned', 'in-progress', 'completed', 'on-hold'])
    .default('planned'),
  priority: z.enum(['low', 'medium', 'high', 'critical'])
    .default('medium')
});

// Define the schema for an array of functions
export const FunctionsListSchema = z.array(FunctionSchema);

// Helper function to validate functions data
export const validateFunctions = (data) => {
  try {
    return {
      success: true,
      data: FunctionsListSchema.parse(data)
    };
  } catch (error) {
    return {
      success: false,
      errors: error.errors
    };
  }
};

// Helper function to parse markdown table to functions
export const parseMarkdownTableToFunctions = (markdownContent) => {
  try {
    // Split content into lines and find the table
    const lines = markdownContent.split('\n');
    const tableStartIndex = lines.findIndex(line => line.includes('| ID | Module |'));
    
    if (tableStartIndex === -1) {
      return { success: false, error: 'No function table found' };
    }

    // Parse table rows
    const functions = [];
    for (let i = tableStartIndex + 2; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line.startsWith('|') || line === '') break;

      const [, id, module, name, screen, detail, status, priority] = line.split('|').map(cell => cell.trim());
      
      functions.push({
        id,
        module,
        name,
        screen,
        detail,
        status: status?.toLowerCase() || 'planned',
        priority: priority?.toLowerCase() || 'medium'
      });
    }

    // Validate the parsed functions
    return validateFunctions(functions);
  } catch (error) {
    return {
      success: false,
      error: 'Failed to parse markdown table'
    };
  }
};

// Helper function to generate markdown table from functions
export const generateFunctionsMarkdownTable = (functions) => {
  if (!Array.isArray(functions) || functions.length === 0) {
    return '';
  }

  const headers = [
    '| ID | Module | Name | Screen | Detail | Status | Priority |',
    '|-----|---------|------|--------|---------|---------|----------|'
  ];

  const rows = functions.map(func => {
    return `| ${func.id} | ${func.module} | ${func.name} | ${func.screen || ''} | ${func.detail || ''} | ${func.status} | ${func.priority} |`;
  });

  return `## Functions List\n\n${headers.join('\n')}\n${rows.join('\n')}\n`;
}; 