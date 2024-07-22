// src/pages/NotAuthorizedPage.tsx
import React from 'react';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';

const NaoAutorizadoPage: React.FC = () => {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate('/'); // Redireciona para a página inicial
    };

    const handleGoLogin = () => {
        navigate('/login'); // Redireciona para a página de login
    };

    return (
        <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 p-4">
            <div className="card p-4 shadow-lg border-round w-full lg:w-6">
                <h2 className="text-900 font-medium mb-3">Acesso Negado</h2>
                <p className="text-600 mb-4">Você não tem permissão para acessar esta página.</p>
                <Button label="Voltar para a Página Inicial" icon="pi pi-home" className="p-button-secondary mb-2" onClick={handleGoHome} />
                <Button label="Fazer Login" icon="pi pi-sign-in" className="p-button-primary" onClick={handleGoLogin} />
            </div>
        </div>
    );
};

export default NaoAutorizadoPage;
