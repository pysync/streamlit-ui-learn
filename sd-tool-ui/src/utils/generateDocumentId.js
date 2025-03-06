// src/utils/generateDocumentId.js
const generateDocumentId = (title) => {
    if (!title) {
      return 'untitled-document'; // Default document ID if title is empty
    }
    return title
      .toLowerCase()
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/[^a-z0-9\-]/g, '') // Remove any characters that are not alphanumeric or hyphens
      .substring(0, 100); // Limit length to 100 characters (optional, for safety)
  };
  
  export default generateDocumentId;