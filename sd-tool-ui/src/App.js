import React from 'react';
import AppRoutes from './routes/AppRoutes';
import { ThemeProvider } from '@mui/material/styles';

import { LoadingProvider } from './contexts/LoadingContext';
import { MessageProvider } from './contexts/MessageContext';

import MessageSnackbar from './components/Common/MessageSnackbar';
import LoadingIndicator from './components/Common/LoadingIndicator';

import theme from './theme';

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <MessageProvider>
        <LoadingProvider>
          <MessageSnackbar />
          <LoadingIndicator />
          
          <AppRoutes />
          
        </LoadingProvider>
      </MessageProvider>
    </ThemeProvider>
  );
};

export default App;
