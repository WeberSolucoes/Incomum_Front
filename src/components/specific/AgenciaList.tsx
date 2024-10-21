import React, { useEffect, useState } from 'react';
import { AgenciaListResponse } from '../../utils/apiObjects';
import GenericTable from '../common/GenericTable';
import { apiGetAgencia } from '../../services/Api';
import { toastError } from '../../utils/customToast';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { useCodigo } from '../../contexts/CodigoProvider'; // Importa o contexto
import AgenciaCadastro from './AgenciaCadastro'; // Importa o componente de cadastro

const AgenciaList: React.FC = () => {
    const [items, setItems] = useState<AgenciaListResponse[]>([]);
    const [originalItems, setOriginalItems] = useState<AgenciaListResponse[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [view, setView] = useState<'list' | 'create'>('list'); // Estado para controlar a visualização atual

    const { setCodigo } = useCodigo(); // Acesso ao contexto

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await apiGetAgencia();
                const mappedData: AgenciaListResponse[] = response.data.map((item: any) => ({
                    codigo: item.age_codigo,
                    descricao: item.age_descricao,
                    responsavel: item.age_responsavel,
                    email: item.age_email,
                }));
                setItems(mappedData);
                setOriginalItems(mappedData); // Armazena os dados originais
            } catch (error) {
                toastError('Erro ao buscar as agências');
            }
        };

        fetchData();
    }, []);

    const handleSearch = () => {
        if (searchTerm) {
            const searchTermLower = searchTerm.toLowerCase();
            const filteredItems = originalItems.filter(item =>
                item.descricao.toLowerCase().includes(searchTermLower) ||
                item.codigo.toString().toLowerCase().includes(searchTermLower) ||
                (item.responsavel && item.responsavel.toLowerCase().includes(searchTermLower)) ||
                (item.email && item.email.toString().toLowerCase().includes(searchTermLower))
            );
            setItems(filteredItems);
        } else {
            setItems(originalItems); // Restaura a lista original se não houver termo de pesquisa
        }
    };

    const handleCodeClick = (codigo: number) => {
        setCodigo(codigo);
        setView('create'); // Muda para a visualização de edição
    };

    const handleCreateClick = () => {
        setCodigo(null); // Resetando o código para criar uma nova agência
        setView('create'); // Muda para a visualização de criação
    };

    const handleBackClick = () => {
        setView('list'); // Volta para a visualização da lista
        window.scrollTo({
            top: 0,  // Define a posição do topo da página
            behavior: 'smooth' // Adiciona um efeito suave na rolagem
        });
    };

    return (
        <div>
            {view === 'list' ? ( // Verifica qual view deve ser renderizada
                <>
                    <h1 style={{color:'#0152a1'}}>Lista de Agência</h1>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                        <InputText
                            style={{ width: '300px' }}
                            placeholder="Buscar"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)} // Atualiza o termo de busca
                        />
                        <Button
                            label="Consultar"
                            icon="pi pi-search"
                            style={{ marginLeft: '10px', backgroundColor: '#0152a1' }}
                            onClick={handleSearch} // Chama a pesquisa ao clicar no botão
                        />
                        <Button
                            label="Criar"
                            icon="pi pi-plus"
                            style={{ marginLeft: 'auto', backgroundColor: '#0152a1;' }}
                            onClick={handleCreateClick} // Chama a função de criação ao clicar no botão
                        />
                    </div>
                    <GenericTable 
                        filteredItems={items} 
                        emptyMessage="Nenhuma agência encontrada" 
                        onCodeClick={handleCodeClick} // Passa a função para o GenericTable
                    />
                </>
            ) : (
                <>
                    <h1 style={{color:'#0152a1'}}>Cadastro Agência</h1>
                    <AgenciaCadastro onBackClick={handleBackClick} /> {/* Renderiza o componente de cadastro/edição */}
                </>
            )}
        </div>
    );
};

export default AgenciaList;
