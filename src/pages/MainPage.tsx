import React, { useState } from 'react';
import SidebarMenu from '../components/layout/SidebarMenu';
import Teste from '../components/specific/Teste';
import { MenuEnum } from '../utils/MenuEnum'
import FormLayout from '../components/layout/FormLayout';
import UnidadeList from '../components/specific/UnidadeList';
import { useAuth } from '../contexts/AuthProvider';
import { useNavigate } from 'react-router-dom';
import UnidadeCadastro from '../components/specific/UnidadeCadastro';

const MainPage: React.FC = () => {
    const [activeComponent, setActiveComponent] = useState<string | null>(null);
    const auth = useAuth();
    const navigate = useNavigate();

    const handleMenuItemClick = (itemKey: string) => {
        setActiveComponent(itemKey);
    };

    const renderComponent = () => {
        switch (activeComponent) {
            case MenuEnum.cadastro_unidades:
                return <FormLayout name='Unidade'>
                    <UnidadeList search="" />
                    <UnidadeCadastro />
                </FormLayout>;
            case MenuEnum.cadastro_agencias:
                return <Teste message="Cadastro Agências" />;
            case MenuEnum.cadastro_vendedores:
                return <Teste message="Cadastro Vendedores" />;
            case MenuEnum.lancamento_opcao:
                return <Teste message="Lançamento Opção" />;
            case MenuEnum.financeiro_opcao:
                return <Teste message="Financeiro Opção" />;
            case MenuEnum.gerencial_faturamento_unidades:
                return <Teste message="Faturamento Unidades" />;
            case MenuEnum.gerencial_faturamento_comercial:
                return <Teste message="Faturamento Comercial" />;
            case MenuEnum.gerencial_faturamento_vendedor:
                return <Teste message="Faturamento Vendedor" />;
            case MenuEnum.relatorios_simplicados_vendas:
                return <Teste message="Relatórios Simplificados de Vendas" />;
            case MenuEnum.usuario:
                return <Teste message="Configurações de Usuário" />;
            case MenuEnum.perfil:
                return <Teste message="Configurações de Perfil" />;
            case MenuEnum.logout:
                auth.logout();
                navigate('/login');
                break;
            default:
                return <div>Bem-vindo!</div>;
        }
    };

    return (
        <div>
            <div className="p-col-fixed" style={{ width: '250px' }}>
                <SidebarMenu onMenuItemClick={handleMenuItemClick} />
            </div>
            <div className="main-content">
                {renderComponent()}
            </div>
        </div>
    );
};

export default MainPage;
