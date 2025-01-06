import React from 'react';
import { PanelMenu } from 'primereact/panelmenu';
import * as icons from '@coreui/icons'; // Importa todos os ícones da biblioteca CoreUI
import { CIcon } from '@coreui/icons-react'; // O componente que renderiza ícones
import { MenuItem, menuItems, MenuEnum } from '../../utils/MenuEnum'; // Importando o menu enum
import incoback from "../../assets/images/incoback.jpg"

interface SidebarMenuProps {
    onMenuItemClick: (itemKey: MenuEnum) => void;
    visible: boolean;
    onHide: () => void;
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({ onMenuItemClick, visible, onHide }) => {
    const items = menuItems(onMenuItemClick);

    const renderMenuItems = (menuItems: MenuItem[]) => {
        return menuItems.map((item) => {
            const submenuItems = item.items?.map((subItem) => ({
                label: subItem.label,
                icon: () => <CIcon icon={icons[subItem.icon || 'cilPencil']} />,
                command: subItem.command,
            })) || [];

            return {
                label: item.label,
                icon: () => <CIcon icon={icons[item.icon || 'cilPencil']} />,
                items: submenuItems,
            };
        });
    };

    return (
        <div
            className={`sidebar-container ${visible ? 'mobile-visible' : ''}`}
            style={{
                width: '250px',
                height: '200vh',
                position: 'absolute',
                top: '50px',
                left: 0,
                background: 'white',
                padding: '10px',
                borderRight: '1px solid #dee2e6',
                overflowY: 'auto',
                boxShadow: '10px 10px 100px rgba(0, 0, 0, 0.4), -2px -2px 6px rgba(255, 255, 255, 0.6)',
                transition: 'transform 0.3s ease-in-out',
                zIndex: 1000,
            }}
        >
            <div className="sidebar-header">
                <img
                    src={incoback}
                    alt="Logo"
                    style={{ width: '80%', height: 'auto', padding: '10px', margin: 'auto' }}
                />
            </div>
            <PanelMenu model={renderMenuItems(items)} style={{ marginTop: '20px' }} />
            {/* Botão fechar, apenas visível em dispositivos móveis */}
            <button
                onClick={onHide}
                className="close-sidebar"
                style={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    background: 'transparent',
                    border: 'none',
                    fontSize: '1.2rem',
                    cursor: 'pointer',
                }}
            >
                ✖
            </button>
        </div>
    );
};

export default SidebarMenu;

