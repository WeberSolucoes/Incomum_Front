import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { ProgressSpinner } from 'primereact/progressspinner';

interface PrivateRouteProps {
    requiredPermissions?: string[]; // Permissões necessárias para acessar a rota
    element: React.ReactElement;   // Elemento a ser renderizado se os critérios forem atendidos
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element, requiredPermissions = [] }) => {
    const { isAuthenticated, userPermissions = [], loading } = useAuth(); // Suporte a valores padrão
    const location = useLocation();

    if (loading) {
        // Exibe o spinner enquanto o estado de autenticação é carregado
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <ProgressSpinner />
            </div>
        );
    }

    if (!isAuthenticated) {
        // Redireciona para login se o usuário não estiver autenticado
        return <Navigate to="/login/" state={{ from: location }} replace />;
    }

    const userPermissionNames = userPermissions.map((permission) => permission.name);
    const hasRequiredPermissions = requiredPermissions.every((permission) =>
        userPermissionNames.includes(permission)
    );

    if (!hasRequiredPermissions) {
        // Redireciona para "Não Autorizado" se as permissões forem insuficientes
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    // Renderiza o elemento se todos os critérios forem atendidos
    return element;
};

export default PrivateRoute;
