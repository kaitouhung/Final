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
import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Background from 'src/assets/img/login_register.jpg';
import InputPassword from 'src/components/InputPassword/InputPassword';
import { path } from 'src/constants/path';
import Http from 'src/utils/http';
import * as yup from 'yup';
export default function Reset() {
  const schema = yup
    .object({
      password: yup
        .string()
        .trim('Please enter your passowrd')
        .required('Please enter your password')
        .min(6, 'Please enter at least 6 character')
        .max(160, 'Please enter lesser 160 character'),
      passwordConfirm: yup
        .string()
        .trim('Please enter your password confirm')
        .required('Please enter your password confirm')
        .min(6, 'Please enter at least 6 character')
        .max(160, 'Please enter lesser 160 character')
        .oneOf([yup.ref('password')], 'Password does not match'),
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
      password: '',
      passwordConfirm: '',
    },
    resolver: yupResolver(schema),
  });

  const { resetPassword } = useParams();

  const handleReset = async (data) => {
    const body = {
      password: data.password,
      passwordConfirm: data.passwordConfirm,
    };

    try {
      const res = await new Http(process.env.REACT_APP_API_Auth).patch(
        `resetPassword/${resetPassword}`,
        body
      );

      reset();
      toast.success('Reset Password successfully', {
        position: 'top-right',
        autoClose: 3000,
      });
    } catch (error) {
      toast.error('Reset unsuccessful', {
        position: 'top-right',
        autoClose: 3000,
      });
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
            Reset Password
          </Typography>
          <Box
            component="form"
            noValidate
            sx={{ mt: 1, width: 1 }}
            onSubmit={handleSubmit(handleReset)}
          >
            <InputPassword
              control={control}
              name="password"
              label="Password"
              errors={errors}
            />

            <InputPassword
              control={control}
              name="passwordConfirm"
              label="Confirm Password"
              errors={errors}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Reset Password
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
