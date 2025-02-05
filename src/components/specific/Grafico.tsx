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
import { toast } from "react-toastify";
import { Card, CardHeader, Typography, Box, LinearProgress } from '@mui/material';


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
    const [numAgencias, setNumAgencias] = useState(5);
    const [quantidade, setQuantidade] = useState(5);  // Valor padrão para 5 áreas


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


    const fetchAreas = async () => {
        const token = localStorage.getItem('token'); // Obtém o token do localStorage
    
        try {
            // Configuração do cabeçalho com o token
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`, // Adiciona o token de autenticação
                },
            };
    
            const response = await axios.get("https://api.incoback.com.br/api/incomum/areacomercial/list-all/", config);
            
            const agenciasFormatadas = response.data.map((agencia) => ({
                label: agencia.aco_descricao.toUpperCase(), // Texto mostrado no MultiSelect
                value: agencia.aco_codigo, // Valor associado
            }));
    
            console.log("Áreas Comerciais recebidas:", agenciasFormatadas);
            setAreasComerciais(agenciasFormatadas); // Atualiza o estado com os dados formatados
        } catch (error) {
            console.error("Erro ao carregar áreas comerciais:", error);
            toastError('Erro ao carregar áreas comerciais');
        }
    };
    
      // Chama a função fetchAreas quando o componente é montado
    useEffect(() => {
        fetchAreas();
    }, []);

    

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
        };
    
        let endpoint = "";
        if (activeTab === 0) {
            endpoint = "https://api.incoback.com.br/api/incomum/relatorio/obter-dados-unidade/";
            if (selectedUnidade !== "todos") {
                params.loj_codigo = selectedUnidade;
            }
        } else if (activeTab === 1) {
            endpoint = "https://api.incoback.com.br/api/incomum/relatorio/obter-dados-agencia/";
            if (selectedAgencias.length > 0 && !selectedAgencias.includes("todos")) {
                params.age_codigo = selectedAgencias;
            }
        }
    
        try {
            const response = await axios.get(endpoint, { params });
    
            // Verifique a resposta para garantir que temos as informações corretas
            console.log("Resposta da API:", response.data);
    
            if (Array.isArray(response.data.data) && Array.isArray(response.data.labels)) {
                const labels = response.data.labels;
                const data = response.data.data.map(item => item.toFixed(2)); // Formata os valores com 2 casas decimais
    
                // Formata os dados para exibir as 5 ou 10 melhores
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


    const handleConsultarAreaComercial = async (e) => {
        e.preventDefault();
        setLoading(true);
    
        console.log("Estado atual das áreas selecionadas:", selectedAreaComercial); // Adicionado para debug
    
        // Verifique se as datas estão definidas
        if (!dateStart || !dateEnd) {
            toast.error("Por favor, selecione as datas.");
            setLoading(false);
            return;
        }
    
        // Formatar as datas no formato adequado (YYYY-MM-DD)
        const formattedStartDate = dateStart.toISOString().split("T")[0];
        const formattedEndDate = dateEnd.toISOString().split("T")[0];
    
        // Construir filtros
        const filters = {
            startDate: formattedStartDate,
            endDate: formattedEndDate,
            areas: selectedAreaComercial, // Certifique-se de que está passando o estado correto
            quantidade: quantidade,  // Passando a quantidade de áreas comerciais
        };
    
        console.log("Filtros sendo enviados:", filters);
    
        try {
            const response = await axios.post(
                "https://api.incoback.com.br/api/incomum/relatorio/obter-dados-area-comercial/",
                filters
            );

            const formattedData = response.data.data.map((value) => parseFloat(value).toFixed(2));

            console.log(response.data);
            setChartData({
                labels: response.data.labels,
                datasets: [
                    {
                        label: "Valor",
                        data: formattedData,
                        backgroundColor: ["#0152a1", "#28a745", "#e87717", "#A11402", "#6f42c1"],
                        borderWidth: 1,
                    },
                ],
            });
        } catch (error) {
            toast.error("Erro ao buscar os dados do gráfico.");
        } finally {
            setLoading(false);
        }
    };
    

    const handleTabChange = (e) => {
        setChartData(null); // Limpar dados ao mudar de aba
        setActiveTab(e.index);
    };

    const formatChartData = (data, labels) => {
        const isUnidadeTab = activeTab === 0; // Aba "Unidades"
        const limit = Math.min(
            isUnidadeTab ? 3 : Number(numAgencias) || 1, // Top 3 para Unidades ou o valor selecionado para Agências
            labels.length
        );
    
        return {
            labels: labels.slice(0, limit), // Pega as primeiras 'limit' labels
            datasets: [
                {
                    label: isUnidadeTab ? "Faturamento Unidades" : "Faturamento Agências",
                    data: data.slice(0, limit), // Pega os primeiros 'limit' valores
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
    const limit = Math.min(numAgencias, chartData.labels.length); // Garante que não exceda os dados disponíveis
    let title = "";

    // Defina o título dinamicamente com base na aba ativa
    if (activeTab === 2) {
        title = `Top ${limit} Áreas Comerciais`;
    } else if (activeTab === 0) {
        title = `Top ${limit} Unidades`;
    } else if (activeTab === 1) {
        title = `Top ${limit} Agências`;
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Itera sobre os dados passados */}
            {chartData.labels.slice(0, limit).map((label, index) => {
                const value = parseFloat(chartData.datasets[0].data[index]);
                const maxValue = Math.max(...chartData.datasets[0].data); // Encontra o valor máximo para normalizar as barras

                return (
                    <Card key={index} sx={{ width: '100%', boxShadow: 3, borderRadius: 2 }}>
                        <CardHeader
                            title={
                                <Typography variant="h6" component="div" color="text.primary">
                                    {label} {/* Aqui exibe o nome de cada área comercial */}
                                </Typography>
                            }
                        />
                        <Box sx={{ padding: 2 }}>
                            {/* Valor Total */}
                            <Typography variant="body2" color="textSecondary" sx={{ marginBottom: 2 }}>
                                Valor Total: R${' '}
                                {value.toLocaleString('pt-BR', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                })}
                            </Typography>

                            {/* Gráfico Linear */}
                            <Box sx={{ width: '100%', marginBottom: 2 }}>
                                <LinearProgress
                                    variant="determinate"
                                    value={(value / maxValue) * 100} // Normaliza a largura da barra
                                    sx={{
                                        height: 10,
                                        borderRadius: 5,
                                        backgroundColor: '#e0e0e0',
                                        '& .MuiLinearProgress-bar': {
                                            backgroundColor: '#0152a1',
                                        },
                                    }}
                                />
                            </Box>
                        </Box>
                    </Card>
                );
            })}
        </Box>
    );
};


    const handleNumAgenciasChange = (e) => {
        const value = e.target.value;
    
        // Permite valores temporários como vazio ou intermediários
        if (value === "" || (Number(value) >= 1 && Number(value) <= 10)) {
            setNumAgencias(value); // Atualiza o estado com o valor atual
        }
    };


    const handleExportAgenciaExcel = async () => {
        try {
            console.log("Iniciando exportação..."); // Verificar se a função está sendo chamada

            const formattedStartDate = dateStart ? dateStart.toISOString().split("T")[0] : "";
            const formattedEndDate = dateEnd ? dateEnd.toISOString().split("T")[0] : "";
    
            const response = await axios.get(
                "https://api.incoback.com.br/api/incomum/relatorio/exportar-dados-agencia-excel/",
                {
                    params: {
                        date_start: formattedStartDate,  // Agora no formato YYYY-MM-DD
                        date_end: formattedEndDate,  
                        "age_codigo[]": selectedAgencias.map(a => a.value),  // Enviar como array
                        num_agencias: numAgencias, // Usando o estado correto
                    },
                    responseType: "blob", // Necessário para arquivos
                }
            );
    
            console.log("Resposta recebida:", response); // Debug da resposta
    
            // Criar um link para download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `Relatorio_Agencia.xlsx`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Erro ao exportar Excel:", error);
        }
    };


    const handleExportUnidadeExcel = async () => {
        try {
            console.log("Iniciando exportação..."); // Verificar se a função está sendo chamada

            const formattedStartDate = dateStart ? dateStart.toISOString().split("T")[0] : "";
            const formattedEndDate = dateEnd ? dateEnd.toISOString().split("T")[0] : "";
    
            const response = await axios.get(
                "https://api.incoback.com.br/api/incomum/relatorio/exportar-dados-unidade-excel/",
                {
                    params: {
                        date_start: formattedStartDate,  // Agora no formato YYYY-MM-DD
                        date_end: formattedEndDate,  
                    },
                    responseType: "blob", // Necessário para arquivos
                }
            );
    
            console.log("Resposta recebida:", response); // Debug da resposta
    
            // Criar um link para download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `Relatorio_Unidades.xlsx`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Erro ao exportar Excel:", error);
        }
    };
    
    const handleExportComercialExcel = async () => {
        try {
            console.log("Iniciando exportação..."); // Verificar se a função está sendo chamada

            const formattedStartDate = dateStart ? dateStart.toISOString().split("T")[0] : "";
            const formattedEndDate = dateEnd ? dateEnd.toISOString().split("T")[0] : "";
    
            const response = await axios.get(
                "https://api.incoback.com.br/api/incomum/relatorio/exportar-dados-comercial-excel/",
                {
                    params: {
                        date_start: formattedStartDate,  // Agora no formato YYYY-MM-DD
                        date_end: formattedEndDate,
                        areas: selectedAreaComercial,
                        quantidade: quantidade, // Usando o estado correto
                    },
                    responseType: "blob", // Necessário para arquivos
                }
            );
    
            console.log("Resposta recebida:", response); // Debug da resposta
    
            // Criar um link para download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `Relatorio_Comercial.xlsx`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Erro ao exportar Excel:", error);
        }
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
                            <div className="col-sm-3 mb-3">
                                <div className="form-group">
                                    <label htmlFor="cid_codigo">Data Incial</label>
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
                            </div>
                            <div className="col-sm-3 mb-3">
                                <div className="form-group">
                                    <label htmlFor="cid_codigo">Data Final</label>
                                    <Calendar
                                        value={dateEnd}
                                        onChange={(e) => setDateEnd(e.value)}
                                        showIcon
                                        placeholder="Data Final"
                                        locale="pt-BR"
                                        dateFormat="dd/mm/yy"
                                        className="GraficoDiv"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="row mt-3">
                            <div className="col-12 d-flex justify-content-end">
                                <Button 
                                    style={{marginRight:'8px',backgroundColor:'#1d6f42',border:'none',borderRadius:'10px'}}
                                    icon="pi pi-file-excel" 
                                    className="custom-button" // Estilos adicionais, se necessário
                                    onClick={handleExportUnidadeExcel}
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
                            <div className="col-sm-3 mb-3">
                                <div className="form-group">
                                    <label htmlFor="cid_codigo">Data Incial</label>
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
                            </div>
                            <div className="col-sm-3 mb-3">
                                <div className="form-group">
                                    <label htmlFor="cid_codigo">Data Final</label>
                                    <Calendar
                                        value={dateEnd}
                                        onChange={(e) => setDateEnd(e.value)}
                                        showIcon
                                        placeholder="Data Final"
                                        locale="pt-BR"
                                        dateFormat="dd/mm/yy"
                                        className="GraficoDiv"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className='row mt-3'>
                            <div className='col-sm-3 mb-3'>
                                <div className="form-group">
                                    <label htmlFor="cid_codigo">Unidade</label>
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
                            </div>
                            <div className='col-sm-3 mb-3'>
                                <div className="form-group">
                                    <label htmlFor="cid_codigo">Área Comercial</label>
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
                            </div>
                            <div className='col-sm-3 mb-3'>
                                <div className="form-group">
                                    <label htmlFor="cid_codigo">Agência</label>
                                    <MultiSelect
                                        value={selectedAgencias}
                                        options={filteredAgencias} // Usando opções filtradas
                                        onChange={(e) => setSelectedAgencias(e.value || [])}
                                        placeholder="Agência"
                                        display="chip"
                                        filter
                                        filterBy="label" // Filtra com base na descrição (label)
                                        onFilter={handleFilter} // Evento personalizado de filtro
                                        showClear
                                        optionLabel="label"
                                        style={{width:'253px'}}
                                    />
                                </div>
                            </div>
                            <div className="col-sm-3 mb-3 mobile-adjust">
                                <div className="form-group">
                                    <label htmlFor="cid_codigo">Quantidade:</label>
                                    <input
                                        type="number"
                                        value={numAgencias}
                                        onChange={handleNumAgenciasChange}
                                        min="1"
                                        max="10"
                                        style={{width:'100px',height:'34px'}}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="row mt-3">
                            <div className="col-12 d-flex justify-content-end">
                                <Button 
                                    style={{marginRight:'8px',backgroundColor:'#1d6f42',border:'none',borderRadius:'10px'}}
                                    icon="pi pi-file-excel" 
                                    className="custom-button" // Estilos adicionais, se necessário
                                    onClick={handleExportAgenciaExcel}
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
                <TabPanel header="Área Comercial">
                    <form
                        style={{
                            backgroundColor: "#f9f9f9",
                            width: "100%",
                            margin: "auto",
                            padding: "20px",
                            border: "1px solid #ddd",
                            borderRadius: "5px",
                        }}
                        onSubmit={handleConsultarAreaComercial}
                    >
                        <h1 style={{ color: "#0152a1", textAlign: "left" }}>Consulta por Área Comercial</h1>
                        <div className="row mt-3">
                            <div className="col-sm-3 mb-3">
                                <div className="form-group">
                                    <label htmlFor="cid_codigo">Data Incial</label>
                                    <Calendar
                                        value={dateStart}
                                        onChange={(e) => setDateStart(e.value)}
                                        showIcon
                                        placeholder="Data Inicial"
                                        locale="pt-BR"
                                        dateFormat="dd/mm/yy"
                                    />
                                </div>
                            </div>
                            <div className="col-sm-3 mb-3">
                                <div className="form-group">
                                    <label htmlFor="cid_codigo">Data Final</label>
                                    <Calendar
                                        value={dateEnd}
                                        onChange={(e) => setDateEnd(e.value)}
                                        showIcon
                                        placeholder="Data Final"
                                        locale="pt-BR"
                                        dateFormat="dd/mm/yy"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="row mt-3">
                            <div className="col-sm-3 mb-3">
                                <div className="form-group">
                                    <label htmlFor="cid_codigo">Área Comercial</label>
                                    <MultiSelect
                                        value={selectedAreaComercial}
                                        options={areasComerciais}
                                        onChange={(e) => {
                                            if (e.value) {
                                                const areasSelecionadas = e.value.map((area) => area.value || area);
                                                console.log("Áreas selecionadas:", areasSelecionadas);
                                                setSelectedAreaComercial(areasSelecionadas);
                                            } else {
                                                console.warn("Nenhuma área selecionada.");
                                                setSelectedAreaComercial([]);
                                            }
                                        }}
                                        placeholder="Selecione Áreas Comerciais"
                                        display="chip"
                                        showClear
                                        style={{ width: "100%" }}
                                    />
                                </div>
                            </div>
                            <div className="col-sm-3 mb-3">
                                <div className="form-group">
                                    <label htmlFor="cid_codigo">Quantidade:</label>
                                    <input
                                        type="number"
                                        value={quantidade}
                                        min="1"
                                        max="10"
                                        style={{width:'100px',height:'34px'}}
                                        onChange={(e) => handleNumAreaChange(e)} // Permite a digitação sem validação imediata
                                        onBlur={(e) => {
                                            let value = parseInt(e.target.value, 10) || 1; // Garante que o valor seja um número
                                            if (value < 1) value = 1;
                                            if (value > 10) value = 10;
                                            handleNumAreaChange({ target: { value } }); // Atualiza o estado com o valor corrigido
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="row mt-3">
                            <div className="col-12 d-flex justify-content-end">

                                <Button 
                                    style={{marginRight:'8px',backgroundColor:'#1d6f42',border:'none',borderRadius:'10px'}}
                                    icon="pi pi-file-excel" 
                                    className="custom-button" // Estilos adicionais, se necessário
                                    onClick={handleExportComercialExcel}
                                />
                                
                                <Button
                                    style={{ backgroundColor: "#0152a1", borderRadius: "10px" }}
                                    type="submit"
                                    label="Consultar"
                                    icon="pi pi-search"
                                    onClick={handleConsultarAreaComercial}
                                />
                            </div>
                        </div>
                    </form>
                </TabPanel>
            </TabView>

            {chartData && (
                <div className="mt-5">
                    <div className="chart-container">
                        <Chart 
                        type="pie" 
                        data={chartData} 
                        style={{height: isMobile ? '300px' : '550px',
                        width: isMobile ? '300px' : '550px',
                        margin: 'auto',
                        }}/>
                    </div>
                    {/* Renderiza a lista apenas no celular */}
                    {renderValueList()}
                </div>
            )}
        </div>
    );
};

export default GraficoComFiltros;
