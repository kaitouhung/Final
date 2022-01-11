import { yupResolver } from '@hookform/resolvers/yup';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { unwrapResult } from '@reduxjs/toolkit';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import InputText from 'src/components/InputText/InputText';
import { updateMe } from 'src/pages/Auth/auth.slice';
import * as yup from 'yup';

export default function UpdateInformation({ profile, setIsActive }) {
  console.log(profile);
  const schema = yup
    .object({
      fullName: yup
        .string()
        .required('Please enter your fullname')
        .trim('Please enter your fullname')
        .min(3, 'Please enter at least 6 character')
        .max(160, 'Please enter lesser 160 character')
        .test(
          'should has at least two words',
          'please enter at least two words',
          (value) => {
            return value.split(' ').length >= 2;
          }
        ),
    })
    .required();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    defaultValues: {
      fullName: profile.fullName,
    },
    resolver: yupResolver(schema),
  });

  const dispatch = useDispatch();

  const updateUser = async (data) => {
    try {
      const body = {
        fullName: data.fullName,
      };
      console.log(body);
      const res = await dispatch(updateMe(body)).then(unwrapResult);
      toast.success('Update Information Successfully', {
        position: 'top-right',
        autoClose: 3000,
      });
    } catch (error) {}
  };

  return (
    <Box
      sx={{
        my: 8,
        mx: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        Update Information
      </Typography>
      <Box
        component="form"
        noValidate
        sx={{ mt: 1, width: 1 }}
        onSubmit={handleSubmit(updateUser)}
      >
        <InputText
          control={control}
          name="fullName"
          label="FullName"
          errors={errors}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Update Information
        </Button>
      </Box>
      <Grid container>
        <Grid item>
          <Button
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            type="submit"
            onClick={() => setIsActive((isActive) => !isActive)}
          >
            Update Password
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
