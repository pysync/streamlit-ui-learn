import React from 'react';
import PropTypes from 'prop-types';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import SimpleDateAdapter from '../../utils/SimpleDateAdapter';
import { TextField } from '@mui/material';

/**
 * A wrapper component for MUI date pickers that uses our custom SimpleDateAdapter
 */
const DatePickerWrapper = ({
  type = 'date',
  label,
  value,
  onChange,
  format,
  minDate,
  maxDate,
  disabled,
  readOnly,
  fullWidth,
  ...props
}) => {
  const commonProps = {
    value,
    onChange,
    disabled,
    readOnly,
    renderInput: (params) => (
      <TextField 
        {...params} 
        label={label} 
        fullWidth={fullWidth} 
      />
    ),
    ...props
  };

  if (minDate) {
    commonProps.minDate = minDate;
  }

  if (maxDate) {
    commonProps.maxDate = maxDate;
  }

  if (format) {
    commonProps.inputFormat = format;
  }

  return (
    <LocalizationProvider dateAdapter={SimpleDateAdapter}>
      {type === 'date' && <DatePicker {...commonProps} />}
      {type === 'datetime' && <DateTimePicker {...commonProps} />}
      {type === 'time' && <TimePicker {...commonProps} />}
    </LocalizationProvider>
  );
};

DatePickerWrapper.propTypes = {
  type: PropTypes.oneOf(['date', 'datetime', 'time']),
  label: PropTypes.string,
  value: PropTypes.instanceOf(Date),
  onChange: PropTypes.func.isRequired,
  format: PropTypes.string,
  minDate: PropTypes.instanceOf(Date),
  maxDate: PropTypes.instanceOf(Date),
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  fullWidth: PropTypes.bool
};

export default DatePickerWrapper; 