import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import testReducer from './testSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        test: testReducer,
    },
});
