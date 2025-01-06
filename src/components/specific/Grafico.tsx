import React, { useState, useEffect } from "react";
import { TabView, TabPanel } from "primereact/tabview";
import { MultiSelect } from "primereact/multiselect"; 
import { Dropdown } from "primereact/dropdown"; 
import { Calendar } from "primereact/calendar"; 
import { Button } from "primereact/button"; 
import { Chart } from "primereact/chart"; 
import axios from "axios";
import { toastError } from "../../utils/customToast";
import { apiGetAgencia,apiGetUnidades,apiGetGraficoUnidade,apiGetGraficoAgencia,apiGetArea,apiGetAreas } from '../../services/Api';
import ChartDataLabels from 'chartjs-plugin-datalabels';


const GraficoComFiltros = () => {
    const [dateStart, setDateStart] = useState(null);
    const [dateEnd, setDateEnd] = useState(null);
    const [unidades, setUnidades] = useState([]);
    const [areas, setAreas] = useState([]);
    const [agencias, setAgencias] = useState([]);
    const [chartData, setChartData] = useState(null);
    const [selectedUnidade, setSelectedUnidade] = useState([]);
    const [selectedAgencias, setSelectedAgencias] = useState([]);
    const [activeTab, setActiveTab] = useState(0); // Controle da aba ativa
    const [filteredAgencias, setFilteredAgencias] = useState([]);
    const [areasComerciais, setAreasComerciais] = useState([]);
    const [vendedores, setVendedores] = useState([]);
    const [loading, setLoading] = useState(false);
    const [chartType, setChartType] = useState("pie"); // Defina o tipo de gráfico inicial como "pie"
    const [showLabels, setShowLabels] = useState(true); // Controle para mostrar ou remover valores
    const isMobile = window.innerWidth <= 768;
    const [selectedAreaComercial, setSelectedAreaComercial] = useState([]);
    const [selectedVendedor, setSelectedVendedor] = useState(null);
    const [selectedAgencia, setSelectedAgencia] = useState(null);
    const [numAgencias, setNumAgencias] = useState(5); // Estado para armazenar o número de agências selecionado



    useEffect(() => {
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1); // Primeiro dia do mês atual
        const endOfDay = today; // Data final será o dia de hoje

        setDateStart(startOfMonth);
        setDateEnd(endOfDay);
    }, []); 


    useEffect(() => {
        setSelectedUnidade(null);
        const fetchUnidades = async () => {
            try {
                const response = await apiGetUnidades();
                const unidadesFormatadas = response.data.map((unidade) => ({
                    label: unidade.loj_descricao,
                    value: unidade.loj_codigo,
                }));
                setUnidades(unidadesFormatadas);
            } catch (error) {
                console.error("Erro ao carregar unidades:", error);
            }
        };

        const fetchAgencias = async () => {
            try {
                const response = await apiGetAgencia();
                const agenciasFormatadas = response.data.map((agencia: { age_descricao: string; age_codigo: any; }) => ({
                    label: agencia.age_descricao.toUpperCase(),
                    value: agencia.age_codigo,
                }));
                setAgencias(agenciasFormatadas);
            } catch (error) {
                console.error("Erro ao carregar agências:", error);
            }
        };

        fetchUnidades();
        fetchAgencias();
    }, []);

    const loadDadosIniciais = async () => {
        setLoading(true);
        try {
            // Carrega as unidades
            const unidadesResponse = await apiGetUnidadeRelatorioByUser();
            setUnidades(unidadesResponse.data.map(item => ({ label: item.loj_descricao, value: item.loj_codigo })));
        } catch (error) {
            toastError('Erro ao carregar as unidades');
        }
    
        try {
            // Carrega as agências
            const agenciasResponse = await axios.get('https://api.incoback.com.br/api/incomum/relatorio/agencia-by-user/');
            setAgencias(agenciasResponse.data.valores.map(item => ({ label: item.age_descricao, value: item.age_codigo })));
        } catch (error) {
            toastError('Erro ao carregar as agências');
        }
    
        try {
            // Carrega as áreas comerciais
            const areasResponse = await axios.get('https://api.incoback.com.br/api/incomum/relatorio/list-all-areas/');
            setAreasComerciais(areasResponse.data.associacoes.map(item => ({ label: item.aco_descricao, value: item.aco_codigo })));
        } catch (error) {
            toastError('Erro ao carregar as áreas comerciais');
        } finally {
            setLoading(false);
        }
    };
    
    const handleUnidadeChange = async (e) => {
        const unidadeId = e ? e.value : null; // Verifica se há unidade selecionada, caso contrário, null
        setSelectedUnidade(unidadeId);
        setSelectedAreaComercial([]); // Limpa as áreas comerciais ao trocar a unidade
        setAgencias([]); // Limpa as agências ao trocar a unidade
    
        const token = localStorage.getItem('token'); // Obtém o token de autenticação
        console.log("unidadeId", unidadeId);  // Verifique o valor de unidadeId
        console.log("token", token);  // Verifique o valor do token
    
        try {
            let areasResponse;
    
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`, // Adiciona o token de autenticação nos headers
                },
            };
    
            // Verifique se unidadeId foi fornecido e use a URL apropriada
            if (unidadeId) {
                // Caso tenha unidadeId, envia na URL
                areasResponse = await axios.get(`https://api.incoback.com.br/api/incomum/relatorio/list-all-areas/${unidadeId}/`, config);
            } else {
                // Caso contrário, busque todas as áreas comerciais
                areasResponse = await axios.get('https://api.incoback.com.br/api/incomum/relatorio/list-all-area/', config);
            }
    
            // Verifique a resposta da API
            console.log("Resposta da API:", areasResponse.data);
    
            // Verifica se há dados retornados na resposta
            if (areasResponse.data.associacoes && areasResponse.data.associacoes.length > 0) {
                // Popula as áreas comerciais com os dados recebidos
                setAreasComerciais(areasResponse.data.associacoes.map(item => ({
                    label: item.aco_descricao,
                    value: item.aco_codigo
                })));
            } else {
                // Caso não haja áreas comerciais, exibe uma mensagem
                setAreasComerciais([]);
                toastError('Nenhuma área comercial encontrada.');
            }
        } catch (error) {
            // Captura e exibe o erro
            toastError('Erro ao carregar as áreas comerciais.');
            console.error('Erro ao fazer a requisição:', error.response || error.message || error);
        }
    };


    const fetchAgencias = async (selectedAreaComercial = [], unidadeId = null) => {
        console.log('Áreas Comerciais Selecionadas:', selectedAreaComercial);
        console.log('Unidade Selecionada:', unidadeId);
    
        const token = localStorage.getItem('token'); // Obtém o token do localStorage
    
        try {
            let response;
    
            // Configuração do cabeçalho com o token
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`, // Adiciona o token de autenticação
                },
                params: {
                    area_comercial: selectedAreaComercial.length > 0 ? selectedAreaComercial : undefined,
                    unidade: unidadeId || undefined,
                },
            };
    
            // Se nenhum filtro (área comercial ou unidade) for selecionado, busca todas as agências
            if (selectedAreaComercial.length === 0 && !unidadeId) {
                response = await axios.get('https://api.incoback.com.br/api/incomum/relatorio/agencia-by-user/', config);
            } else {
                // Faz a requisição com os filtros (área comercial e/ou unidade)
                response = await axios.get('https://api.incoback.com.br/api/incomum/relatorio/agencia-by-user/', config);
            }
    
            // Mapeia os resultados para o Dropdown
            if (response.data.valores.length > 0) {
                setAgencias(response.data.valores.map(item => ({
                    label: item.age_descricao,
                    value: item.age_codigo,
                })));
            } else {
                setAgencias([]); // Caso não haja resultados
                toastError('Nenhuma agência encontrada.');
            }
        } catch (error) {
            toastError('Erro ao carregar as agências');
            console.error('Erro ao fazer a requisição:', error); // Log do erro para diagnosticar
        }
    };

    

    const handleAreaChange = (e) => {
        setSelectedAreaComercial(e.value); // Atualiza o estado com as áreas selecionadas
        fetchAgencias(e.value); // Chama a função para buscar as agências com as áreas selecionadas
    };

    const handleFilter = (event) => {
        const query = event.filter.trim().toUpperCase(); // Converte para maiúsculas
        console.log("Filtro digitado (em maiúsculas):", query);
    
        if (query.length >= 3) {
            const results = agencias.filter((agencia) =>
                agencia.label.toUpperCase().includes(query)
            );
            console.log("Resultados filtrados:", results);
            setFilteredAgencias(results);
        } else {
            setFilteredAgencias([]);
        }
    };


    const detectChartTypeAndLabels = () => {
        if (window.innerWidth <= 768) {
            setChartType("pie"); // Para dispositivos móveis, usar gráfico de pizza
            setShowLabels(false); // Remover valores do gráfico em dispositivos móveis
        } else {
            setChartType("bar"); // Para desktops, usar gráfico de barras
            setShowLabels(true); // Mostrar valores no gráfico em desktops
        }
    };

    useEffect(() => {
        // Detecta tipo de gráfico e exibição de valores ao carregar a página
        detectChartTypeAndLabels();
        
        // Adiciona um ouvinte para redimensionamento da janela
        window.addEventListener("resize", detectChartTypeAndLabels);
        
        // Limpa o ouvinte ao desmontar o componente
        return () => window.removeEventListener("resize", detectChartTypeAndLabels);
    }, []);
    

    const handleConsultar = async (e) => {
        e.preventDefault();
    
        const params = {
            date_start: dateStart ? dateStart.toISOString().split("T")[0] : null,
            date_end: dateEnd ? dateEnd.toISOString().split("T")[0] : null,
            num_agencias: numAgencias, // Envia o número de agências selecionadas pelo usuário
        };
    
        let endpoint = "";
        if (activeTab === 0) {
            endpoint = "http://127.0.0.1:8000/api/incomum/relatorio/obter-dados-unidade/";
            if (selectedUnidade !== "todos") {
                params.loj_codigo = selectedUnidade;
            }
        } else if (activeTab === 1) {
            endpoint = "http://127.0.0.1:8000/api/incomum/relatorio/obter-dados-agencia/";
            if (selectedAgencias.length > 0 && !selectedAgencias.includes("todos")) {
                params.age_codigo = selectedAgencias;
            }
        }
    
        try {
            const response = await axios.get(endpoint, { params });
    
            console.log("Resposta da API:", response.data);
    
            if (Array.isArray(response.data.data) && Array.isArray(response.data.labels)) {
                const labels = response.data.labels.slice(0, numAgencias); // Limita as labels para o número selecionado
                const data = response.data.data.map(item => item.toFixed(2)).slice(0, numAgencias); // Limita os dados para o número selecionado
    
                setChartData(formatChartData(data, labels));
            } else {
                console.error("Formato inesperado na resposta da API:", response.data);
            }
        } catch (error) {
            console.error("Erro ao buscar dados do gráfico:", error);
        }
    };
    
    

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
            },
            datalabels: {
                display: !isMobile,
                anchor: 'end', // Posição do rótulo
                align: 'start',
                color: '#FFFFFF',
                offset: 5,
                font: {
                    weight: 'bold',
                    size: 10,
                },
                formatter: function (value) {
                    return parseFloat(value).toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    });
                },
            },
        },
    };

    const handleTabChange = (e) => {
        setChartData(null); // Limpar dados ao mudar de aba
        setActiveTab(e.index);
    };

    const formatChartData = (data, labels) => {
        const isMobile = window.innerWidth <= 768; // Verifica se é um dispositivo móvel
        const limit = isMobile ? 5 : 10; // Exibe 5 categorias no celular, 10 no desktop
    
        return {
            labels: labels.slice(0, limit), // Pega apenas as primeiras 5 ou 10 labels
            datasets: [
                {
                    label: "Faturamento",
                    data: data.slice(0, limit), // Pega apenas os primeiros 5 ou 10 valores
                    backgroundColor: ["#0152a1", "#28a745", "#e87717", "#A11402", "#6f42c1"], // Ajuste as cores
                    borderWidth: 2,
                    borderColor: "#fff", // Cor da borda
                },
            ],
        };
    };

    const isUnidadeTab = activeTab === 0; // Verifica se a aba atual é "Unidades"
    const topLimit = isUnidadeTab ? 3 : 5; // Mostra 3 itens para "Unidades" e 5 para "Agências"

    // Criar a lista com os valores totais
    const renderValueList = () => {
        return (
            <div className="value-list">
                <h4>Top {numAgencias} Agências:</h4>
                <ul style={{ marginLeft: '20px' }}>
                    {chartData?.labels.slice(0, numAgencias).map((label, index) => (
                        <li key={index}>
                            <strong>{label}:</strong> R${" "}
                            {parseFloat(chartData?.datasets[0].data[index]).toLocaleString("pt-BR", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            })}
                        </li>
                    ))}
                </ul>
            </div>
        );
    };


    return (
        <div className="GraficoDiv"
            style={{
                backgroundColor: "white",
                borderRadius: "10px",
                marginTop: "20px",
                padding: "20px",
                width: "1100px",
                marginLeft: "320px",
                marginRight: "auto",
                boxShadow: "10px 10px 100px rgba(0, 0, 0, 0.4), -2px -2px 6px rgba(255, 255, 255, 0.6)",
            }}
        >
            <TabView activeIndex={activeTab} onTabChange={handleTabChange}>
                <TabPanel header="Unidades">
                    <form
                        style={{
                            backgroundColor: "#f9f9f9",
                            width: "100%",
                            margin: "auto",
                            padding: "20px",
                            border: "1px solid #ddd",
                            borderRadius: "5px",
                        }}
                        onSubmit={handleConsultar}
                    >
                        <h1 style={{ color: "#0152a1", textAlign: "left" }}>Consulta por Unidade</h1>
                        <div className="row mt-3">
                            <div className="col-sm-6 mb-3">
                                <Calendar
                                    value={dateStart}
                                    onChange={(e) => setDateStart(e.value)}
                                    showIcon
                                    placeholder="Data Inicial"
                                    locale="pt-BR"
                                    dateFormat="dd/mm/yy"
                                    className="startcalendar"
                                />
                            </div>
                            <div className="col-sm-6 mb-3">
                                <Calendar
                                    value={dateEnd}
                                    onChange={(e) => setDateEnd(e.value)}
                                    showIcon
                                    placeholder="Data Final"
                                    locale="pt-BR"
                                    dateFormat="dd/mm/yy"
                                    style={{marginLeft:'-260px'}}
                                    className="GraficoDiv"
                                />
                            </div>
                        </div>
                        <div className="row mt-3">
                            <div className="col-12 d-flex justify-content-end">
                                <Button 
                                    style={{marginRight:'8px',backgroundColor:'#1d6f42',border:'none',borderRadius:'10px'}}
                                    icon="pi pi-file-excel" 
                                    className="custom-button" // Estilos adicionais, se necessário
                                />

                                <Button
                                    style={{ backgroundColor: "#0152a1",borderRadius:'10px' }}
                                    type="submit"
                                    label="Consultar"
                                    icon="pi pi-search"
                                />
                            </div>
                        </div>
                    </form>
                </TabPanel>

                <TabPanel header="Agências">
                    <form
                        style={{
                            backgroundColor: "#f9f9f9",
                            width: "100%",
                            margin: "auto",
                            padding: "20px",
                            border: "1px solid #ddd",
                            borderRadius: "5px",
                        }}
                        onSubmit={handleConsultar}
                    >
                        <h1 style={{ color: "#0152a1", textAlign: "left" }}>Consulta por Agência</h1>
                        <div className="row mt-3">
                            <div className="col-sm-6 mb-3">
                                <Calendar
                                    value={dateStart}
                                    onChange={(e) => setDateStart(e.value)}
                                    showIcon
                                    placeholder="Data Inicial"
                                    locale="pt-BR"
                                    dateFormat="dd/mm/yy"
                                    className="startcalendar"
                                />
                            </div>
                            <div className="col-sm-6 mb-3">
                                <Calendar
                                    value={dateEnd}
                                    onChange={(e) => setDateEnd(e.value)}
                                    showIcon
                                    placeholder="Data Final"
                                    locale="pt-BR"
                                    dateFormat="dd/mm/yy"
                                    style={{marginLeft:'-260px'}}
                                    className="GraficoDiv"
                                />
                            </div>
                        </div>
                        <div className='row mt-3'>
                            <div className='col-sm-3 mb-3'>
                                <Dropdown
                                    value={selectedUnidade} 
                                    options={unidades}
                                    onChange={handleUnidadeChange}  
                                    placeholder="Unidade"
                                    style={{width:'100%',textAlign: 'left' }}
                                    panelStyle={{ width: '10%',textAlign: 'left' }} // Largura do painel
                                    showClear={selectedUnidade !== null}
                                />
                            </div>
                            <div className='col-sm-3 mb-3'>
                                <MultiSelect
                                    value={selectedAreaComercial} 
                                    options={areasComerciais} 
                                    onChange={handleAreaChange}  
                                    placeholder="Área Comercial" 
                                    display="chip" 
                                    style={{width:'100%'}}
                                    panelStyle={{ width: '100%' }} // Largura do painel
                                    showClear 
                                />
                            </div>
                            <div className='col-sm-3 mb-3'>
                                <MultiSelect
                                    value={selectedAgencias}
                                    options={filteredAgencias} // Usando opções filtradas
                                    onChange={(e) => setSelectedAgencias(e.value || [])}
                                    placeholder="Selecione uma ou mais Agências"
                                    display="chip"
                                    filter
                                    filterBy="label" // Filtra com base na descrição (label)
                                    onFilter={handleFilter} // Evento personalizado de filtro
                                    showClear
                                    optionLabel="label"
                                    style={{width:'253px'}}
                                />
                            </div>
                            <div className='col-sm-3 mb-3' style={{marginTop:'-30px'}}>
                                <label>Quantidade de Agências:</label>
                                <input
                                    type="number"
                                    value={numAgencias}
                                    onChange={handleNumAgenciasChange}
                                    min="1" // Limita o mínimo para 1
                                    max="10" // Limita o máximo para 10, você pode ajustar conforme necessário
                                    
                                />
                            </div>
                        </div>
                        <div className="row mt-3">
                            <div className="col-12 d-flex justify-content-end">
                                <Button 
                                    style={{marginRight:'8px',backgroundColor:'#1d6f42',border:'none',borderRadius:'10px'}}
                                    icon="pi pi-file-excel" 
                                    className="custom-button" // Estilos adicionais, se necessário
                                />

                                <Button
                                    style={{ backgroundColor: "#0152a1",borderRadius:'10px' }}
                                    type="submit"
                                    label="Consultar"
                                    icon="pi pi-search"
                                />
                            </div>
                        </div>
                    </form>
                </TabPanel>
            </TabView>

            {chartData && (
                <div className="mt-5">
                    <div className="chart-container">
                        <Chart type={isMobile ? "pie" : "bar"} data={chartData} options={options} plugins={[ChartDataLabels]} />
                    </div>
                    {/* Renderiza a lista apenas no celular */}
                    {isMobile && renderValueList()}
                </div>
            )}
        </div>
    );
};

export default GraficoComFiltros;
