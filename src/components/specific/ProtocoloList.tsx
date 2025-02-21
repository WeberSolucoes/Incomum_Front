import React, { useState } from 'react';
import { UnidadesListResponse } from '../../utils/apiObjects';
import GenericTable from '../common/GenericTable';
import { apiGetPais, apiGetProtocolo, apiGetUnidades } from '../../services/Api';
import { toastError } from '../../utils/customToast';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { useCodigo } from '../../contexts/CodigoProvider'; // Importa o contexto
import Pais from './Pais'; // Importa o componente de cadastro
import Protocolo from './Protocolo';
import { TabPanel, TabView } from 'primereact/tabview';

const ProtocoloList: React.FC = () => {
    const [items, setItems] = useState<UnidadesListResponse[]>([]);
    const [originalItems, setOriginalItems] = useState<UnidadesListResponse[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [view, setView] = useState<'list' | 'create'>('list'); // Estado para controlar a visualização atual
    const [loading, setLoading] = useState(false); // Estado de carregamento
    const [activeIndex, setActiveIndex] = useState(0);

    const { codigo,setCodigo } = useCodigo(); // Acesso ao contexto

    const handleSearch = async () => {
        if (searchTerm.length < 3) {
            toastError('Por favor, insira pelo menos 3 caracteres para realizar a pesquisa.');
            return; // Evita realizar a pesquisa se o termo de busca não atender à condição
        }


        try {
            const response = await apiGetProtocolo();
            console.log("Resposta da API:", response.data); // Verifica o conteúdo de response.data
        
            if (!Array.isArray(response.data)) {
                console.error("A resposta da API não é um array:", response.data);
                toastError("Formato inesperado da resposta da API");
                return;
            }
        
            const mappedData: UnidadesListResponse[] = response.data.map((item: any) => ({
                codigo: item.prt_codigo,
                descricao: item.prt_numerodocumento,
            }));
        
            console.log("Dados mapeados:", mappedData); // Verifica se os dados estão corretamente formatados
            setOriginalItems(mappedData);
            setItems(mappedData);
        } catch (error) {
            console.error("Erro ao buscar Protocolo:", error);
            toastError("Erro ao buscar Protocolo");
    }}
        
        

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

    const getTitle = () => {
        switch (activeIndex) {
            case 0:
                return 'Visualizar Protocolo';
            case 1:
                return 'Visualizar Protocolo 2';
            case 2:
                return 'Visualizar Protocolo 3';
            default:
                return 'Visualizar Protocolo';
        }
    };

    const paisDescricao = codigo ? items.find(item => item.codigo === codigo)?.descricao : '';

    return (
        <div>
            {view === 'list' ? (
                <>
                    <h1 style={{color:'#0152a1'}}>Consulta de Protocolo</h1>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                        <InputText
                            style={{ width: '300px' }}
                            placeholder="Buscar"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Button
                            label={loading ? 'Carregando...' : 'Consultar'}
                            icon={loading ? 'pi pi-spin pi-spinner' : 'pi pi-search'} // Ícone de carregamento ou de busca
                            style={{ marginLeft: '10px', backgroundColor: '#0152a1', height: '34px', borderRadius: '10px' }}
                            onClick={handleSearch}
                            disabled={loading} // Desabilita o botão durante o carregamento
                        />
                    </div>
                    <GenericTable 
                        filteredItems={items} 
                        emptyMessage="Nenhum Protocolo encontrado" 
                        onCodeClick={handleCodeClick} 
                    />
                </>
            ) : view === 'create' ? (
                <>
                    <h1 style={{ color: '#0152a1' }}>{getTitle()}</h1>
                    <TabView style={{ textAlign: 'left' }} activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
                        <TabPanel style={{textAlign:'left'}} header="Dados Gerais">
                            <Protocolo  
                                onBackClick={handleBackClick} 
                            />
                        </TabPanel>
                        <TabPanel style={{ textAlign: 'left' }} header="Dados Origem">
                            {activeIndex === 1 && <Protocolo />}
                        </TabPanel>
                        <TabPanel style={{ textAlign: 'left' }} header="Area Comercial">
                            <Protocolo />
                        </TabPanel>
                    </TabView>
                </>
            ) : (
                <Protocolo/>
            )}
        </div>
    );
};

export default ProtocoloList;
