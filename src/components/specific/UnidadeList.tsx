import React, { useEffect, useState } from 'react';
import { UnidadesListResponse } from '../../utils/apiObjects';
import GenericTable from '../common/GenericTable';
import { apiGetUnidades } from '../../services/Api';
import { toastError } from '../../utils/customToast';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { useCodigo } from '../../contexts/CodigoProvider'; // Importa o contexto
import UnidadeCadastro from './UnidadeCadastro'; // Importa o componente de cadastro

const UnidadeListConsolidada: React.FC = () => {
    const [items, setItems] = useState<UnidadesListResponse[]>([]);
    const [originalItems, setOriginalItems] = useState<UnidadesListResponse[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [view, setView] = useState<'list' | 'create'>('list'); // Estado para controlar a visualização atual

    const { setCodigo } = useCodigo(); // Acesso ao contexto

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await apiGetUnidades();
                const mappedData: UnidadesListResponse[] = response.data.map((item: any) => ({
                    codigo: item.loj_codigo,
                    descricao: item.loj_descricao,
                    responsavel: item.loj_email,
                    email: item.loj_cnpj,
                }));
                setItems(mappedData);
                setOriginalItems(mappedData);
            } catch (error) {
                toastError('Erro ao buscar as unidades');
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
                (item.email && item.email.toLowerCase().includes(searchTermLower))
            );
            setItems(filteredItems);
        } else {
            setItems(originalItems);
        }
    };

    const handleCodeClick = (codigo: number) => {
        setCodigo(codigo);
        setView('create'); // Muda para a visualização de edição
    };

    const handleCreateClick = () => {
        setCodigo(null); // Resetando o código para criar uma nova unidade
        setView('create'); // Muda para a visualização de criação
    };

    return (
        <div>
            {view === 'list' ? ( // Verifica qual view deve ser renderizada
                <>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                        <InputText
                            style={{ width: '300px' }}
                            placeholder="Buscar"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Button
                            label="Consultar"
                            icon="pi pi-search"
                            style={{ marginLeft: '10px', backgroundColor: '#0152a1' }}
                            onClick={handleSearch}
                        />
                        <Button
                            label="Criar"
                            icon="pi pi-plus"
                            style={{ marginLeft: 'auto', backgroundColor: '#001a40' }}
                            onClick={handleCreateClick} // Chama a função de criação ao clicar no botão
                        />
                    </div>
                    <GenericTable 
                        filteredItems={items} 
                        emptyMessage="Nenhuma unidade encontrada" 
                        onCodeClick={handleCodeClick} 
                    />
                </>
            ) : (
                <UnidadeCadastro /> // Renderiza o componente de cadastro/edição
            )}
        </div>
    );
};

export default UnidadeListConsolidada;
