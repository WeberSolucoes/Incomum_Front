import React, { useState, useEffect } from 'react';
import { CSidebar, CNavItem, CNavGroup, CSidebarNav, CNavTitle } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { MenuItem, MenuEnum, menuItems } from '../../utils/MenuEnum';
import * as icons from '@coreui/icons';
import { Button } from 'primereact/button';  // Importa o botão do PrimeReact

interface SidebarMenuProps {
    onMenuItemClick: (itemKey: MenuEnum) => void;
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({ onMenuItemClick }) => {
    const items = menuItems(onMenuItemClick);
    const [openGroups, setOpenGroups] = useState<{ [key: number]: boolean }>({});
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    const toggleGroup = (index: number) => {
        setOpenGroups(prev => ({ ...prev, [index]: !prev[index] }));
    };

    const toggleSidebar = () => {
        setSidebarCollapsed(!sidebarCollapsed);
    };

    // Verifica a largura da tela para ajustar a sidebar e o botão
    useEffect(() => {
        const handleResize = () => {
            const isMobileView = window.innerWidth <= 768;
            setIsMobile(isMobileView);
            if (isMobileView) {
                setSidebarCollapsed(true);  // Colapsa a sidebar em telas pequenas
            } else {
                setSidebarCollapsed(false);  // Expande a sidebar em telas maiores
            }
        };

        // Adiciona o evento de resize
        window.addEventListener('resize', handleResize);
        handleResize();  // Chama a função de ajuste no início

        // Remove o evento ao desmontar o componente
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const renderMenuItems = (menuItems: MenuItem[]) => {
        return menuItems.map((item, index) => {
            if (item.items) {
                return (
                    <CNavGroup
                        key={index}
                        toggler={
                            <div onClick={() => toggleGroup(index)} className="nav-link">
                                {item.icon && <CIcon className="nav-icon" icon={icons[item.icon as keyof typeof icons]} />}
                                {!sidebarCollapsed && <span>{item.label}</span>}
                            </div>
                        }
                        className={openGroups[index] ? "open" : ""}
                    >
                        {renderMenuItems(item.items)}
                    </CNavGroup>
                );
            }
            return (
                <CNavItem
                    key={index}
                    href="#"
                    onClick={() => item.command && item.command()}
                    className="nav-link"
                >
                    {item.icon && <CIcon className="nav-icon" icon={icons[item.icon as keyof typeof icons]} />}
                    {!sidebarCollapsed && <span>{item.label}</span>}
                </CNavItem>
            );
        });
    };

    return (
        <>
            {isMobile && (
                <Button
                    icon={sidebarCollapsed ? 'pi pi-bars' : 'pi pi-times'}  // Ícone de menu hamburguer ou de fechar
                    className="hamburger-btn p-button-rounded p-button-text"
                    onClick={toggleSidebar}
                />
            )}
            <CSidebar
                className={`border-end ${sidebarCollapsed ? 'collapsed' : ''}`}
                unfoldable={!sidebarCollapsed}
                visible={!isMobile || !sidebarCollapsed}
                onShowChange={setSidebarCollapsed}
            >
                <CSidebarNav>
                    <CNavTitle>Incoback</CNavTitle>
                    {renderMenuItems(items)}
                </CSidebarNav>
            </CSidebar>
        </>
    );
};

export default SidebarMenu;
