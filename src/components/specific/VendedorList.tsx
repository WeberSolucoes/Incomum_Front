import React, { useState } from 'react';
import { VendedorListResponse } from '../../utils/apiObjects';
import GenericTable from '../common/GenericTable';
import { apiGetVendedor } from '../../services/Api';
import { toastError } from '../../utils/customToast';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { useCodigo } from '../../contexts/CodigoProvider'; // Importa o contexto
import VendedorCadastro from './VendedorCadastro'; // Importa o componente de cadastro
import useEnterKey from '../../hooks/useEnterKey';

const VendedorList: React.FC = () => {
    const [items, setItems] = useState<VendedorListResponse[]>([]);
    const [originalItems, setOriginalItems] = useState<VendedorListResponse[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false); // Estado de carregamento
    const [view, setView] = useState<'list' | 'create'>('list'); // Estado para controlar a visualização atual
    const [descricaoSelecionada, setDescricaoSelecionada] = useState<string | null>(null); // Estado para a descrição

    const { codigo,setCodigo } = useCodigo();


    const getTitle = () => {
        const maxLength = 27;
        const truncatedDescricao = descricaoSelecionada 
            ? descricaoSelecionada.length > maxLength 
                ? descricaoSelecionada.slice(0, maxLength) + '...' 
                : descricaoSelecionada 
            : '';
        
        return truncatedDescricao 
            ? `Cadastro Vendedor - ${truncatedDescricao}` 
            : 'Cadastro Vendedor'; // Título padrão se não houver descrição
    };
    

    const handleSearch = async () => {
        if (searchTerm.length < 3) {
            toastError('Por favor, insira pelo menos 3 caracteres para realizar a pesquisa.');
            return;
        }

        setLoading(true); // Ativa o estado de carregamento

        try {
            const response = await apiGetVendedor();
            const mappedData: VendedorListResponse[] = response.data.map((item: any) => ({
                codigo: item.ven_codigo,
                descricao: item.ven_descricao,
                responsavel: item.ven_cpf,
                email: item.ven_email,
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
            toastError('Erro ao buscar os vendedores');
        } finally {
            setLoading(false); // Desativa o estado de carregamento
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
    };

    const handleCreateClick = () => {
        setCodigo(null); // Reseta o código para criação de um novo vendedor
        setView('create'); // Muda para a visualização de criação
        setDescricaoSelecionada(null); 
    };

    const handleBackClick = () => {
        setDescricaoSelecionada(null); 
        setView('list'); // Volta para a visualização da lista
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    const columns = [
        { field: 'codigo', header: 'Codigo', style: { width: '6rem', textAlign: 'left' } },
        { field: 'descricao', header: 'Vendedor' },
        { field: 'responsavel', header: 'Cpf' },
        { field: 'email', header: 'Email' }
    ];


    const paisDescricao = codigo ? items.find(item => item.codigo === codigo)?.descricao : '';
    
    return (
        <div>
            {view === 'list' ? (
                <>
                    <h1 style={{color:'#0152a1'}}>Consulta de Vendedores</h1>
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
                            disabled={loading} // Desabilita o botão durante o carregamento
                        />
                        <Button
                            label="Adicionar"
                            icon="pi pi-plus"
                            style={{ marginLeft: 'auto', backgroundColor: '#0152a1', height: '34px', borderRadius: '10px' }}
                            onClick={handleCreateClick} // Chama a função de criação
                        />
                    </div>
                    <GenericTable
                        filteredItems={items}
                        emptyMessage="Nenhum Vendedor encontrado"
                        onCodeClick={handleCodeClick}
                        columns={columns}
                    />
                </>
            ) : (
                <>
                    <h1 style={{color:'#0152a1'}}>{getTitle()}</h1>
                    <VendedorCadastro onBackClick={handleBackClick} /> {/* Renderiza o componente de cadastro/edição */}
                </>
            )}
        </div>
    );
};

export default VendedorList;
