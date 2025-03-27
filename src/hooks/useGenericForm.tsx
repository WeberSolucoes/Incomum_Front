import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './store';
import { setGenericListState } from './genericListSlice';
import { useState, useEffect, useCallback } from 'react';
import { UnidadesCreateRequest } from '../utils/apiObjects';

const useGenericForm = (tabKey: string) => {
    const dispatch = useDispatch();

    // Obtém o estado do Redux
    const reduxState = useSelector((state: RootState) => state.genericList[tabKey]?.formState) || null;

    // Estado local inicial
    const [localState, setLocalState] = useState({
        request: {} as UnidadesCreateRequest,
        rua: '',
        numero: '',
        cidade: '',
        selectedAreas: [],
        checked: false,
        cep: '',
        cnpjValido: null
    });

    // Atualiza o estado local quando o Redux muda
    useEffect(() => {
        if (reduxState) {
            setLocalState(reduxState); // Atualiza com os dados do Redux
        } else {
            setLocalState({ // Limpa os dados se o Redux estiver vazio
                request: {} as UnidadesCreateRequest,
                rua: '',
                numero: '',
                cidade: '',
                selectedAreas: [],
                checked: false,
                cep: '',
                cnpjValido: null
            });
        }
    }, [reduxState, tabKey]); // Adiciona `tabKey` para resetar ao mudar de aba

    const updateFormState = useCallback((newState: any) => {
        setLocalState((prev) => {
            const updatedState = { ...prev, ...newState };

            dispatch(setGenericListState({
                tabKey,
                newState: { formState: updatedState }
            }));

            return updatedState;
        });
    }, [tabKey, dispatch]);

    return {
        formState: localState,
        updateFormState
    };
};

export default useGenericForm;
