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
import '../assets/styles/pages/Agencia.css?v=174';
import '../assets/styles/pages/sidebar.css?v=145';
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
import DespesasList from '../components/specific/DespesasList';
import DespesasGeralList from '../components/specific/DespesasGeralList';
import SubGrupoList from '../components/specific/SubGrupoList';
import CentroCustoList from '../components/specific/CentroCustoList';
import GraficoComFiltros from '../components/specific/Grafico';
import { setTabs, setActiveTab, addTab, removeTab, setTabState } from '../hooks/tabSlice';
import { useSelector, useDispatch } from 'react-redux'; 
import { AgenciaListResponse } from '../utils/apiObjects';

const MAX_TABS = 6; 

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
    const dispatch = useDispatch();
    const { activeTab, tabs } = useSelector((state: any) => state.tabs); // Obter estado das abas do Redux

    useEffect(() => {
        // Adicione verificações de autenticação se necessário
    }, [auth, navigate]);

    useEffect(() => {
        const savedTabs = JSON.parse(localStorage.getItem('tabs') || '[]');
        const savedActiveTab = localStorage.getItem('activeTab');
        if (savedTabs.length > 0) {
            dispatch(setTabs(savedTabs));
        }
        if (savedActiveTab) {
            dispatch(setActiveTab(savedActiveTab));
        }
    }, [dispatch]);
    
    useEffect(() => {
        localStorage.setItem('tabs', JSON.stringify(tabs));
        if (activeTab) {
          localStorage.setItem('activeTab', activeTab);
        }
    }, [tabs, activeTab, dispatch]);
    
    const handleMenuItemClick = (itemKey: string) => {
        const existingTab = tabs.find((tab: any) => tab.key === itemKey);
        if (existingTab) {
          dispatch(setActiveTab(itemKey));
        } else if (tabs.length < MAX_TABS) {
          const newTab = { key: itemKey, title: itemKey, state: {} };
          dispatch(addTab(newTab));
          dispatch(setActiveTab(itemKey));
        } else {
          alert(`Você atingiu o limite máximo de ${MAX_TABS} abas abertas.`);
        }
    };
    
    const handleTabClose = (itemKey: string) => {
        const currentTab = tabs.find(tab => tab.key === itemKey);
        if (currentTab) {
            // Salva o estado da aba antes de fechá-la
            console.log('Salvando estado da aba:', currentTab);
            dispatch(setTabState({ key: itemKey, state: currentTab.state }));
        }
    
        // Remove a aba do Redux
        dispatch(removeTab(itemKey));
    
        // Atualiza a aba ativa para a primeira aba, caso a aba fechada seja a ativa
        if (activeTab === itemKey) {
            dispatch(setActiveTab(tabs[0]?.key || null));
        }
    };
    
    const [searchTerm, setSearchTerm] = useState<string>(''); // Para armazenar o termo de pesquisa
    const [items, setItems] = useState<AgenciaListResponse[]>([]); 

    useEffect(() => {
        // Restaurando o estado da aba ao ativar
        if (activeTab) {
            const currentTab = tabs.find(tab => tab.key === activeTab);
            if (currentTab && currentTab.state) {
                const { searchTerm, items } = currentTab.state;
                // Preenche o campo de pesquisa com o searchTerm restaurado
                setSearchTerm(searchTerm); // Atualiza o valor do input com o valor de pesquisa salvo
                setItems(items); // Atualiza os itens com os dados restaurados
            }
        }
    }, [activeTab, tabs]);

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

    const renderComponent = (activeKey: string, tabState: any, isActive) => {
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

        switch (activeKey) {
            case 'Unidade':
                return (
                    <FormLayout name='Unidade'>
                        <UnidadeList isActive={isActive} onCreateClick={handleCreateUnidadeClick} onRecordClick={handleRecordClick} />
                    </FormLayout>
                );
            case 'Agência':
                return (
                    <FormLayout name='Agência'>
                        <AgenciaList isActive={isActive} onCreateClick={handleCreateAgenciaClick} onRecordClick={handleRecordClick} />
                    </FormLayout>
                );
            case 'Vendedor':
                return (
                    <FormLayout name='Vendedor'>
                        <VendedorList isActive={isActive} />
                    </FormLayout>
                );
            case 'Aeroporto':
                return (
                    <FormLayout name='Aeroporto'>
                        <AeroportoList isActive={isActive} />
                    </FormLayout>
                );
            case 'Área Comercial':
                return (
                    <FormLayout name='Área Comercial'>
                        <AreaComercialList isActive={isActive}/>
                    </FormLayout>
                );
            case 'Países':
                return (
                    <FormLayout name='Países'>
                        <PaisList isActive={isActive} />
                    </FormLayout>
                );
            case 'Cidade':
                return (
                    <FormLayout name='Cidades'>
                        <CidadeList isActive={isActive} />
                    </FormLayout>
                );
            case 'Moeda':
                return (
                    <FormLayout name='Moeda'>
                        <MoedaList isActive={isActive} />
                    </FormLayout>
                );
            case 'Cep':
                return (
                    <FormLayout name='Cep'>
                        <CepList isActive={isActive} />
                    </FormLayout>
                );
            case 'Departamento':
                return (
                    <FormLayout name='Departamento'>
                        <DepartamentoList isActive={isActive} />
                    </FormLayout>
                );
            case 'Companhia':
                return (
                    <FormLayout name='Companhia'>
                        <CompanhiaList isActive={isActive} />
                    </FormLayout>
                );
            case 'Assinatura':
                return (
                    <FormLayout name='Assinatura'>
                        <AssinaturaList isActive={isActive} />
                    </FormLayout>
                );
            case 'Classe':
                return (
                    <FormLayout name='Classe'>
                        <ClasseList isActive={isActive} />
                    </FormLayout>
                );
            case 'Acomodação':
                return (
                    <FormLayout name='Acomodacao'>
                        <TipoAcomodacaoList isActive={isActive} />
                    </FormLayout>
                );
            case 'Regime':
                return (
                    <FormLayout name='Regime'>
                        <TipoRegimeList isActive={isActive} />
                    </FormLayout>
                );
            case 'Padrão':
                return (
                    <FormLayout name='Padrao'>
                        <TipoPadraoList isActive={isActive} />
                    </FormLayout>
                );
            case 'Situação Turistico':
                return (
                    <FormLayout name='Turistico'>
                        <SituacaoTuristicoList isActive={isActive} />
                    </FormLayout>
                );
            case 'Serviço Turistico':
                return (
                    <FormLayout name='Servico'>
                        <ServicoTuristicoList isActive={isActive} />
                    </FormLayout>
                );
            case 'Bandeira':
                return (
                    <FormLayout name='Bandeira'>
                        <BandeiraList isActive={isActive} />
                    </FormLayout>
                );
            case 'Forma Pagamento':
                return (
                    <FormLayout name='Forma De Pagamento'>
                        <FormaPagamentoList isActive={isActive} />
                    </FormLayout>
                );
            case 'Fornecedores':
                return (
                    <FormLayout name='Fornecedores'>
                        <FornecedoresList isActive={isActive} parceiroId={null} />
                    </FormLayout>
                );
            case 'Banco':
                return (
                    <FormLayout name='Banco'>
                        <BancoList isActive={isActive} />
                    </FormLayout>
                );
            case 'Despesas':
                return (
                    <FormLayout name='Despesas'>
                        <DespesasList isActive={isActive} />
                   </FormLayout>
                );
            case 'Despesas Geral':
                return (
                    <FormLayout name='Despesas Geral'>
                        <DespesasGeralList isActive={isActive} />
                   </FormLayout>
                );
            case 'SubGrupo':
                return (
                    <FormLayout name='SubGrupo '>
                        <SubGrupoList isActive={isActive} />
                   </FormLayout>
                );
            case 'Centro Custo':
                return (
                    <FormLayout name='Centro De Custo'>
                        <CentroCustoList isActive={isActive} />
                   </FormLayout>
                );
            case 'lancamento_opcao':
                return <Teste message="Lançamento Opção" />;
            case 'financeiro_opcao':
                return <Teste message="Financeiro Opção" />;
            case 'Grafico':
                return <GraficoComFiltros isActive={isActive} />;
            case 'gerencial_faturamento_comercial':
                return <Teste message="Faturamento Comercial" />;
            case 'gerencial_faturamento_vendedor':
                return <Dashboard isActive={isActive} />;
            case 'Relatorio':
                return <Relatorio isActive={isActive} />;
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

    const [isSidebarVisible, setIsSidebarVisible] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarVisible((prev) => !prev);
    };

    return (
      <div>
        <NavbarMenu toggleSidebar={toggleSidebar} />
        <div style={{ display: 'flex', marginTop: '60px' }}>
          <SidebarMenu onMenuItemClick={handleMenuItemClick} visible={isSidebarVisible} onHide={() => setIsSidebarVisible(false)} />
          <div style={{ padding: '20px', flex: 1 }}>
            <div className="p-tabview1 p-component1">
              {/* Renderizando as abas */}
              <div className="p-tabview-nav1" style={{ marginLeft: '230px', marginTop: '-80px', zIndex: '1000' }}>
                {tabs.map((tab) => (
                  <div
                    key={tab.key}
                    className={`p-tabview-nav-item1 ${activeTab === tab.key ? 'p-highlight1' : ''}`}
                    onClick={() => dispatch(setActiveTab(tab.key))}
                  >
                    <span>{tab.title}</span>
                    <button
                      className="p-tabview-close1"
                      onClick={(e) => {
                        e.stopPropagation(); // Impede o clique no botão de fechar de ativar a aba
                        handleTabClose(tab.key);
                      }}
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
              {/* Renderizando o conteúdo diretamente com display: none para abas não ativas */}
                {tabs.map((tab) => (
                  <div 
                    key={tab.key}
                    style={{ display: activeTab === tab.key ? 'block' : 'none' }} // Controla a visibilidade com display
                  >
                    {renderComponent(tab.key, tab.state)} {/* Renderiza o conteúdo da aba */}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    );
};

export default MainPage;
