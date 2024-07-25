import React, { useState } from 'react';
import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';
import { PanelMenu } from 'primereact/panelmenu';
import { useAuth } from '../../contexts/AuthProvider';
import { PermissionsListResponse } from '../../utils/ApiObjects';
import { menuItems, MenuItem } from '../../utils/MenuEnum';


interface SidebarMenuProps {
    onMenuItemClick: (itemKey: string) => void;
}

const hasPermission = (userPermissions: PermissionsListResponse[], requiredPermissions: string[] | undefined) => {
    if (!requiredPermissions || requiredPermissions.length === 0) return true;
    const userPermissionNames = userPermissions.map(permission => permission.name);
    return requiredPermissions.every(permission => userPermissionNames.includes(permission));
};
const SidebarMenu: React.FC<SidebarMenuProps> = ({ onMenuItemClick }) => {
    const [visible, setVisible] = useState(true);
    const { userPermissions } = useAuth();

    // Filtra itens do menu com base nas permissões do usuário
    const filterItems = (items: MenuItem[]): MenuItem[] => {
        return items
            .filter(item => hasPermission(userPermissions, item.requiredPermissions))
            .map(item => ({
                ...item,
                items: item.items ? filterItems(item.items) : undefined
            }));
    };
  
    const filteredItems = filterItems(menuItems(onMenuItemClick));

    return (
        <div>
            <Button className='side-menu-buttom' icon="pi pi-bars" onClick={() => setVisible(true)} style={{position: 'fixed'}}/>
            <Sidebar visible={visible} onHide={() => setVisible(false)}>
                <img src="https://incoback.com.br/static/img/logo.png" alt="logo" height={47.5} className="mb-3" />
                <PanelMenu model={filteredItems} />
            </Sidebar>
        </div>
    );
};

export default SidebarMenu;
