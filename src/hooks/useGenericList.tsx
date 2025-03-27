import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './store';
import { setGenericListState } from './genericListSlice';

const useGenericList = (tabKey: string) => {
    const dispatch = useDispatch();
    const listState = useSelector((state: RootState) => state.genericList[tabKey] || {
        items: [],
        searchTerm: '',
        view: 'list',
        activeIndex: 0,
        selectedDescription: null,
    });

    const updateState = (newState: any) => {
        dispatch(setGenericListState({ tabKey, newState }));
    };

    return {
        listState,
        updateState,
    };
};

export default useGenericList;
