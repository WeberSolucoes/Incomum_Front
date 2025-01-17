import { configureStore } from '@reduxjs/toolkit';
import tabsReducer from './tabSlice';

export const store = configureStore({
  reducer: {
    tabs: tabsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
