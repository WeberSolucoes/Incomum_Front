import React from 'react';
import { Menubar } from 'primereact/menubar';
import { useAuth } from '../../contexts/AuthProvider';

const NavbarMenu: React.FC = () => {
    useAuth();
    return (
        <Menubar
            style={{ zIndex: 1000, position: 'static', top: 0, width: '100%', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',backgroundColor:'#0152a1',height:'50px' }}
        />
    );
};

export default NavbarMenu;