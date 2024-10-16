import React, { useEffect, useState } from 'react';
import { VendedorListResponse } from '../../utils/apiObjects';
import GenericTable from '../common/GenericTable';
import { apiGetVendedor } from '../../services/Api';
import { toastError } from '../../utils/customToast';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { useCodigo } from '../../contexts/CodigoProvider'; // Importa o contexto
import VendedorCadastro from './VendedorCadastro'; // Importa o componente de cadastro

const VendedorList: React.FC = () => {
    const [items, setItems] = useState<VendedorListResponse[]>([]);
    const [originalItems, setOriginalItems] = useState<VendedorListResponse[]>([]); // Para armazenar os dados originais
    const [searchTerm, setSearchTerm] = useState('');
    const [view, setView] = useState<'list' | 'create'>('list'); // Estado para controlar a visualização atual

    const { setCodigo } = useCodigo(); // Acesso ao contexto

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await apiGetVendedor();
                const mappedData: VendedorListResponse[] = response.data.map((item: any) => ({
                    codigo: item.ven_codigo,
                    descricao: item.ven_descricao,
                    responsavel: item.ven_cpf,
                    email: item.ven_email,
                }));
                setItems(mappedData);
                setOriginalItems(mappedData); // Armazena os dados originais
            } catch (error) {
                toastError('Erro ao buscar os vendedores');
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

    const handleCreateClick = () => {
        setCodigo(null); // Resetando o código para criar um novo vendedor
        setView('create'); // Muda para a visualização de criação
    };

    const handleCodeClick = (codigo: number) => {
        setCodigo(codigo);
        setView('create'); // Muda para a visualização de edição
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
                        emptyMessage="Nenhum vendedor encontrado" 
                        onCodeClick={handleCodeClick} // Passando a função de clique no código
                    />
                </>
            ) : (
                <VendedorCadastro /> // Renderiza o componente de cadastro/edição
            )}
        </div>
    );
};

export default VendedorList;
