import React, { useState, useRef } from 'react';
import { UnidadesListResponse } from '../../utils/apiObjects';
import GenericTable from '../common/GenericTable';
import { apiGetAeroporto } from '../../services/Api';
import { toastError } from '../../utils/customToast';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { useCodigo } from '../../contexts/CodigoProvider'; // Importa o contexto
import Aeroporto from './Aeroporto';
import useEnterKey from '../../hooks/useEnterKey';

const AeroportoList: React.FC<{ tabKey: string; isActive?: boolean }> = ({ tabKey, isActive = true }) =>  {
    const { listState, updateState } = useGenericList(tabKey);
    const [loading, setLoading] = useState(false); // Estado de carregamento
    const buttonRef = useRef<HTMLButtonElement>(null);
    const { codigo,setCodigo } = useCodigo(tabKey); // Acesso ao contexto
    const {
        items,
        searchTerm,
        view,
        activeIndex,
        selectedDescription: descricaoSelecionada
    } = listState;

    const getTitle = () => {
        const maxLength = 27;
        const truncatedDescricao = descricaoSelecionada 
            ? descricaoSelecionada.length > maxLength 
                ? descricaoSelecionada.slice(0, maxLength) + '...' 
                : descricaoSelecionada 
            : '';
        
        return truncatedDescricao 
            ? `Cadastro Aeroporto - ${truncatedDescricao}` 
            : 'Cadastro Aeroporto'; // Título padrão se não houver descrição
    };

    const handleSearch = async () => {
        if (searchTerm.length < 3) {
            toastError('Por favor, insira pelo menos 3 caracteres para realizar a pesquisa.');
            return; // Evita realizar a pesquisa se o termo de busca não atender à condição
        }

        setLoading(true); // Ativa o estado de carregamento

        try {
            const response = await apiGetAeroporto();
            const mappedData: UnidadesListResponse[] = response.data.map((item: any) => ({
                codigo: item.aer_codigo,
                descricao: item.aer_descricao,
                observacao: item.aer_observacao
            }));
            updateState({ 
                items: mappedData.filter(item =>
                    item.descricao.toLowerCase().includes(searchTerm.toLowerCase())
            )});
            setLoading(false)
        } catch (error) {
            toastError('Erro ao buscar os Aeroportos');
        } finally {
            setLoading(false); // Desativa o estado de carregamento
        }
    };

    useEnterKey(handleSearch, isActive, buttonRef);

    const handleCodeClick = (codigo: number) => {
        const agencia = items.find(item => item.codigo === codigo);
        if (agencia) {
            updateState({ selectedDescription: agencia.descricao });
        }
        setCodigo(codigo);
        updateState({ view: 'create', activeIndex: 0 });
    };

    const handleCreateClick = () => {
        setCodigo(null); // Resetando o código para criar uma nova unidade
        updateState({ selectedDescription: null, view: 'create', activeIndex: 0 });
        setDescricaoSelecionada(null); 
    };

    const handleBackClick = () => {
        updateState({ view: 'list', selectedDescription: null });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const columns = [
        { field: 'codigo', header: 'Codigo', style: { width: '6rem', textAlign: 'left' } },
        { field: 'descricao', header: 'Aeroporto' },
        { field: 'observacao', header: 'Observação' },
    ];

    const paisDescricao = codigo ? items.find(item => item.codigo === codigo)?.descricao : '';

    return (
        <div>
            {view === 'list' ? (
                <>
                    <h1 style={{color:'#0152a1'}}>Consulta de Aeroporto</h1>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem', marginTop: '1rem' }}>
                        <InputText
                            style={{ width: '300px' }}
                            placeholder="Buscar"
                            value={searchTerm}
                            onChange={(e) => updateState({ searchTerm: e.target.value.toUpperCase() })}
                        />
                        <Button
                            label={loading ? 'Carregando...' : 'Consultar'}
                            icon={loading ? 'pi pi-spin pi-spinner' : 'pi pi-search'} // Ícone de carregamento ou de busca
                            style={{ marginLeft: '10px', backgroundColor: '#0152a1', height: '34px', borderRadius: '10px' }}
                            onClick={handleSearch}
                            disabled={activeTab !== 'Aeroporto'}
                            ref={buttonRef}
                        />
                        <Button
                            label="Adicionar"
                            icon="pi pi-plus"
                            style={{ marginLeft: 'auto', backgroundColor: '#0152a1', height: '34px', borderRadius: '10px' }}
                            onClick={handleCreateClick} // Chama a função de criação ao clicar no botão
                        />
                    </div>
                    <GenericTable 
                        filteredItems={items} 
                        emptyMessage="Nenhum Aeroporto encontrado" 
                        onCodeClick={handleCodeClick}
                        columns={columns} 
                        tabKey={tabKey}
                    />
                </>
            ) : (
                <>
                    <h1 style={{color:'#0152a1'}}>{getTitle()}</h1>
                    <Aeroporto tabKey={tabKey} onBackClick={handleBackClick} /> {/* Renderiza o componente de cadastro/edição */}
                </>
            )}
        </div>
    );
};

export default AeroportoList;
