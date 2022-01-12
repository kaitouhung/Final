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
  const { data, token } = action.payload;
  state.profile = data;
  localStorage.setItem(LocalStorage.user, JSON.stringify(state.profile));
  localStorage.setItem(LocalStorage.accessToken, token);
};

const handleUnauth = (state) => {
  state.profile = {};
  localStorage.removeItem(LocalStorage.user);
  localStorage.removeItem(LocalStorage.accessToken);
};

const auth = createSlice({
  name: 'auth',
  initialState: {
    profile: JSON.parse(localStorage.getItem(LocalStorage.user)) || {},
  },
  reducers: {
    unauthorize: handleUnauth,
  },

  extraReducers: {
    [login.fulfilled]: handleAuthFulfilled,
    [register.fulfilled]: handleAuthFulfilled,
  },
});

const authReducer = auth.reducer;
export const unauthorize = auth.actions.unauthorize;
export default authReducer;
