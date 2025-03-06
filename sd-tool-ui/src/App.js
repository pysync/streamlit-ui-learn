import React from 'react';
import AppRoutes from './routes/AppRoutes';
import { ThemeProvider } from '@mui/material/styles';

import { LoadingProvider } from './contexts/LoadingContext';
import { ErrorProvider } from './contexts/ErrorContext';

import ErrorSnackbar from './components/Common/ErrorSnackbar'; // Import ErrorSnackbar
import LoadingIndicator from './components/Common/LoadingIndicator'; // Import LoadingIndicator

import theme from './theme';

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <ErrorProvider>
        <LoadingProvider>
          <ErrorSnackbar />   {/* Render ErrorSnackbar - OUTSIDE Providers */}
          <LoadingIndicator /> {/* Render LoadingIndicator - OUTSIDE Providers */}
          
            <AppRoutes />
          
        </LoadingProvider>
      </ErrorProvider>
    </ThemeProvider>
  );
};

export default App;
