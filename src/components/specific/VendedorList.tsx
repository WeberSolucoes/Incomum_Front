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

    const { codigo,setCodigo } = useCodigo();

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
        setCodigo(codigo);
        setView('create'); // Muda para a visualização de edição
    };

    const handleCreateClick = () => {
        setCodigo(null); // Reseta o código para criação de um novo vendedor
        setView('create'); // Muda para a visualização de criação
    };

    const handleBackClick = () => {
        setView('list'); // Volta para a visualização da lista
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

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
                    />
                </>
            ) : (
                <>
                    <h1 style={{color:'#0152a1'}}>{codigo === null ? 'Cadastro Vendedor' : `Cadastro Vendedor - ${paisDescricao}`}</h1>
                    <VendedorCadastro onBackClick={handleBackClick} /> {/* Renderiza o componente de cadastro/edição */}
                </>
            )}
        </div>
    );
};

export default VendedorList;
