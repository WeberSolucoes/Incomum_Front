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

const AeroportoList: React.FC = ({ isActive, state }) => {
    const [items, setItems] = useState<UnidadesListResponse[]>([]);
    const [originalItems, setOriginalItems] = useState<UnidadesListResponse[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [view, setView] = useState<'list' | 'create'>('list'); // Estado para controlar a visualização atual
    const [loading, setLoading] = useState(false); // Estado de carregamento
    const buttonRef = useRef<HTMLButtonElement>(null);

    const { codigo,setCodigo } = useCodigo(); // Acesso ao contexto

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
            toastError('Erro ao buscar os Aeroportos');
        } finally {
            setLoading(false); // Desativa o estado de carregamento
        }
    };

    const handleEnterPress = () => {
        console.log('Enter pressionado na aba ativa!');
    };

    useEnterKey(handleEnterPress, isActive, buttonRef);

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
                            onChange={(e) => setSearchTerm(e.target.value.toUpperCase())}
                        />
                        <Button
                            label={loading ? 'Carregando...' : 'Consultar'}
                            icon={loading ? 'pi pi-spin pi-spinner' : 'pi pi-search'} // Ícone de carregamento ou de busca
                            style={{ marginLeft: '10px', backgroundColor: '#0152a1', height: '34px', borderRadius: '10px' }}
                            onClick={handleSearch}
                            disabled={loading} // Desabilita o botão durante o carregamento
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
                    />
                </>
            ) : (
                <>
                    <h1 style={{color:'#0152a1'}}>{codigo === null ? 'Cadastro Aeroporto' : `Cadastro Aeroporto - ${paisDescricao}`}</h1>
                    <Aeroporto onBackClick={handleBackClick} /> {/* Renderiza o componente de cadastro/edição */}
                </>
            )}
        </div>
    );
};

export default AeroportoList;
