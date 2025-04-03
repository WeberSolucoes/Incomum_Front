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
import '../assets/styles/pages/Agencia.css?v=181';
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
import ProtocoloList from '../components/specific/ProtocoloList';
import GeracaoFatura from '../components/specific/GeracaoFatura';
import RelatorioProtocolo from '../components/specific/RelatorioProtocolo';

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
    const [codigosPorTab, setCodigosPorTab] = useState<{ [tabKey: string]: number | null }>({});
    const [componentCache, setComponentCache] = useState<{ [key: string]: React.ReactNode }>({});

    const setCodigoPorTab = (tabKey: string, codigo: number | null) => {
        setCodigosPorTab((prev) => ({
            ...prev,
            [tabKey]: codigo
        }));
    };

    const componentMap: { [key in MenuEnum]: React.ReactNode } = {
        [MenuEnum.cadastro_agencias]: <AgenciaList tabKey="agencia" />,
        [MenuEnum.cadastro_unidades]: <UnidadeList tabKey="unidades" />,
        [MenuEnum.cadastro_vendedores]: <VendedorList tabKey="vendedor" />,
        [MenuEnum.cadastro_aeroporto]: <AeroportoList tabKey='aeroporto' />,
        [MenuEnum.cadastro_assinatura]: <AssinaturaList  />,
        [MenuEnum.relatorios_simplicados_vendas]: <Relatorio />,
        [MenuEnum.relatorio_centro_custo]: <RelatorioCentroCusto/>,
        [MenuEnum.cadastro_banco]: <BancoList />,
        [MenuEnum.relatorio_boleto]: <RelatorioBoleto />,
        // Adicione outros componentes aqui
    };

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
    }, [tabs, activeTab]);
    
    const handleMenuItemClick = (itemKey: MenuEnum) => {
        const uniqueKey = `${itemKey}-${Date.now()}`;
        const newTab = { key: uniqueKey, title: itemKey, state: {} };
        dispatch(addTab(newTab));
        dispatch(setActiveTab(uniqueKey));
    };
    
    const handleTabClose = (key: string) => {
        dispatch(removeTab(key));
        if (activeTab === key && tabs.length > 0) {
            dispatch(setActiveTab(tabs[0].key));
        }
        setComponentCache((prevCache) => {
            const newCache = { ...prevCache };
            delete newCache[key];
            return newCache;
        });
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

    const renderComponent = (itemKey: MenuEnum, state: any, onStateChange: (state: any) => void) => {
        const Component = componentMap[itemKey];
        if (!Component) return null;

        return React.cloneElement(Component, { state, onStateChange });
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
                <div style={{ padding: '20px', flex: 1, width: '1000px' }}>
                    <div className="p-tabview p-component1">
                        <div className="p-tabview-nav1" style={{ marginLeft: '230px', marginTop: '-80px', zIndex: '1000' }}>
                            {tabs.map((tab) => (
                                <div
                                    key={tab.key}
                                    className={`p-tabview-nav-item1 ${activeTab === tab.key ? 'p-highlight' : ''}`}
                                    onClick={() => dispatch(setActiveTab(tab.key))}
                                >
                                    <span>{tab.title}</span>
                                    <button
                                        className="p-tabview-close1"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleTabClose(tab.key);
                                        }}
                                    >
                                        &times;
                                    </button>
                                </div>
                            ))}
                        </div>

                        {tabs.map((tab) => {
                            const componentKey = tab.key.split('-')[0] as MenuEnum;
                            const Component = componentMap[componentKey];

                            if (!Component) {
                                console.error(`Componente não encontrado para a chave: ${componentKey}`);
                                return null; // Ou retorne um componente de fallback
                            }

                            if (!componentCache[tab.key]) {
                                setComponentCache((prevCache) => ({
                                    ...prevCache,
                                    [tab.key]: React.cloneElement(Component, {
                                        tabKey: tab.key, // Passa o tabKey como prop
                                        state: tab.state,
                                        onStateChange: (newState) => {
                                            dispatch(updateTabState({ key: tab.key, state: newState }));
                                        },
                                    }),
                                }));
                            }

                            return (
                                activeTab === tab.key && (
                                  <div key={tab.key}>
                                    {/* SOLUÇÃO SIMPLES: Apenas verifica se NÃO é Relatório */}
                                    {componentKey !== MenuEnum.relatorios_simplicados_vendas && componentKey !== MenuEnum.relatorio_centro_custo && componentKey !== MenuEnum.relatorio_boleto ? (
                                      <FormLayout name={tab.title}>{componentCache[tab.key]}</FormLayout>
                                    ) : (
                                      componentCache[tab.key]
                                    )}
                                  </div>
                                )
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MainPage;
