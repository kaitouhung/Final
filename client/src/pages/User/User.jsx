import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Stack, TextField } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { unwrapResult } from '@reduxjs/toolkit';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Header from 'src/components/Header/Header';
import { path } from 'src/constants/path';
import { unauthorize, uploadAvatar } from '../Auth/auth.slice';

export default function User() {
  const profile = useSelector((state) => state.auth.profile);

  const [imagePre, setImagePre] = useState(
    profile?.avatar
      ? profile?.avatar
      : 'https://res.cloudinary.com/dn4nqzjpm/image/upload/v1642011504/users/ceqwv01nz6ewodzspvdn.png'
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    defaultValues: {
      uploadImage: '',
    },
  });

  const uploadImage = async (data) => {
    try {
      const formData = new FormData();
      formData.append('avatar', data.uploadImage);

      // const res = await new Http(
      //   process.env.REACT_APP_API_Auth,
      //   'multipart/form-data'
      // ).patch('upload-avatar', formData);

      const res = await dispatch(uploadAvatar(formData)).then(unwrapResult);

      toast.success('Upload avatar Successfully', {
        position: 'top-right',
        autoClosse: 4000,
      });
    } catch (error) {
      if (error.status === 401) {
        dispatch(unauthorize());
        navigate(path.login);
      }
    }
  };

  return (
    <div>
      <Header />
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid item xs={false} sm={4} md={7}>
          <Stack
            direction="column"
            justifyContent="center"
            alignItems="center"
            spacing={3}
            component="form"
            m={10}
            onSubmit={handleSubmit(uploadImage)}
          >
            <Box
              component="img"
              sx={{
                height: 233,
                width: 350,
                maxHeight: { xs: 233, md: 167 },
                maxWidth: { xs: 350, md: 250 },
              }}
              alt="The house from the offer."
              src={imagePre}
            />
            <Controller
              name="uploadImage"
              control={control}
              render={({ field }) => (
                <TextField
                  // accept="audio/*,video/*,image/*"
                  inputProps={{ accept: 'image/png, image/gif, image/jpeg' }}
                  name="uploadImage"
                  autoFocus
                  onChange={(event) => {
                    field.onChange(event.target.files[0]);
                    const reader = new FileReader();
                    reader.onload = () => {
                      if (reader.readyState === 2) {
                        setImagePre(reader.result);
                      }
                    };
                    reader.readAsDataURL(event.target.files[0]);
                  }}
                  // value={field.value}
                  onBlur={field.onBlur}
                  type="file"
                  width="50%"
                />
              )}
            />

            <Button
              type="submit"
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              width="50%"
            >
              Upload Avatar
            </Button>
          </Stack>
        </Grid>
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
            <Typography
              component="h1"
              variant="h5"
              sx={{
                mt: 3,
              }}
            >
              Upload Avatar
            </Typography>
            <Typography
              component="h1"
              variant="h5"
              sx={{
                mt: 3,
              }}
            >
              FullName: {profile?.fullName}
            </Typography>
            <Box
              component="form"
              noValidate
              sx={{ mt: 1, width: 1 }}
              // onSubmit={handleSubmit(handleLogin)}
            >
              {/* <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button> */}
              <Grid container>
                <Grid item></Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
}
