// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    login as apiLogin, 
    logout as apiLogout, 
    setToken as apiSetToken, 
    getToken as apiGetToken,
    getPermissions as apiGetPermissions,
    setPermissions as apiSetPermissions,
    userId as apiUserId,
    permissions as apiPermissions
} from '../services/Api';
import { LoginResponse, PermissionsListResponse } from '../utils/apiObjects';

interface AuthContextType {
    isAuthenticated: boolean;
    userPermissions: PermissionsListResponse[];
    login: (email: string, password: string, rememberMe: boolean) => Promise<void>;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: React.ReactNode;
}
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [userPermissions, setUserPermissions] = useState<PermissionsListResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const token = apiGetToken();
        if (token) {
            setIsAuthenticated(true);
            // Defini as permissoes do usuario se existirem            
            const permissions = apiGetPermissions() as PermissionsListResponse[];
            setUserPermissions(permissions);
        }
        setLoading(false);
    }, []);

    const login = async (email: string, password: string, rememberMe: boolean) => {
        try {
            //Pega o token
            const response = await apiLogin({ email, password });
            const responseData: LoginResponse = response.data;
            //Define o token
            apiSetToken(responseData.access, rememberMe);
            setIsAuthenticated(true);

            // Pega o userId
            const userId = await apiUserId();
            const userIdResponse:number = userId.data.id;

            const permissionResponse = await apiPermissions(userIdResponse);
            const permissions: PermissionsListResponse[] = permissionResponse.data;
            setUserPermissions(permissions);
            apiSetPermissions(permissions, rememberMe);
        } catch (error) {
            setIsAuthenticated(false);
            setUserPermissions([]);
            throw new Error('Erro ao fazer login');
        }
    };

    const logout = () => {
        apiLogout();
        setIsAuthenticated(false);
        setUserPermissions([]);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, userPermissions, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const  useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
