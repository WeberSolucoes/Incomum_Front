import React, { useState } from 'react';
import { UnidadesListResponse } from '../../utils/apiObjects';
import GenericTable from '../common/GenericTable';
import { apiGetUnidades } from '../../services/Api';
import { toastError } from '../../utils/customToast';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { useCodigo } from '../../contexts/CodigoProvider'; // Importa o contexto
import UnidadeCadastro from './UnidadeCadastro'; // Importa o componente de cadastro
import useEnterKey from '../../hooks/useEnterKey';
import useGenericList from '../../hooks/useGenericList';

interface UnidadesListResponse {
    codigo: number;
    descricao: string;
    responsavel: string;
    email: string;
}


const UnidadeListConsolidada: React.FC<{ tabKey: string }> = ({ tabKey }) => {
    const [items, setItems] = useState<UnidadesListResponse[]>([]);
    const [originalItems, setOriginalItems] = useState<UnidadesListResponse[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [view, setView] = useState<'list' | 'create'>('list'); // Estado para controlar a visualização atual
    const [loading, setLoading] = useState(false); // Estado de carregamento
    const [descricaoSelecionada, setDescricaoSelecionada] = useState<string | null>(null); // Estado para a descrição

    const { codigo,setCodigo } = useCodigo(); // Acesso ao contexto

    const getTitle = () => {
        const maxLength = 27;
        const truncatedDescricao = descricaoSelecionada 
            ? descricaoSelecionada.length > maxLength 
                ? descricaoSelecionada.slice(0, maxLength) + '...' 
                : descricaoSelecionada 
            : '';
        
        return truncatedDescricao 
            ? `Cadastro Unidade - ${truncatedDescricao}` 
            : 'Cadastro Unidade'; // Título padrão se não houver descrição
    };

    const handleSearch = async () => {
        if (searchTerm.length < 3) {
            toastError('Por favor, insira pelo menos 3 caracteres para realizar a pesquisa.');
            return;
        }

        updateState({ loading: true });

        try {
            const response = await apiGetUnidades();
            const mappedData: UnidadesListResponse[] = response.data.map((item: any) => ({
                codigo: item.loj_codigo,
                descricao: item.loj_descricao,
                responsavel: item.loj_email,
                email: item.loj_cnpj,
            }));

            const searchTermLower = searchTerm.toLowerCase();
            const filteredItems = mappedData.filter(item =>
                item.descricao.toLowerCase().includes(searchTermLower) ||
                item.codigo.toString().toLowerCase().includes(searchTermLower) ||
                (item.responsavel && item.responsavel.toLowerCase().includes(searchTermLower)) ||
                (item.email && item.email.toLowerCase().includes(searchTermLower))
            );

            updateState({
                items: filteredItems,
                originalItems: mappedData,
                loading: false
            });
        } catch (error) {
            toastError('Erro ao buscar as unidades');
            updateState({ loading: false });
        }
    };


    const handleBackClick = () => {
        updateState({ view: 'list' });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    

    const handleRowClick = (rowCodigo: number) => {
        console.log('[ROW CLICK] Código selecionado:', rowCodigo);
        
        // Atualiza ambos os estados de forma síncrona
        setCodigo(rowCodigo);
        setView('create');
        updateState({ view: 'create' }); // Atualiza o estado local também
    };

    const handleCreateClick = () => {
        setCodigo(null);
        setView('create');
        updateState({ view: 'create' }); // Atualiza o estado local também
    };

    useEffect(() => {
        console.log('[DEBUG] Estado atual:', { 
            codigoContext: codigo, 
            viewContext: view,
            viewLocal: listState.view
        });
    }, [codigo, view, listState.view]);

    const columns = [
        { field: 'codigo', header: 'Código', style: { width: '6rem', textAlign: 'left' }},
        { field: 'descricao', header: 'Descrição' },
        { field: 'responsavel', header: 'Responsável' },
        { field: 'email', header: 'Email' }
    ];

    return (
        <div>
            {view === 'list' ? (
                <>
                    <h1 style={{color:'#0152a1'}}>Lista de Unidades</h1>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                        <InputText
                            style={{ width: '300px' }}
                            placeholder="Buscar"
                            value={searchTerm}
                            onChange={(e) => updateState({ searchTerm: e.target.value })}
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
                        emptyMessage="Nenhuma unidade encontrada" 
                        onCodeClick={handleRowClick}
                        columns={columns}
                        tabKey={tabKey}
                    />
                </>
            ) : (
                <>
                    <h1 style={{color:'#0152a1'}}>Cadastro Unidade</h1>
                    <UnidadeCadastro tabKey={tabKey} onBackClick={handleBackClick} />
                </>
            )}
        </div>
    );
};

export default UnidadeListConsolidada;
