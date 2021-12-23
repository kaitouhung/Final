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
import { Link, useNavigate } from 'react-router-dom';
import Background from 'src/assets/img/login_register.jpg';
import InputPassword from 'src/components/InputPassword/InputPassword';
import InputText from 'src/components/InputText/InputText';
import { path } from 'src/constants/path';
import * as yup from 'yup';
import { login } from '../auth.slice';

export default function Login() {
  const schema = yup
    .object({
      email: yup
        .string()
        .trim('Please enter your email')
        .required('Please enter your email.')
        .email('Please enter a valid email address.'),
      password: yup
        .string()
        .trim('Please enter your passowrd')
        .required('Please enter your password')
        .min(6, 'Please enter at least 6 character')
        .max(160, 'Please enter lesser 160 character'),
    })
    .required();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: yupResolver(schema),
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (data) => {
    const body = {
      email: data.email,
      password: data.password,
    };

    try {
      const res = await dispatch(login(body));
      unwrapResult(res);
      navigate(path.home);
    } catch (error) {
      if (error.status === 400) {
        setError('password', {
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
            Sign in
          </Typography>
          <Box
            component="form"
            noValidate
            sx={{ mt: 1, width: 1 }}
            onSubmit={handleSubmit(handleLogin)}
          >
            <InputText
              control={control}
              name="email"
              label="Email"
              errors={errors}
            />

            <InputPassword
              control={control}
              name="password"
              label="Password"
              errors={errors}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item>
                <MuiLink component={Link} to={path.register} variant="body2">
                  {'You have an account? Sign Up'}
                </MuiLink>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}
