import React, { createContext, useContext, useState } from 'react';

const MessageContext = createContext();

export const MessageProvider = ({ children }) => {
  const [message, setMessage] = useState({
    text: null,
    type: 'info' // Default is 'info', can be 'error', 'success', 'warning', 'info'
  });

  // Main function to show messages with customizable type
  const showMessage = (text, type = 'info') => {
    setMessage({ text, type });
  };

  // Helper functions as aliases for specific message types
  const showError = (text) => showMessage(text, 'error');
  const showSuccess = (text) => showMessage(text, 'success');
  const showWarning = (text) => showMessage(text, 'warning');
  const showInfo = (text) => showMessage(text, 'info');

  // Clear the message
  const clearMessage = () => {
    setMessage({ text: null, type: 'info' });
  };

  // For backward compatibility
  const hideMessage = clearMessage;

  return (
    <MessageContext.Provider 
      value={{ 
        message, 
        showMessage, 
        clearMessage, 
        hideMessage,
        // Aliases for specific message types
        showError,
        showSuccess, 
        showWarning,
        showInfo,
        // Legacy support
        error: message.text && message.type === 'error' ? message.text : null,
        clearError: clearMessage
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};

export const useMessage = () => useContext(MessageContext);

// For backward compatibility
export const useError = () => {
  const context = useContext(MessageContext);
  return {
    error: context.message.text && context.message.type === 'error' ? context.message.text : null,
    showError: context.showError,
    clearError: context.clearMessage
  };
};

/* 
USAGE EXAMPLES:

// Import the hook
import { useMessage } from '../contexts/MessageContext';

// In your component:
const { 
  showMessage,    // For custom messages with type
  showError,      // For error messages
  showSuccess,    // For success messages 
  showWarning,    // For warning messages
  showInfo,       // For info messages
  clearMessage    // To clear the message
} = useMessage();

// Display different types of messages:
showMessage('This is a custom message', 'info');  // Custom message with type
showError('Something went wrong');                // Error message
showSuccess('Operation completed successfully');  // Success message
showWarning('This might cause issues');           // Warning message
showInfo('Just FYI');                             // Info message

// For backward compatibility with useError():
import { useError } from '../contexts/MessageContext';

const { error, showError, clearError } = useError();
showError('This is an error message');
clearError();
*/