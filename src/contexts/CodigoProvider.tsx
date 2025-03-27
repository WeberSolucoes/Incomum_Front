import React, { createContext, useContext, useState, ReactNode, useMemo, useCallback } from 'react';

interface TabState {
  codigo: number | null;
  view: 'list' | 'create';
}

interface CodigoContextType {
  estados: Record<string, TabState>;
  setTabState: (tabKey: string, newState: Partial<TabState>) => void;
}

const CodigoContext = createContext<CodigoContextType | undefined>(undefined);

export const CodigoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [estados, setEstados] = useState<Record<string, TabState>>({});

  // Usar useMemo para estabilizar o valor do contexto
  const contextValue = useMemo(() => ({
    estados,
    setTabState: (tabKey: string, newState: Partial<TabState>) => {
      setEstados(prev => ({
        ...prev,
        [tabKey]: {
          ...(prev[tabKey] || { codigo: null, view: 'list' }),
          ...newState
        }
      }));
    }
  }), [estados]);

  return (
    <CodigoContext.Provider value={contextValue}>
      {children}
    </CodigoContext.Provider>
  );
};

export const useCodigo = (tabKey: string) => {
  const context = useContext(CodigoContext);
  if (!context) {
    throw new Error('useCodigo must be used within a CodigoProvider');
  }

  const estadoAtual = context.estados[tabKey] || { codigo: null, view: 'list' };
  
  // Usar useCallback para memorizar as funções
  const setCodigo = useCallback((codigo: number | null) => {
    context.setTabState(tabKey, { codigo });
  }, [context, tabKey]);

  const setView = useCallback((view: 'list' | 'create') => {
    context.setTabState(tabKey, { view });
  }, [context, tabKey]);

  return {
    codigo: estadoAtual.codigo,
    view: estadoAtual.view,
    setCodigo,
    setView
  };
};
