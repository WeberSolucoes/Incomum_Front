import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FormState {
    request: any;
    rua: string;
    numero: string;
    cidade: string;
    ibge: number;
    areacomercial: string;
    selectedAreas: number[];
    checked: boolean;
    cep: string;
    cnpjValido: boolean | null;
    loading: boolean;
}

interface GenericListState {
    // Estados para listagem
    items: any[];
    originalItems: any[];
    searchTerm: string;
    view: 'list' | 'create';
    activeIndex: number;
    selectedDescription: string | null;
    loading: boolean;
    
    // Estados para formulários
    formState: FormState;
}

interface GenericListStateMap {
    [tabKey: string]: GenericListState;
}

const initialFormState: FormState = {
    request: {},
    rua: '',
    numero: '',
    cidade: '',
    ibge: 0,
    areacomercial: '',
    selectedAreas: [],
    checked: false,
    cep: '',
    cnpjValido: null,
    loading: false
};

const initialState: GenericListStateMap = {};

const genericListSlice = createSlice({
    name: 'genericList',
    initialState,
    reducers: {
        setGenericListState(state, action: PayloadAction<{ 
            tabKey: string; 
            newState: Partial<GenericListState> 
        }>) {
            const { tabKey, newState } = action.payload;
            if (!state[tabKey]) {
                state[tabKey] = {
                    items: [],
                    originalItems: [],
                    searchTerm: '',
                    view: 'list',
                    activeIndex: 0,
                    selectedDescription: null,
                    loading: false,
                    formState: { ...initialFormState }
                };
            }
            state[tabKey] = { ...state[tabKey], ...newState };
        },

        setGenericFormState(state, action: PayloadAction<{
            tabKey: string;
            newFormState: Partial<FormState>
        }>) {
            const { tabKey, newFormState } = action.payload;
            if (!state[tabKey]) {
                state[tabKey] = {
                    ...initialState,
                    formState: { ...initialFormState, ...newFormState }
                };
            } else {
                state[tabKey].formState = { 
                    ...state[tabKey].formState, 
                    ...newFormState 
                };
            }
        },

        resetGenericListState(state, action: PayloadAction<{ tabKey: string }>) {
            const { tabKey } = action.payload;
            delete state[tabKey];
        },

        resetGenericFormState(state, action: PayloadAction<{ tabKey: string }>) {
            const { tabKey } = action.payload;
            if (state[tabKey]) {
                state[tabKey].formState = { ...initialFormState };
            }
        }
    },
});

export const { 
    setGenericListState,
    setGenericFormState,
    resetGenericListState,
    resetGenericFormState
} = genericListSlice.actions;

export default genericListSlice.reducer;
