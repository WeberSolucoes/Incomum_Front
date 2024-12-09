import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface AuthContextType {
    login: (email: string, senha: string, remember: boolean) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
    token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [token, setToken] = useState<string | null>(null);

    // Efeito para verificar o token ao carregar a página
    useEffect(() => {
        const savedToken = localStorage.getItem('token') || sessionStorage.getItem('token');
        const expiration = localStorage.getItem('authExpiration') || sessionStorage.getItem('authExpiration');
    
        if (savedToken && expiration) {
            const isExpired = Date.now() > Number(expiration);
            if (isExpired) {
                logout();
            } else {
                setIsAuthenticated(true);
                setToken(savedToken);
            }
        }
    }, []);

    const login = async (email: string, senha: string, remember: boolean) => {
        try {
            const response = await axios.post('https://api.incoback.com.br/api/incomum/usuario/login/', {
                loginemail: email,
                loginsenha: senha,
            });

            if (response.data.access) {
                const token = response.data.access;
                setIsAuthenticated(true);
                setToken(token);

                if (remember) {
                    localStorage.setItem('token', token);
                    const expirationTime = Date.now() + 2 * 60 * 60 * 1000; // 2 horas
                    localStorage.setItem('authExpiration', expirationTime.toString());
                } else {
                    const sessionExpiration = Date.now() + 30 * 60 * 1000; // 30 minutos
                    localStorage.setItem('authExpiration', sessionExpiration.toString());
                }
            } else {
                throw new Error(response.data.error_message || 'Erro ao efetuar login');
            }
        } catch (error) {
            throw new Error('Erro ao efetuar login: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
        }
    };

    const logout = () => {
        setIsAuthenticated(false);
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('authExpiration');
        sessionStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ login, logout, isAuthenticated, token }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
