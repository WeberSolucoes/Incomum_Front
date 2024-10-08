import React, { useState, useEffect } from 'react';
import SidebarMenu from '../components/layout/SidebarMenu';
import NavbarMenu from '../components/layout/NavbarMenu';
import Teste from '../components/specific/Teste';
import Relatorio from '../components/specific/Relatorio';
import { MenuEnum } from '../utils/MenuEnum';
import FormLayout from '../components/layout/FormLayout';
import UnidadeList from '../components/specific/UnidadeList';
import Vendedor from '../components/specific/VendedorCadastro';
import AgenciaList from '../components/specific/AgenciaList';
import VendedorList from '../components/specific/VendedorList';
import { useAuth } from '../contexts/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { useCodigo } from '../contexts/CodigoProvider'; // Importar o contexto
import '../assets/styles/pages/Agencia.css';
import '../assets/styles/pages/sidebar.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@coreui/coreui/dist/css/coreui.min.css';
import '@coreui/icons/css/all.min.css'; 
import 'react-toastify/dist/ReactToastify.css';
import Unidade from '../components/specific/UnidadeCadastro';
import Agencia from '../components/specific/AgenciaCadastro';
import Dashboard from '../components/specific/FaturamentoVendedor';

const MainPage: React.FC = () => {
    const [activeComponent, setActiveComponent] = useState<string | null>(null);
    const [loading, setLoading] = useState(true); // Novo estado para verificar o carregamento da autenticação
    const auth = useAuth();
    const navigate = useNavigate();
    const { resetContext } = useCodigo(); // Usar o contexto

    useEffect(() => {
        // Verifica se o usuário está autenticado
        if (!auth.isAuthenticated) {
            navigate('/login'); // Redireciona para a página de login se não estiver autenticado
        } else {
            setLoading(false); // Definir loading como false após autenticação
        }
    }, [auth.isAuthenticated, navigate]);

    const handleMenuItemClick = (itemKey: string) => {
        setActiveComponent(itemKey);
        resetContext(); // Resetar o contexto quando o item do menu for clicado
    };

    const renderComponent = () => {
        switch (activeComponent) {
            case MenuEnum.cadastro_unidades:
                return (
                    <FormLayout name='Unidade'>
                        <UnidadeList search="" />
                        <Unidade />
                    </FormLayout>
                );
            case MenuEnum.cadastro_agencias:
                return (
                    <FormLayout name='Agencia'>
                        <AgenciaList search="" />
                        <Agencia />
                    </FormLayout>
                );
            case MenuEnum.cadastro_vendedores:
                return (
                    <FormLayout name='Vendedor'>
                        <VendedorList search="" />
                        <Vendedor />
                    </FormLayout>
                );
            case MenuEnum.lancamento_opcao:
                return <Teste message="Lançamento Opção" />;
            case MenuEnum.financeiro_opcao:
                return <Teste message="Financeiro Opção" />;
            case MenuEnum.gerencial_faturamento_unidades:
                return <Teste message="Faturamento Unidades" />;
            case MenuEnum.gerencial_faturamento_comercial:
                return <Teste message="Faturamento Comercial" />;
            case MenuEnum.gerencial_faturamento_vendedor:
                return <Dashboard />;
            case MenuEnum.relatorios_simplicados_vendas:
                return <Relatorio />;
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

    // Verificação se ainda está carregando a autenticação
    if (loading) {
        return <div>Carregando...</div>;
    }

    return (
        <div>
            <NavbarMenu />
            <div style={{ display: 'flex', marginTop: '60px' }}>
                <SidebarMenu onMenuItemClick={handleMenuItemClick} />
                <div style={{ padding: '20px', flex: 1, width: '1000px' }}>
                    {renderComponent()}
                </div>
            </div>
        </div>
    );
};

export default MainPage;
