import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import authApi from 'src/api/auth.api';
import LocalStorage from 'src/constants/localStorage';
import { payloadCreator } from 'src/utils/helper';

export const login = createAsyncThunk(
  'auth/login',
  payloadCreator(authApi.login)
);

export const register = createAsyncThunk(
  'auth/register',
  payloadCreator(authApi.register)
);

const handleAuthFulfilled = (state, action) => {
  console.log(action.payload.data);
  const { data, token } = action.payload;
  state.profile = data;
  localStorage.setItem(LocalStorage.user, JSON.stringify(state.profile));
  localStorage.setItem(LocalStorage.accessToken, token);
};

const auth = createSlice({
  name: 'auth',
  initialState: {
    profile: JSON.parse(localStorage.getItem(LocalStorage.user)) || {},
  },

  extraReducers: {
    [login.fulfilled]: handleAuthFulfilled,
    [register.fulfilled]: handleAuthFulfilled,
  },
});

const authReducer = auth.reducer;
export default authReducer;
