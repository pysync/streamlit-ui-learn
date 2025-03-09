import React from 'react';
import AppRoutes from './routes/AppRoutes';
import { ThemeProvider } from '@mui/material/styles';

import { LoadingProvider } from './contexts/LoadingContext';
import { MessageProvider } from './contexts/MessageContext';
import { EditorProvider } from './contexts/EditorContext';

import MessageSnackbar from './components/common/MessageSnackbar';
import LoadingIndicator from './components/common/LoadingIndicator';

import theme from './theme';

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <MessageProvider>
        <LoadingProvider>
          <EditorProvider>
            <MessageSnackbar />
            <LoadingIndicator />
            
            <AppRoutes />
          </EditorProvider>
        </LoadingProvider>
      </MessageProvider>
    </ThemeProvider>
  );
};

export default App;
