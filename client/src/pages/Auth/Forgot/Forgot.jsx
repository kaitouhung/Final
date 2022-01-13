import { yupResolver } from '@hookform/resolvers/yup';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Link as MuiLink } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { unwrapResult } from '@reduxjs/toolkit';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Background from 'src/assets/img/login_register.jpg';
import InputText from 'src/components/InputText/InputText';
import { path } from 'src/constants/path';
import * as yup from 'yup';
import { forgot } from '../auth.slice';

export default function Forgot() {
  const schema = yup
    .object({
      email: yup
        .string()
        .trim('Please enter your email')
        .required('Please enter your email.')
        .email('Please enter a valid email address.'),
    })
    .required();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm({
    defaultValues: {
      email: '',
    },
    resolver: yupResolver(schema),
  });

  const dispatch = useDispatch();

  const handleForgot = async (data) => {
    const body = {
      email: data.email,
    };

    try {
      console.log(body);
      const res = await dispatch(forgot(body));
      unwrapResult(res);
      reset();
      toast.success('Email will be sent to you', {
        position: 'top-right',
        autoClose: 3000,
      });
    } catch (error) {
      if (error.status === 400) {
        setError('email', {
          type: 'server',
          message: error.message,
        });
      }
    }
  };

  return (
    <Grid container component="main" sx={{ height: '100vh' }}>
      <CssBaseline />
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage: `url(${Background})`,
          backgroundRepeat: 'no-repeat',
          backgroundColor: (t) =>
            t.palette.mode === 'light'
              ? t.palette.grey[50]
              : t.palette.grey[900],
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
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
            Forgot Password
          </Typography>
          <Box
            component="form"
            noValidate
            sx={{ mt: 1, width: 1 }}
            onSubmit={handleSubmit(handleForgot)}
          >
            <InputText
              control={control}
              name="email"
              label="Email"
              errors={errors}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Forgot
            </Button>
            <Grid container>
              <Grid item>
                <MuiLink component={Link} to={path.login} variant="body2">
                  {'Login'}
                </MuiLink>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}
