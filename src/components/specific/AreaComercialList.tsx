import React, { useEffect, useState } from 'react';
import { AreaComercialResponse } from '../../utils/apiObjects';
import GenericTable from '../common/GenericTable';
import { apiGetAreaComercial } from '../../services/Api';
import { toastError, toastSucess } from '../../utils/customToast';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { useCodigo } from '../../contexts/CodigoProvider'; // Importa o contexto
import AreaComercialCadastro from './AreaComercialCadastro'; // Importa o componente de cadastro
import Unidades from './Unidades'
import { TabPanel, TabView } from 'primereact/tabview';
import ImageUpload from './logo';
import useEnterKey from '../../hooks/useEnterKey';

const AreaComercialList: React.FC = () => {
    const { codigo, setCodigo } = useCodigo(); // Ajuste conforme a origem do código
    const [items, setItems] = useState<AreaComercialResponse[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [view, setView] = useState<'list' | 'create'>('list');
    const [loading, setLoading] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const [codigoSelecionado, setCodigoSelecionado] = useState<number | null>(null);
    const [descricaoSelecionada, setDescricaoSelecionada] = useState<string | null>(null); // Estado para a descrição

    const getTitle = () => {
        return descricaoSelecionada 
            ? `Cadastro Área Comercial - ${descricaoSelecionada}` 
            : 'Cadastro Área Comercial'; // Título padrão se não houver descrição
    };

    const handleSearch = async () => {
        if (searchTerm.length < 3) {
            toastError('Por favor, insira pelo menos 3 caracteres para realizar a pesquisa.');
            return;
        }

        setLoading(true);

        try {
            const response = await apiGetAreaComercial();
            const mappedData: AreaComercialResponse[] = response.data.map((item: any) => ({
                codigo: item.aco_codigo,
                descricao: item.aco_descricao,
                situacao: item.aco_situacao,
                rateio: item.aco_rateio,
            }));
            setItems(mappedData.filter(item =>
                item.descricao.toLowerCase().includes(searchTerm.toLowerCase())
            ));
        } catch (error) {
            toastError('Erro ao buscar as Áreas Comerciais');
        } finally {
            setLoading(false);
        }
    };

    useEnterKey(handleSearch);

    const handleCodeClick = (codigo: number) => {
        const AreaComercialList = items.find(item => item.codigo === codigo); // Encontre a área comercial selecionada
        if (AreaComercialList) {
            setDescricaoSelecionada(AreaComercialList.descricao); // Atualiza a descrição selecionada
        }
        setCodigo(codigo);
        setView('create');
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
            toastError("Selecione ou cadastre uma Área Comercial primeiro.");
        }
    };

    const handleCodigoUpdate = (novoCodigo: number) => {
        setCodigo(novoCodigo);
        toastSuccess("Cadastro realizado com sucesso! As abas estão liberadas.");
        const AreaComercialList = items.find(item => item.codigo === novoCodigo); // Obtem a nova área comercial
        if (AreaComercialList) {
            setDescricaoSelecionada(AreaComercialList.descricao); // Atualiza a descrição após o cadastro
        }
    };

    // Definindo as colunas dinamicamente
    const columns = [
        { field: 'descricao', header: 'Descrição' },
        { field: 'situacao', header: 'Situação' },
        { field: 'rateio', header: 'Rateio' }
    ];

    return (
        <div>
            {view === 'list' ? (
                <>
                    <h1 style={{ color: '#0152a1' }}>Consulta Área Comercial</h1>
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
                            label="Adicionar"
                            icon="pi pi-plus"
                            style={{ marginLeft: 'auto', backgroundColor: '#0152a1', height: '34px', borderRadius: '10px'  }}
                            onClick={handleCreateClick}
                        />
                    </div>
                    <GenericTable 
                        filteredItems={items} 
                        emptyMessage="Nenhuma Área Comercial encontrada" 
                        onCodeClick={handleCodeClick}
                        columns={columns}
                    />
                </>
            ) : (
                <>
                    <h1 style={{ color: '#0152a1' }}>{getTitle()}</h1> {/* Título dinâmico */}
                    <TabView activeIndex={activeIndex} onTabChange={handleTabChange}>
                        <TabPanel header="Dados Gerais">
                            <AreaComercialCadastro 
                                acoCodigo={codigo} 
                                onBackClick={handleBackClick}
                                onCodigoUpdate={handleCodigoUpdate}
                            />
                        </TabPanel>
                        <TabPanel header="Unidades">
                        <Unidades acoCodigo={codigo} />
                        </TabPanel>
                    </TabView>
                </>
            )}
        </div>
    );
};

export default AreaComercialList;
