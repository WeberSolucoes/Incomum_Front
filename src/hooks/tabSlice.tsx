import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TabState {
  key: string;  // Nome único para identificar a aba
  title: string; // Título da aba
  state: any; // Dados específicos da aba
}

interface TabsState {
  activeTab: string | null;  // Estado da aba ativa
  tabs: TabState[]; // Lista de abas (cada uma com seu estado)
}

const initialState: TabsState = {
  activeTab: 'Agência',  // Define 'Agência' como valor padrão
  tabs: [],
};

const tabsSlice = createSlice({
  name: 'tabs',
  initialState,
  reducers: {
    setActiveTab(state, action: PayloadAction<string>) {
      // Atualiza diretamente o nome da aba ativa
      state.activeTab = action.payload;
    },

    addTab(state, action: PayloadAction<TabState>) {
      // Adiciona uma nova aba
      state.tabs.push(action.payload);
    },

    removeTab(state, action: PayloadAction<string>) {
      // Remove uma aba específica
      state.tabs = state.tabs.filter((tab) => tab.key !== action.payload);
    },

    setTabState(state, action: PayloadAction<{ key: string; state: any }>) {
      // Atualiza o estado de uma aba específica
      const tab = state.tabs.find((tab) => tab.key === action.payload.key);
      if (tab) {
        tab.state = action.payload.state; // Atualiza os dados específicos da aba
      }
    },

    setTabs(state, action: PayloadAction<TabState[]>) {
      // Substitui as abas por novas
      state.tabs = action.payload;
    },

    resetTabs(state) {
      // Reseta as abas, útil no logout
      state.activeTab = 'Agência'; // Reseta para a aba padrão
      state.tabs = [];
    },
  },
});

export const {
  setActiveTab, 
  addTab, 
  removeTab, 
  setTabState, 
  setTabs, 
  resetTabs 
} = tabsSlice.actions;

export default tabsSlice.reducer;

