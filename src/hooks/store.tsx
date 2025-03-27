// store.ts
import { configureStore } from '@reduxjs/toolkit';
import tabsReducer from './tabSlice';
import agenciaReducer from './agenciaSlice';
import genericListReducer from './genericListSlice';

export const store = configureStore({
  reducer: {
    tabs: tabsReducer,
    agencia: agenciaReducer,
    genericList: genericListReducer, // Adicione o slice genérico ao store
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
