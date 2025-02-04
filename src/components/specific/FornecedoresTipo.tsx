import React, { useState } from 'react';
import { AgenciaListResponse } from '../../utils/apiObjects';
import GenericTable from '../common/GenericTable';
import { apiGetParceiro } from '../../services/Api';
import { toastError } from '../../utils/customToast';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { useCodigo } from '../../contexts/CodigoProvider'; // Importa o contexto
import { TabPanel, TabView } from 'primereact/tabview';
import ImageUpload from './logo';
import Fornecedores from './Fornecedores';
import FornecedoresContato from './FornecedoresContato';

interface ParceiroListProps {
    parceiroId: number | null; // Aceita null para representar uma nova agência
}

const FornecedoresTipo: React.FC<ParceiroListProps> = () => {
    const { codigo,setCodigo } = useCodigo(); // Ajuste conforme a origem do código
    const [items, setItems] = useState<AgenciaListResponse[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [view, setView] = useState<'list' | 'create' | 'uploadImage'>('list'); // Adiciona 'uploadImage'
    const [loading, setLoading] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const [parceiroId, setAgenciaId] = useState<number | null>(null); // Estado para ID da agência
    const [isCadastroConcluido, setIsCadastroConcluido] = useState(false);

    const handleCadastroConcluido = () => {
        setIsCadastroConcluido(true);
    };

    const getTitle = () => {
        switch (activeIndex) {
            case 0:
                return 'Cadastro Parceiro';
            case 1:
                return 'Cadastro Contato';
            case 2:
                return 'Logo Agência';
            default:
                return 'Cadastro Agência';
        }
    };

    const handleSearch = async () => {
        if (searchTerm.length < 3) {
            toastError('Por favor, insira pelo menos 3 caracteres para realizar a pesquisa.');
            return;
        }

        setLoading(true);

        try {
            const response = await apiGetParceiro();
            const mappedData: AgenciaListResponse[] = response.data.map((item: any) => ({
                codigo: item.par_codigo,
                descricao: item.par_descricao,
                responsavel: item.par_obs,
                email: item.par_cnpjcpf,
            }));
            setItems(mappedData.filter(item =>
                item.descricao.toLowerCase().includes(searchTerm.toLowerCase())
            ));
        } catch (error) {
            toastError('Erro ao buscar os Parceiro');
        } finally {
            setLoading(false);
        }
    };

    const handleCodeClick = (codigo: number) => {
        setCodigo(codigo);
        setView('create');
        setActiveIndex(0);
    };

    const handleCreateClick = () => {
        setAgenciaId(null);
        setView('create');
        setActiveIndex(0);
    };

    const handleImageUploadClick = () => {
        setView('uploadImage');
    };

    const handleBackClick = () => {
        setView('list');
        setActiveIndex(0);
    };

    return (
        <div>
            {view === 'list' ? (
                <>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem',marginTop:'10px' }}>
                        <InputText
                            style={{ width: '300px' }}
                            placeholder="Buscar"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Button
                            label={loading ? 'Carregando...' : 'Consultar'}
                            icon={loading ? 'pi pi-spin pi-spinner' : 'pi pi-search'}
                            style={{ marginLeft: '10px', backgroundColor: '#0152a1', height: '34px', borderRadius: '10px' }}
                            onClick={handleSearch}
                            disabled={loading}
                        />
                        <Button
                            label="Criar"
                            icon="pi pi-plus"
                            style={{ marginLeft: 'auto', backgroundColor: '#0152a1', borderRadius: '10px' }}
                            onClick={handleCreateClick}
                        />
                    </div>
                    <GenericTable 
                        filteredItems={items} 
                        emptyMessage="Nenhum Parceiro encontrado" 
                        onCodeClick={handleCodeClick}
                    />
                </>
            ) : view === 'create' ? (
                <>
                    <h1 style={{ color: '#0152a1' }}>{getTitle()}</h1>
                    <TabView
                            activeIndex={activeIndex}
                            onTabChange={(e) => {
                                // Verifica se o usuário está tentando acessar "Contatos" (índice 1)
                                if (e.index === 1 && !codigo) {
                                    toastError("Complete o cadastro em 'Dados Gerais' antes de acessar os contatos.");
                                    return;
                                }
                                setActiveIndex(e.index); // Atualiza a aba ativa
                            }}
                        >
                        <TabPanel header="Dados Gerais">
                            <Fornecedores
                                parceiroId={parceiroId} 
                                onBackClick={handleBackClick} 
                                onImageUploadClick={handleImageUploadClick}
                                onCadastroConcluido={handleCadastroConcluido}
                            />
                        </TabPanel>
                        <TabPanel header="Contatos">
                            {activeIndex === 1 && <FornecedoresContato parceiroId={parceiroId} />}
                        </TabPanel>
                    </TabView>
                </>
            ) : (
                <ImageUpload agenciaId={parceiroId!} />
            )}
        </div>
    );
};

export default FornecedoresTipo;
