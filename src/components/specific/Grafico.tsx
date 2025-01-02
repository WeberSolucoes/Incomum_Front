import React, { useState, useEffect } from "react";
import { TabView, TabPanel } from "primereact/tabview";
import { MultiSelect } from "primereact/multiselect"; 
import { Dropdown } from "primereact/dropdown"; 
import { Calendar } from "primereact/calendar"; 
import { Button } from "primereact/button"; 
import { Chart } from "primereact/chart"; 
import axios from "axios";
import { toastError } from "../../utils/customToast";
import { apiGetAgencia,apiGetUnidades,apiGetGraficoUnidade,apiGetGraficoAgencia,apiGetArea } from '../../services/Api';


const GraficoComFiltros = () => {
    const [dateStart, setDateStart] = useState(null);
    const [dateEnd, setDateEnd] = useState(null);
    const [unidades, setUnidades] = useState([]);
    const [agencias, setAgencias] = useState([]);
    const [chartData, setChartData] = useState(null);
    const [selectedUnidade, setSelectedUnidade] = useState("todos");
    const [selectedAgencias, setSelectedAgencias] = useState([]);
    const [activeTab, setActiveTab] = useState(0); // Controle da aba ativa
    const [filteredAgencias, setFilteredAgencias] = useState([]);
    const [areasComerciais, setAreasComerciais] = useState([]);
    const [vendedores, setVendedores] = useState([]);
    const [loading, setLoading] = useState(false);

    const [selectedAreaComercial, setSelectedAreaComercial] = useState([]);
    const [selectedVendedor, setSelectedVendedor] = useState(null);
    const [selectedAgencia, setSelectedAgencia] = useState(null);


    useEffect(() => {
        const fetchUnidades = async () => {
            try {
                const response = await apiGetUnidades();
                const unidadesFormatadas = [
                    { label: "Todas as Unidades", value: "todos" },
                    ...response.data.map((unidade) => ({
                        label: unidade.loj_descricao,
                        value: unidade.loj_codigo,
                    })),
                ];
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
    
        try {
            let areasResponse;
    
            // Se houver uma unidade selecionada, busca áreas comerciais associadas
            if (unidadeId) {
                areasResponse = await apiGetArea(), {
                    params: { unidade: unidadeId }
                });
            } else {
                // Caso não haja unidade, busca todas as áreas comerciais
                areasResponse = await apiGetArea();
            }
    
            // Popula as áreas comerciais
            if (areasResponse.data.associacoes.length > 0) {
                setAreasComerciais(areasResponse.data.associacoes.map(item => ({
                    label: item.aco_descricao,
                    value: item.aco_codigo
                })));
            } else {
                setAreasComerciais([]); // Se não houver áreas comerciais
                toastError('Nenhuma área comercial encontrada.');
            }
        } catch (error) {
            toastError('Erro ao carregar as áreas comerciais.');
            console.error('Erro ao fazer a requisição:', error);
        }
    };
    
    const fetchAgencias = async (selectedAreaComercial = [], unidadeId = null) => {
        console.log('Áreas Comerciais Selecionadas:', selectedAreaComercial);
        console.log('Unidade Selecionada:', unidadeId);
    
        try {
            let response;
    
            // Se nenhum filtro (área comercial ou unidade) for selecionado, busca todas as agências
            if (selectedAreaComercial.length === 0 && !unidadeId) {
                response = await axios.get('https://api.incoback.com.br/api/incomum/relatorio/agencia-by-user/');
            } else {
                // Faz a requisição com os filtros (área comercial e/ou unidade)
                response = await axios.get('https://api.incoback.com.br/api/incomum/relatorio/agencia-by-user/', {
                    params: {
                        area_comercial: selectedAreaComercial.length > 0 ? selectedAreaComercial : undefined,
                        unidade: unidadeId || undefined,
                    },
                });
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
            console.log('Resposta da API:', response.data);
    
            if (Array.isArray(response.data.data) && Array.isArray(response.data.labels)) {
                // A resposta deve conter os dados de faturamento e labels (loj_descricao)
                const labels = response.data.labels; // Aqui usamos as labels que vêm da resposta
                const data = response.data.data;     // Dados de faturamento para cada unidade
    
                // Agora, estamos garantindo que as labels sejam sempre as descrições da unidade (loj_descricao)
                setChartData({
                    labels,  // Labels são os nomes das unidades, como loj_descricao
                    datasets: [
                        {
                            label: "Faturamento",
                            data,  // Faturamento associado às unidades
                            backgroundColor: ["#0152a1", "#e87717", "#17a2e8"],  // Defina as cores conforme necessário
                            borderWidth: 2,
                        },
                    ],
                });
            } else {
                console.error('Formato inesperado na resposta da API:', response.data);
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
        },
    };

    const handleTabChange = (e) => {
        setChartData(null); // Limpar dados ao mudar de aba
        setActiveTab(e.index);
    };
    


    return (
        <div
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
                                    showClear  
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
                    <Chart type="bar" data={chartData} options={options} />
                </div>
            )}
        </div>
    );
};

export default GraficoComFiltros;
