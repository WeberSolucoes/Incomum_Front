import React, { useState } from 'react';
import { Menubar } from 'primereact/menubar';
import { useAuth } from '../../contexts/AuthProvider';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

interface NavbarMenuProps {
    toggleSidebar: () => void; // Função para alternar o estado do Sidebar
}

const NavbarMenu: React.FC = ({ toggleSidebar }) => {
    const auth = useAuth();
    const navigate = useNavigate();

    // Função para confirmar o logout
    const handleLogout = () => {
        confirmDialog({
            message: 'Você tem certeza que deseja sair?',
            header: 'Confirmar Logout',
            icon: 'pi pi-exclamation-triangle',
            accept: handleConfirmLogout, // Função para confirmar o logout
            reject: () => console.log('Logout cancelado'), // Função para cancelar o logout
            acceptLabel: 'Sim, desejo sair',
            rejectLabel: 'Cancelar',
            className: 'custom-confirm-dialog',
            style: { // Estilizando o modal de confirmação
                width: '30vw',
                borderRadius: '12px',
                backgroundColor: '#f5f5f5',
                color: '#333',
                padding: '10px',
                textAlign: 'center',
            },
        });
    };

    // Função que será chamada quando o usuário confirmar o logout
    const handleConfirmLogout = () => {
        auth.logout(); // Chama a função de logout do contexto
        navigate('/login'); // Redireciona para a página de login
    };

    return (
        <>
            <Menubar
                start={
                    <Button
                        icon="pi pi-bars" // Ícone de hambúrguer
                        onClick={toggleSidebar} // Aciona o toggle do Sidebar
                        className="p-button-rounded p-button-text"
                        tooltipOptions={{ position: 'bottom' }}
                        style={{ color: '#e87717' }}
                    />
                }

                
                end={
                    <Button
                        icon="pi pi-sign-out" // Ícone de logout
                        onClick={handleLogout} // Aciona a confirmação de logout
                        className="p-button-rounded p-button-danger" // Botão redondo com cor vermelha (perigosa)
                        tooltip="Sair"
                        tooltipOptions={{ position: 'bottom' }} // Tooltip para indicar a ação
                        style={{ borderRadius:'16px', color:'#e87717', backgroundColor:'black', border:'none'}} 
                    />
                }
                style={{
                    zIndex: 1000,
                    position: 'static',
                    top: 0,
                    width: '100%',
                    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                    backgroundColor: '#0152a1', // Cor de fundo da navbar
                    height: '50px'
                }}
            />

            {/* O componente ConfirmDialog é necessário para o modal de confirmação */}
            <ConfirmDialog />
        </>
    );
};

export default NavbarMenu;
