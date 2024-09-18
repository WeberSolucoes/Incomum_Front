import React from 'react';
import { Menubar } from 'primereact/menubar';
import { MenuItem } from 'primereact/menuitem';
import { useAuth } from '../../contexts/AuthProvider';
import { useNavigate } from 'react-router-dom';

const NavbarMenu: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const items: MenuItem[] = [
        {
            label: user?.name || 'Usuário',
            icon: 'pi pi-user',
            items: [
                {
                    label: 'Configurações',
                    icon: 'pi pi-cog',
                    command: () => navigate('/configuracoes')
                },
                {
                    label: 'Logout',
                    icon: 'pi pi-sign-out',
                    command: () => {
                        logout();
                        navigate('/login');
                    }
                }
            ]
        }
    ];

    return (
        <Menubar
            model={items}
            start={<img style={{marginLeft:'30px'}} src="https://incoback.com.br/static/img/incoback.jpg" alt="logo" height={58} width={160} />}
            style={{ zIndex: 1000, position: 'static', top: 0, width: '100%', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',backgroundColor:'white' }}
        />
    );
};

export default NavbarMenu;