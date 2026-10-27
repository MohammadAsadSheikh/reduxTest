import { configureStore } from '@reduxjs/toolkit';

import authReducer from '../features/auth/authSlice';
import counterReducer from '../features/counter/counterSlice';
import usersReducer from '../features/users/usersSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    counter: counterReducer,
    users: usersReducer,
  },
});
