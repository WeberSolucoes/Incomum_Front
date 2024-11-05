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
    const [searchTerm, setSearchTerm] = useState('');
    const [view, setView] = useState<'list' | 'create'>('list');
    const [loading, setLoading] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const [codigoSelecionado, setCodigoSelecionado] = useState<number | null>(null);

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
            const response = await apiGetAgencia(searchTerm); // Passando o termo de pesquisa
            const mappedData: AgenciaListResponse[] = response.data.map((item: any) => ({
                codigo: item.age_codigo,
                descricao: item.age_descricao,
                responsavel: item.age_responsavel,
                email: item.age_email,
            }));
            setItems(mappedData);
        } catch (error) {
            console.error(error); // Log do erro para debug
            toastError('Erro ao buscar as agências');
        } finally {
            setLoading(false);
        }
    };

    const handleCodeClick = (codigo: number) => {
        setCodigoSelecionado(codigo);
        setView('create'); // Abre a view de cadastro ao selecionar
        setActiveIndex(0);
    };

    const handleCreateClick = () => {
        setCodigoSelecionado(null); // Reseta o código ao criar um novo cadastro
        setView('create');
        setActiveIndex(0);
    };

    const handleBackClick = () => {
        setView('list');
        setCodigoSelecionado(null); // Limpa a seleção ao voltar para lista
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const handleTabChange = (event: any) => {
        if (codigoSelecionado !== null) {
            setActiveIndex(event.index);
        } else {
            toastError("Selecione ou cadastre uma agência primeiro.");
        }
    };

    const handleCodigoUpdate = (novoCodigo: number) => {
        setCodigoSelecionado(novoCodigo);
        toastSuccess("Cadastro realizado com sucesso! As abas estão liberadas.");
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
                    <h1 style={{ color: '#0152a1' }}>{getTitle()}</h1>
                    <TabView activeIndex={activeIndex} onTabChange={handleTabChange}>
                        <TabPanel header="Dados Gerais">
                            <AgenciaCadastro 
                                agenciaId={codigoSelecionado} 
                                onBackClick={handleBackClick}
                                onCodigoUpdate={handleCodigoUpdate}
                            />
                        </TabPanel>
                        <TabPanel header="Agente">
                            <Agente />
                        </TabPanel>
                        <TabPanel header="Logo Agência">
                            <ImageUpload agenciaId={codigoSelecionado} />
                        </TabPanel>
                    </TabView>
                </>
            )}
        </div>
    );
};

export default AgenciaList;
