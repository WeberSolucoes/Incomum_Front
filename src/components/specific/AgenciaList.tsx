import React, { useEffect, useState } from 'react';
import { AgenciaListResponse } from '../../utils/apiObjects';
import GenericTable from '../common/GenericTable';
import { apiGetAgencia } from '../../services/Api';
import { toastError } from '../../utils/customToast';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { useCodigo } from '../../contexts/CodigoProvider'; // Importa o contexto
import AgenciaCadastro from './AgenciaCadastro'; // Importa o componente de cadastro
import { TabPanel, TabView } from 'primereact/tabview';
import Agente from './Agente';
import ImageUpload from './logo';


const AgenciaList: React.FC = () => {
    const [items, setItems] = useState<AgenciaListResponse[]>([]);
    const [originalItems, setOriginalItems] = useState<AgenciaListResponse[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [view, setView] = useState<'list' | 'create'>('list');
    const [loading, setLoading] = useState(false); // Estado de carregamento
    const [activeIndex, setActiveIndex] = useState(0); // Estado para controlar a aba ativa

    const { codigo, setCodigo } = useCodigo(); // Pega o estado e a função setCodigo de useCodigo
    const [agenciaCadastrada, setAgenciaCadastrada] = useState(false); // Estado para verificar se a agência foi cadastrada


    const getTitle = () => {
        switch (activeIndex) {
            case 0:
                return 'Cadastro Agência';
            case 1:
                return 'Cadastro Agente';
            case 2:
                return 'Logo Agência';
            default:
                return 'Cadastro Agência';
        }
    };

    const handleSearch = async () => {
        if (searchTerm.length < 3) {
            toastError('Por favor, insira pelo menos 3 caracteres para realizar a pesquisa.');
            return; // Não realiza a pesquisa se a condição não for atendida
        }

        setLoading(true); // Ativa o estado de carregamento

        try {
            const response = await apiGetAgencia();
            const mappedData: AgenciaListResponse[] = response.data.map((item: any) => ({
                codigo: item.age_codigo,
                descricao: item.age_descricao,
                responsavel: item.age_responsavel,
                email: item.age_email,
            }));
            setOriginalItems(mappedData); // Armazena os dados originais
            
            const searchTermLower = searchTerm.toLowerCase();
            const filteredItems = mappedData.filter(item =>
                item.descricao.toLowerCase().includes(searchTermLower) ||
                item.codigo.toString().toLowerCase().includes(searchTermLower) ||
                (item.responsavel && item.responsavel.toLowerCase().includes(searchTermLower)) ||
                (item.email && item.email.toLowerCase().includes(searchTermLower))
            );
            setItems(filteredItems);
        } catch (error) {
            toastError('Erro ao buscar as agências');
        } finally {
            setLoading(false); // Desativa o estado de carregamento
        }
    };

    const handleCodeClick = (codigo: number) => {
        setCodigo(codigo);  // Atualiza o ID da agência com setCodigo
        setAgenciaCadastrada(true); // Marca a agência como cadastrada
        setView('create');
        setActiveIndex(0);
    };


    const handleCreateClick = () => {
        setCodigo(null);  // Limpa o ID da agência no estado
        setAgenciaCadastrada(false); // Reseta o estado de agência cadastrada
        setView('create');
        setActiveIndex(0);
    };

    const handleImageUploadClick = () => {
        setView('uploadImage');
    };


    const handleBackClick = () => {
        setView('list'); // Volta para a visualização da lista
        window.scrollTo({
            top: 0,  // Define a posição do topo da página
            behavior: 'smooth' // Adiciona um efeito suave na rolagem
        });
    };
    
    const handleTabChange = (e: any) => {
        // Permite mudar de aba apenas se uma agência estiver cadastrada
        if (e.index > 0 && !agenciaCadastrada) {
            toastError('Você precisa cadastrar uma agência primeiro!');
            return;
        }
        setActiveIndex(e.index);
    };

    return (
        <div>
            {view === 'list' ? ( // Verifica qual view deve ser renderizada
                <>
                    <h1 style={{color:'#0152a1'}}>Consulta de Agências</h1>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                        <InputText
                            style={{ width: '300px' }}
                            placeholder="Buscar"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)} // Atualiza o termo de busca
                        />
                       <Button
                            label={loading ? 'Carregando...' : 'Consultar'} // Muda o texto durante o carregamento
                            icon={loading ? 'pi pi-spin pi-spinner' : 'pi pi-search'} // Ícone de carregamento ou de busca
                            style={{ marginLeft: '10px', backgroundColor: '#0152a1' }}
                            onClick={handleSearch} // Chama a pesquisa ao clicar no botão
                            disabled={loading} // Desabilita o botão enquanto está carregando
                        />
                        <Button
                            label="Criar"
                            icon="pi pi-plus"
                            style={{ marginLeft: 'auto', backgroundColor: '#0152a1' }}
                            onClick={handleCreateClick} // Chama a função de criação ao clicar no botão
                        />
                    </div>
                    <GenericTable 
                        filteredItems={items} 
                        emptyMessage="Nenhuma agência encontrada" 
                        onCodeClick={handleCodeClick} // Passa a função para o GenericTable
                    />
                </>
                ) : view === 'create' ? (
                <>
                    <h1 style={{ color: '#0152a1' }}>{getTitle()}</h1>
                    <TabView activeIndex={activeIndex} onTabChange={handleTabChange}>
                        <TabPanel header="Dados Gerais">
                            <AgenciaCadastro 
                                agenciaId={codigo} 
                                onBackClick={handleBackClick} 
                                onImageUploadClick={handleImageUploadClick}
                                onAgencyRegistered={() => setAgenciaCadastrada(true)} // Callback para marcar como cadastrada
                            />
                        </TabPanel>
                        <TabPanel header="Agente">
                            {activeIndex === 1 && <Agente />}
                        </TabPanel>
                        <TabPanel header="Logo Agência">
                            <ImageUpload agenciaId={codigo} />
                        </TabPanel>
                    </TabView>
                </>
            ) : (
                <ImageUpload agenciaId={codigo!} />
            )}
        </div>
    );
};

export default AgenciaList;
