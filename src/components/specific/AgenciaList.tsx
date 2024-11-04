import React, { useEffect, useState } from 'react';
import { AgenciaListResponse } from '../../utils/apiObjects';
import GenericTable from '../common/GenericTable';
import { apiGetAgencia } from '../../services/Api';
import { toastError } from '../../utils/customToast';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { useCodigo } from '../../contexts/CodigoProvider'; // Importa o contexto
import AgenciaCadastro from './AgenciaCadastro'; // Importa o componente de cadastro
import { TabPanel, TabView } from 'primereact/tabview';
import Agente from './Agente';
import ImageUpload from './logo';


const AgenciaList: React.FC = () => {
    const [items, setItems] = useState<AgenciaListResponse[]>([]);
    const [originalItems, setOriginalItems] = useState<AgenciaListResponse[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [view, setView] = useState<'list' | 'create'>('list');
    const [loading, setLoading] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const [tabsEnabled, setTabsEnabled] = useState(false);
    const { codigo, setCodigo } = useCodigo(); // Obtém o código do contexto
    const [agenciaCadastrada, setAgenciaCadastrada] = useState(false);

    const getTitle = () => {
        switch (activeIndex) {
            case 0:
                return 'Cadastro Agência';
            case 1:
                return 'Cadastro Agente';
            case 2:
                return 'Logo Agência';
            default:
                return 'Cadastro Agência';
        }
    };

    const handleSearch = async () => {
        if (searchTerm.length < 3) {
            toastError('Por favor, insira pelo menos 3 caracteres para realizar a pesquisa.');
            return;
        }

        setLoading(true);
        try {
            const response = await apiGetAgencia();
            const mappedData: AgenciaListResponse[] = response.data.map((item: any) => ({
                codigo: item.age_codigo,
                descricao: item.age_descricao,
                responsavel: item.age_responsavel,
                email: item.age_email,
            }));
            setOriginalItems(mappedData);

            const searchTermLower = searchTerm.toLowerCase();
            const filteredItems = mappedData.filter(item =>
                item.descricao.toLowerCase().includes(searchTermLower) ||
                item.codigo.toString().toLowerCase().includes(searchTermLower) ||
                (item.responsavel && item.responsavel.toLowerCase().includes(searchTermLower)) ||
                (item.email && item.email.toLowerCase().includes(searchTermLower))
            );
            setItems(filteredItems);
        } catch (error) {
            toastError('Erro ao buscar as agências');
        } finally {
            setLoading(false);
        }
    };

    const handleCodeClick = (codigo: number) => {
        setCodigo(codigo);
        setAgenciaCadastrada(true);
        setView('create');
        setActiveIndex(0);
    };

    const handleCreateClick = () => {
        setCodigo(null);
        setAgenciaCadastrada(false);
        setView('create');
        setActiveIndex(0);
        setTabsEnabled(false); // Reseta o estado de habilitação das abas ao criar nova agência
    };

    const handleImageUploadClick = () => {
        setView('uploadImage');
    };

    const handleBackClick = () => {
        setView('list');
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const handleTabChange = (event: any) => {
        setActiveIndex(event.index);
    };

    // Função chamada após o cadastro da agência
    const handleAgencyRegistered = () => {
        setTabsEnabled(true); // Habilita as abas
        setActiveIndex(1); // Muda para a aba "Agente" se desejar
    };

    return (
        <div>
            {view === 'list' ? (
                <>
                    <h1 style={{ color: '#0152a1' }}>Consulta de Agências</h1>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                        <InputText
                            style={{ width: '300px' }}
                            placeholder="Buscar"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Button
                            label={loading ? 'Carregando...' : 'Consultar'}
                            icon={loading ? 'pi pi-spin pi-spinner' : 'pi pi-search'}
                            style={{ marginLeft: '10px', backgroundColor: '#0152a1' }}
                            onClick={handleSearch}
                            disabled={loading}
                        />
                        <Button
                            label="Criar"
                            icon="pi pi-plus"
                            style={{ marginLeft: 'auto', backgroundColor: '#0152a1' }}
                            onClick={handleCreateClick}
                        />
                    </div>
                    <GenericTable
                        filteredItems={items}
                        emptyMessage="Nenhuma agência encontrada"
                        onCodeClick={handleCodeClick}
                    />
                </>
            ) : (
                <>
                    <h1 style={{ color: '#0152a1' }}>Cadastro de Agência</h1>
                    <TabView activeIndex={activeIndex} onTabChange={handleTabChange}>
                        <TabPanel header="Dados Gerais" disabled={!tabsEnabled}>
                            <AgenciaCadastro
                                agenciaId={codigo}
                                onBackClick={handleBackClick} // Usa a função de voltar
                                onImageUploadClick={handleImageUploadClick} // Usa a função de upload de imagem
                                onAgencyRegistered={handleAgencyRegistered} // Passa a função para habilitar as abas
                            />
                        </TabPanel>
                        <TabPanel header="Agente" disabled={!tabsEnabled}>
                            <Agente />
                        </TabPanel>
                        <TabPanel header="Logo Agência" disabled={!tabsEnabled}>
                            <ImageUpload agenciaId={codigo} />
                        </TabPanel>
                    </TabView>
                </>
            )}
        </div>
    );
};

export default AgenciaList;
