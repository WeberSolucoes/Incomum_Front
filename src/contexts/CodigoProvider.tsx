import { createContext, useState, ReactNode, useContext } from 'react';


interface CodigoContextProps {
    codigo: number | null;
    setCodigo: (codigo: number | null) => void;
    view: 'list' | 'create';
    setView: (view: 'list' | 'create') => void;
}

const CodigoContext = createContext<CodigoContextProps | undefined>(undefined);

export const CodigoProvider = ({ children }: { children: ReactNode }) => {
    const [codigo, setCodigo] = useState<number | null>(null);
    const [view, setView] = useState<'list' | 'create'>('list');

    return (
        <CodigoContext.Provider value={{ codigo, setCodigo, view, setView }}>
            {children}
        </CodigoContext.Provider>
    );
};

export const useCodigo = () => {
    const context = useContext(CodigoContext);
    if (!context) {
        throw new Error('useCodigo must be used within a CodigoProvider');
    }
    return context;
};
