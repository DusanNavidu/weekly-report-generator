import { configureStore } from '@reduxjs/toolkit';
import projectReducer from './slices/projectSlice';
import reportReducer from './slices/reportSlice';

export const store = configureStore({
  reducer: {
    projects: projectReducer,
    reports: reportReducer, 
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;