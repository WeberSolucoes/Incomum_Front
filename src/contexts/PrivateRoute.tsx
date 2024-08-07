// src/components/PrivateRoute.tsx
import React from 'react';
import { Navigate,useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { ProgressSpinner } from 'primereact/progressspinner';
interface PrivateRouteProps {
    requiredPermissions?: string[];
    element: React.ReactElement;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element, requiredPermissions = []}) => {
    const { isAuthenticated, userPermissions, loading} = useAuth();
    const location = useLocation();
    if (loading) {
        return <ProgressSpinner />;
    }
    const userPermissionNames = userPermissions.map(permission => permission.name);
    const hasRequiredPermissions = requiredPermissions.every(permission => userPermissionNames.includes(permission));
    return  isAuthenticated && hasRequiredPermissions ? (
            element
    ):(
        <Navigate to="/nao-autorizado" state={{ from: location }} replace />
    );
};

export default PrivateRoute;
