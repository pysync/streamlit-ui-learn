import React from 'react';
import { Backdrop, CircularProgress } from '@mui/material';
import { useLoading } from '../../contexts/LoadingContext';

const LoadingIndicator = () => {
  const { loading } = useLoading();

  return (
    <Backdrop
      open={loading}
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, color: '#fff' }}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default LoadingIndicator;
