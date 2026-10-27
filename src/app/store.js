import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './../features/counter/counterSlice';
import authSlice from './../features/auth/authSlice';
import usersReducer from '../features/users/usersSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    auth: authSlice,
    users: usersReducer,
  },
});
