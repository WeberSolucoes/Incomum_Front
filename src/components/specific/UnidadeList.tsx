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

const UnidadeListConsolidada: React.FC = () => {
    const [items, setItems] = useState<UnidadesListResponse[]>([]);
    const [originalItems, setOriginalItems] = useState<UnidadesListResponse[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [view, setView] = useState<'list' | 'create'>('list'); // Estado para controlar a visualização atual
    const [loading, setLoading] = useState(false); // Estado de carregamento

    const { codigo,setCodigo } = useCodigo(); // Acesso ao contexto

    const handleSearch = async () => {
        if (searchTerm.length < 3) {
            toastError('Por favor, insira pelo menos 3 caracteres para realizar a pesquisa.');
            return; // Evita realizar a pesquisa se o termo de busca não atender à condição
        }

        setLoading(true); // Ativa o estado de carregamento

        try {
            const response = await apiGetUnidades();
            const mappedData: UnidadesListResponse[] = response.data.map((item: any) => ({
                codigo: item.loj_codigo,
                descricao: item.loj_descricao,
                responsavel: item.loj_email,
                email: item.loj_cnpj,
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
            toastError('Erro ao buscar as unidades');
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
        setCodigo(null); // Resetando o código para criar uma nova unidade
        setView('create'); // Muda para a visualização de criação
    };

    const handleBackClick = () => {
        setView('list'); // Volta para a visualização da lista
        window.scrollTo({
            top: 0,  // Define a posição do topo da página
            behavior: 'smooth' // Adiciona um efeito suave na rolagem
        });
    };

    const columns = [
        { field: 'codigo', header: 'Codigo' },
        { field: 'descricao', header: 'Unidade' },
        { field: 'responsavel', header: 'Email' },
        { field: 'email', header: 'Cnpj' }
    ];

    const paisDescricao = codigo ? items.find(item => item.codigo === codigo)?.descricao : '';
    
    return (
        <div>
            {view === 'list' ? (
                <>
                    <h1 style={{color:'#0152a1'}}>Consulta de Unidades</h1>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                        <InputText
                            style={{ width: '300px' }}
                            placeholder="Buscar"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value.toUpperCase())}
                        />
                        <Button
                            label={loading ? 'Carregando...' : 'Consultar'}
                            icon={loading ? 'pi pi-spin pi-spinner' : 'pi pi-search'} // Ícone de carregamento ou de busca
                            style={{ marginLeft: '10px', backgroundColor: '#0152a1', height: '34px', borderRadius: '10px' }}
                            onClick={handleSearch}
                            disabled={loading} // Desabilita o botão durante o carregamento
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
                        emptyMessage="Nenhuma Unidade encontrada" 
                        onCodeClick={handleCodeClick}
                        columns={columns}
                    />
                </>
            ) : (
                <>
                    <h1 style={{color:'#0152a1'}}>{codigo === null ? 'Cadastro Unidade' : `Cadastro Unidade - ${paisDescricao}`}</h1>
                    <UnidadeCadastro onBackClick={handleBackClick} /> {/* Renderiza o componente de cadastro/edição */}
                </>
            )}
        </div>
    );
};

export default UnidadeListConsolidada;
