import React, { useState } from 'react';
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

    const handleSearch = async () => {
        if (searchTerm) {
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
            }
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

    const handleBackClick = () => {
        setView('list'); // Volta para a visualização da lista
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
                <>
                    <Button
                        label="Voltar"
                        icon="pi pi-arrow-left"
                        style={{ marginBottom: '1rem', backgroundColor: '#0152a1' }}
                        onClick={handleBackClick} // Botão para voltar à lista
                    />
                    <UnidadeCadastro /> {/* Renderiza o componente de cadastro/edição */}
                </>
            )}
        </div>
    );
};

export default UnidadeListConsolidada;
