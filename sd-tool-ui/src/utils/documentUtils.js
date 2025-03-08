import { v4 as uuidv4 } from 'uuid';

export const generateDocumentId = () => {
  return uuidv4();
}; 