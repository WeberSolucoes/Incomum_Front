import React from 'react';
import { Menubar } from 'primereact/menubar';
import { useAuth } from '../../contexts/AuthProvider';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';

const NavbarMenu: React.FC = () => {
    const auth = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        if (window.confirm('Você tem certeza que deseja sair?')) {
            auth.logout(); // Chama a função de logout do contexto
            navigate('/login'); // Redireciona para a página de login
        }
    };

    return (
        <Menubar
            end={<Button label="Sair" icon="pi pi-sign-out" onClick={handleLogout} className="p-button-danger" />}
            style={{
                zIndex: 1000,
                position: 'static',
                top: 0,
                width: '100%',
                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                backgroundColor: '#0152a1',
                height: '50px',
            }}
        />
    );
};

export default NavbarMenu;
