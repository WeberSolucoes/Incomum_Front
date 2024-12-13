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
import AreaComercialList from '../components/specific/AreaComercialList';
import AreaComercialCadastro from '../components/specific/AreaComercialCadastro'
import { useAuth } from '../contexts/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { useCodigo } from '../contexts/CodigoProvider';
import '../assets/styles/pages/Agencia.css?v=126';
import '../assets/styles/pages/sidebar.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import Unidade from '../components/specific/UnidadeCadastro';
import Agencia from '../components/specific/AgenciaCadastro';
import Dashboard from '../components/specific/FaturamentoVendedor';
import AeroportoList from '../components/specific/AeroportoList';
import PaisList from '../components/specific/PaisList';
import CidadeList from '../components/specific/CidadeList';
import MoedaList from '../components/specific/MoedaList';
import CepList from '../components/specific/CepList';
import DepartamentoList from '../components/specific/DepartamentoList';
import CompanhiaList from '../components/specific/CompanhiaList';
import AssinaturaList from '../components/specific/AssinaturaList';
import ClasseList from '../components/specific/ClasseList';
import TipoAcomodacaoList from '../components/specific/TipoAcomodacaoList';
import TipoRegimeList from '../components/specific/TipoRegimeList';
import TipoPadraoList from '../components/specific/TipoPadraoList';
import SituacaoTuristicoList from '../components/specific/SituacaoTuristicoList';
import ServicoTuristicoList from '../components/specific/ServicoTuristicoList';
import BandeiraList from '../components/specific/BandeiraList';
import FormaPagamentoList from '../components/specific/FormaPagamentoList';
import FornecedoresList from '../components/specific/FornecedoresList';
import BancoList from '../components/specific/BancoList';

const MainPage: React.FC = () => {
    const [activeComponent, setActiveComponent] = useState<string | null>(null);
    const [isCreatingAgencia, setIsCreatingAgencia] = useState(false);
    const [isCreatingVendedor, setIsCreatingVendedor] = useState(false);
    const [isCreatingUnidade, setIsCreatingUnidade] = useState(false);
    const [selectedUnidadeCode, setSelectedUnidadeCode] = useState<string | null>(null);
    const [isCreatingAreaComercial, setIsCreatingAreaComercial] = useState(false);
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
        setIsCreatingAreaComercial(false);
        setSelectedUnidadeCode(null);
    };

     const handleCreateAreaComercialClick = () => {
        setIsCreatingAreaComercial(true);
        setActiveComponent(null);
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
            case 'AreaComercial':
                setIsCreatingAreaComercial(true);
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

        if (isCreatingAreaComercial) {
            return (
                <FormLayout name='Área Comercial'>
                    <AreaComercialCadastro />    
                </FormLayout>
            )
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
            case 'cadastro_aeroporto':
                return (
                    <FormLayout name='Aeroporto'>
                        <AeroportoList />
                    </FormLayout>
                );
            case 'cadastro_AreaComercial':
                return (
                    <FormLayout name='Área Comercial'>
                        <AreaComercialList/>
                    </FormLayout>
                );
            case 'cadastro_paises':
                return (
                    <FormLayout name='Países'>
                        <PaisList />
                    </FormLayout>
                );
            case 'cadastro_cidade':
                return (
                    <FormLayout name='Cidades'>
                        <CidadeList />
                    </FormLayout>
                );
            case 'cadastro_moeda':
                return (
                    <FormLayout name='Moeda'>
                        <MoedaList />
                    </FormLayout>
                );
            case 'cadastro_cep':
                return (
                    <FormLayout name='Cep'>
                        <CepList />
                    </FormLayout>
                );
            case 'cadastro_departamento':
                return (
                    <FormLayout name='Departamento'>
                        <DepartamentoList />
                    </FormLayout>
                );
            case 'cadastro_companhia':
                return (
                    <FormLayout name='Companhia'>
                        <CompanhiaList />
                    </FormLayout>
                );
            case 'cadastro_assinatura':
                return (
                    <FormLayout name='Assinatura'>
                        <AssinaturaList />
                    </FormLayout>
                );
            case 'cadastro_classe':
                return (
                    <FormLayout name='Classe'>
                        <ClasseList />
                    </FormLayout>
                );
            case 'cadastro_acomodacao':
                return (
                    <FormLayout name='Acomodacao'>
                        <TipoAcomodacaoList />
                    </FormLayout>
                );
            case 'cadastro_regime':
                return (
                    <FormLayout name='Regime'>
                        <TipoRegimeList />
                    </FormLayout>
                );
            case 'cadastro_padrao':
                return (
                    <FormLayout name='Padrao'>
                        <TipoPadraoList />
                    </FormLayout>
                );
            case 'cadastro_situacaoturistico':
                return (
                    <FormLayout name='Turistico'>
                        <SituacaoTuristicoList />
                    </FormLayout>
                );
            case 'cadastro_servicoturistico':
                return (
                    <FormLayout name='Servico'>
                        <ServicoTuristicoList />
                    </FormLayout>
                );
            case 'cadastro_bandeira':
                return (
                    <FormLayout name='Bandeira'>
                        <BandeiraList />
                    </FormLayout>
                );
            case 'cadastro_formapagamento':
                return (
                    <FormLayout name='Forma De Pagamento'>
                        <FormaPagamentoList />
                    </FormLayout>
                );
            case 'cadastro_fornecedores':
                return (
                    <FormLayout name='Fornecedores'>
                        <FornecedoresList parceiroId={null} />
                    </FormLayout>
                );
            case 'cadastro_banco':
                return (
                    <FormLayout name='Banco'>
                        <BancoList />
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
