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
import useEnterKey from '../../hooks/useEnterKey';



const AgenciaList: React.FC = () => {
    const { codigo, setCodigo } = useCodigo(); // Ajuste conforme a origem do código
    const [items, setItems] = useState<AgenciaListResponse[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [view, setView] = useState<'list' | 'create'>('list');
    const [loading, setLoading] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const [codigoSelecionado, setCodigoSelecionado] = useState<number | null>(null);
    const [descricaoSelecionada, setDescricaoSelecionada] = useState<string | null>(null); // Estado para a descrição

    const getTitle = () => {
        const maxLength = 27;
        const truncatedDescricao = descricaoSelecionada 
            ? descricaoSelecionada.length > maxLength 
                ? descricaoSelecionada.slice(0, maxLength) + '...' 
                : descricaoSelecionada 
            : '';
        
        return truncatedDescricao 
            ? `Cadastro Agência - ${truncatedDescricao}` 
            : 'Cadastro Agência'; // Título padrão se não houver descrição
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
            setItems(mappedData.filter(item =>
                item.descricao.toLowerCase().includes(searchTerm.toLowerCase())
            ));
        } catch (error) {
            toastError('Erro ao buscar as agências');
        } finally {
            setLoading(false);
        }
    };

    useEnterKey(handleSearch);

    const handleCodeClick = (codigo: number) => {
        const agencia = items.find(item => item.codigo === codigo); // Encontre a agência selecionada
        if (agencia) {
            setDescricaoSelecionada(agencia.descricao); // Atualiza a descrição selecionada
        }
        setCodigo(codigo);
        setView('create'); // Abre a view de cadastro ao selecionar
        setActiveIndex(0);
    };

    const handleCreateClick = () => {
        setCodigo(null); // Reseta o código ao criar um novo cadastro
        setDescricaoSelecionada(null); // Limpa a descrição ao criar um novo cadastro
        setView('create');
        setActiveIndex(0);
    };

    const handleBackClick = () => {
        setView('list');
        setCodigo(null); // Limpa a seleção ao voltar para lista
        setDescricaoSelecionada(null); // Limpa a descrição ao voltar para a lista
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const handleTabChange = (event: any) => {
        if (codigo !== null) {
            setActiveIndex(event.index);
        } else {
            toastError("Selecione ou cadastre uma agência primeiro.");
        }
    };

    const handleCodigoUpdate = (novoCodigo: number) => {
        setCodigo(novoCodigo);
        toastSuccess("Cadastro realizado com sucesso! As abas estão liberadas.");
        const agencia = items.find(item => item.codigo === novoCodigo); // Obtem a nova agencia
        if (agencia) {
            setDescricaoSelecionada(agencia.descricao); // Atualiza a descrição após o cadastro
        }
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
                            onChange={(e) => setSearchTerm(e.target.value.toUpperCase())}
                        />
                        <Button
                            label={loading ? 'Carregando...' : 'Consultar'}
                            icon={loading ? 'pi pi-spin pi-spinner' : 'pi pi-search'}
                            style={{ marginLeft: '10px', backgroundColor: '#0152a1', height: '34px', borderRadius: '10px' }}
                            onClick={handleSearch}
                            disabled={loading}
                        />
                        <Button
                            label="Criar"
                            icon="pi pi-plus"
                            style={{ marginLeft: 'auto', backgroundColor: '#0152a1', height: '34px', borderRadius: '10px'  }}
                            onClick={handleCreateClick}
                        />
                    </div>
                    <GenericTable 
                        filteredItems={items} 
                        emptyMessage="Nenhuma Agência encontrada" 
                        onCodeClick={handleCodeClick}
                    />
                </>
            ) : (
                <>
                    <h1 style={{ color: '#0152a1' }}>{getTitle()}</h1> {/* Título dinâmico */}
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
