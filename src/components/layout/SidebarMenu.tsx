import React, { useState } from 'react';
import { CSidebar, CSidebarHeader, CSidebarBrand, CNavItem, CNavGroup, CSidebarNav, CNavTitle } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { MenuItem, MenuEnum, menuItems } from '../../utils/MenuEnum';
import * as icons from '@coreui/icons';

interface SidebarMenuProps {
    onMenuItemClick: (itemKey: MenuEnum) => void;
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({ onMenuItemClick }) => {
    const items = menuItems(onMenuItemClick);
    const [openGroups, setOpenGroups] = useState<{ [key: number]: boolean }>({});
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const toggleGroup = (index: number) => {
        setOpenGroups(prev => ({ ...prev, [index]: !prev[index] }));
    };

    const toggleSidebar = () => {
        setSidebarCollapsed(!sidebarCollapsed);
    };

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
        <CSidebar
            className={`border-end ${sidebarCollapsed ? 'collapsed' : ''}`}
            unfoldable={!sidebarCollapsed}
            onShowChange={setSidebarCollapsed}
        >
            <CSidebarNav>
                <CNavTitle>Incoback</CNavTitle>
                {renderMenuItems(items)}
            </CSidebarNav>
        </CSidebar>
    );
};

export default SidebarMenu;