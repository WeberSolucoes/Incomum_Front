import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TabState {
  key: string;
  title: string;
  state: any; // Dados específicos da aba
}

interface TabsState {
  activeTab: string | null;
  tabs: TabState[];
}

const initialState: TabsState = {
  activeTab: null,
  tabs: [],
};

const tabsSlice = createSlice({
  name: 'tabs',
  initialState,
  reducers: {
    setActiveTab(state, action: PayloadAction<string | null>) {
      state.activeTab = action.payload;
    },
    addTab(state, action: PayloadAction<TabState>) {
      state.tabs.push(action.payload);
    },
    removeTab(state, action: PayloadAction<string>) {
      state.tabs = state.tabs.filter((tab) => tab.key !== action.payload);
    },
    setTabState(state, action: PayloadAction<{ key: string; state: any }>) {
      const tab = state.tabs.find((tab) => tab.key === action.payload.key);
      if (tab) {
        tab.state = action.payload.state; // Atualiza o estado da aba
      }
    },
    setTabs(state, action: PayloadAction<TabState[]>) {
      state.tabs = action.payload; // Substitui as abas por novas
    },
    resetTabs(state) {
      state.activeTab = null;
      state.tabs = []; // Limpa as abas no logout
    },
  },
});

export const { setActiveTab, addTab, removeTab, setTabState, setTabs, resetTabs } = tabsSlice.actions;

export default tabsSlice.reducer;
