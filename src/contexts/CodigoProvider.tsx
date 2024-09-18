// CodigoContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface CodigoContextProps {
    codigo: number | null;
    setCodigo: (codigo: number | null) => void;
    view: 'list' | 'create';
    setView: (view: 'list' | 'create') => void;
    resetContext: () => void; // Nova função para resetar o contexto
}

const CodigoContext = createContext<CodigoContextProps | undefined>(undefined);

export const CodigoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [codigo, setCodigo] = useState<number | null>(null);
    const [view, setView] = useState<'list' | 'create'>('list');

    const resetContext = () => {
        setCodigo(null);
        setView('list');
    };

    return (
        <CodigoContext.Provider value={{ codigo, setCodigo, view, setView, resetContext }}>
            {children}
        </CodigoContext.Provider>
    );
};

export const useCodigo = () => {
    const context = useContext(CodigoContext);
    if (context === undefined) {
        throw new Error('useCodigo must be used within a CodigoProvider');
    }
    return context;
};
