import React from 'react';
import { PanelMenu } from 'primereact/panelmenu';
import * as icons from '@coreui/icons'; // Importa todos os ícones da biblioteca CoreUI
import { CIcon } from '@coreui/icons-react'; // O componente que renderiza ícones
import { MenuItem, menuItems, MenuEnum } from '../../utils/MenuEnum'; // Importando o menu enum

interface SidebarMenuProps {
    onMenuItemClick: (itemKey: MenuEnum) => void;
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({ onMenuItemClick }) => {
    const items = menuItems(onMenuItemClick);

    // Função que cria os itens do menu com ícones
    const renderMenuItems = (menuItems: MenuItem[]) => {
        return menuItems.map((item) => {
            const submenuItems = item.items?.map((subItem) => ({
                label: subItem.label,
                icon: () => <CIcon icon={icons[subItem.icon || 'cilPencil']} />, // Renderiza os ícones
                command: subItem.command
            })) || [];

            return {
                label: item.label,
                icon: () => <CIcon icon={icons[item.icon || 'cilPencil']} />, // Renderiza os ícones
                items: submenuItems
            };
        });
    };

    return (
        <div style={{
            width: '250px',
            height: '180vh',
            position: 'absolute',
            top: 50,
            left: 0,
            background: 'white',
            padding: '10px',
            borderRight: '1px solid #dee2e6',
            overflowY: 'auto',
            boxShadow: '10px 10px 100px rgba(0, 0, 0, 0.4),-2px -2px 6px rgba(255, 255, 255, 0.6)'
        }}>
            <div className="sidebar-header">
                <img 
                    src="https://incoback.com.br/static/img/incoback.jpg" 
                    alt="Logo"
                    style={{ width: '80%', height: 'auto', padding: '10px',margin:'auto' }}
                />
            </div>
            <PanelMenu model={renderMenuItems(items)} style={{ marginTop: '20px' }} />
        </div>
    );
};

export default SidebarMenu;
