import React, { useState, useEffect } from 'react';
import SidebarMenu from '../components/layout/SidebarMenu';
import NavbarMenu from '../components/layout/NavbarMenu';
import Teste from '../components/specific/Teste';
import Relatorio from '../components/specific/Relatorio';
import FormLayout from '../components/layout/FormLayout';
import UnidadeList from '../components/specific/UnidadeList';
import VendedorCadastro from '../components/specific/VendedorCadastro';
import AgenciaList from '../components/specific/AgenciaList';
import VendedorList from '../components/specific/VendedorList';
import { useAuth } from '../contexts/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { useCodigo } from '../contexts/CodigoProvider';
import '../assets/styles/pages/Agencia.css';
import '../assets/styles/pages/sidebar.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import Unidade from '../components/specific/UnidadeCadastro';
import Agencia from '../components/specific/AgenciaCadastro';
import Dashboard from '../components/specific/FaturamentoVendedor';

const MainPage: React.FC = () => {
    const [activeComponent, setActiveComponent] = useState<string | null>(null);
    const [isCreatingAgencia, setIsCreatingAgencia] = useState(false);
    const [isCreatingVendedor, setIsCreatingVendedor] = useState(false);
    const [isCreatingUnidade, setIsCreatingUnidade] = useState(false);
    const [selectedUnidadeCode, setSelectedUnidadeCode] = useState<string | null>(null);
    const auth = useAuth();
    const navigate = useNavigate();
    const { resetContext } = useCodigo();

    useEffect(() => {
        // Adicione verificações de autenticação se necessário
    }, [auth, navigate]);

    const handleMenuItemClick = (itemKey: string) => {
        setActiveComponent(itemKey);
        resetContext();
        // Resetar estados de criação
        setIsCreatingAgencia(false);
        setIsCreatingVendedor(false);
        setIsCreatingUnidade(false);
        setSelectedUnidadeCode(null);
    };

    const handleCreateAgenciaClick = () => {
        setIsCreatingAgencia(true);
        setActiveComponent(null);
    };

    const handleCreateVendedorClick = () => {
        setIsCreatingVendedor(true);
        setActiveComponent(null);
    };

    const handleCreateUnidadeClick = () => {
        setIsCreatingUnidade(true);
        setSelectedUnidadeCode(null);
        setActiveComponent(null);
    };

    const handleRecordClick = (itemType: string, codigo?: string) => {
        switch (itemType) {
            case 'unidade':
                setSelectedUnidadeCode(codigo || null);
                setIsCreatingUnidade(true);
                break;
            case 'agencia':
                setIsCreatingAgencia(true);
                break;
            case 'vendedor':
                setIsCreatingVendedor(true);
                break;
            default:
                break;
        }
        setActiveComponent(null);
    };

    const renderComponent = () => {
        if (isCreatingAgencia) {
            return (
                <FormLayout name='Agência'>
                    <Agencia />
                </FormLayout>
            );
        }

        if (isCreatingVendedor) {
            return (
                <FormLayout name='Vendedor'>
                    <VendedorCadastro />
                </FormLayout>
            );
        }

        if (isCreatingUnidade) {
            return (
                <FormLayout name={selectedUnidadeCode ? 'Editar Unidade' : 'Unidade'}>
                    <Unidade code={selectedUnidadeCode} />
                </FormLayout>
            );
        }

        switch (activeComponent) {
            case 'cadastro_unidades':
                return (
                    <FormLayout name='Unidade'>
                        <UnidadeList onCreateClick={handleCreateUnidadeClick} onRecordClick={handleRecordClick} />
                    </FormLayout>
                );
            case 'cadastro_agencias':
                return (
                    <FormLayout name='Agência'>
                        <AgenciaList onCreateClick={handleCreateAgenciaClick} onRecordClick={handleRecordClick} />
                    </FormLayout>
                );
            case 'cadastro_vendedores':
                return (
                    <FormLayout name='Vendedor'>
                        <VendedorList />
                    </FormLayout>
                );
            case 'lancamento_opcao':
                return <Teste message="Lançamento Opção" />;
            case 'financeiro_opcao':
                return <Teste message="Financeiro Opção" />;
            case 'gerencial_faturamento_unidades':
                return <Teste message="Faturamento Unidades" />;
            case 'gerencial_faturamento_comercial':
                return <Teste message="Faturamento Comercial" />;
            case 'gerencial_faturamento_vendedor':
                return <Dashboard />;
            case 'relatorios_simplicados_vendas':
                return <Relatorio />;
            case 'usuario':
                return <Teste message="Configurações de Usuário" />;
            case 'perfil':
                return <Teste message="Configurações de Perfil" />;
            case 'logout':
                auth.logout();
                navigate('/login');
                break;
            default:
                return <div>Bem-vindo!</div>;
        }
    };

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
