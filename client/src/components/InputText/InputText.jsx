import TextField from '@mui/material/TextField';
import React from 'react';
import { Controller } from 'react-hook-form';

export default function InputText(props) {
  const { control, name, errors, label } = props;
  const error = errors[name];

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <TextField
          margin="normal"
          variant="outlined"
          fullWidth
          label={label}
          autoFocus
          name={name}
          error={!!error}
          helperText={error?.message}
          onChange={field.onChange}
          value={field.value}
          onBlur={field.onBlur}
        />
      )}
    />
  );
}
