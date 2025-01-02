import React, { useState, useEffect } from "react";
import { TabView, TabPanel } from "primereact/tabview";
import { MultiSelect } from "primereact/multiselect"; 
import { Dropdown } from "primereact/dropdown"; 
import { Calendar } from "primereact/calendar"; 
import { Button } from "primereact/button"; 
import { Chart } from "primereact/chart"; 
import axios from "axios";
import { apiGetAgencia,apiGetUnidades,apiGetGraficoUnidade,apiGetGraficoAgencia } from '../../services/Api';

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
                const agenciasFormatadas = response.data.map((agencia) => ({
                    label: agencia.age_descricao,
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

    const handleFilter = (event) => {
        const query = event.filter.trim();
        if (query.length >= 3) {
            const results = agencias.filter((agencia) =>
                agencia.label.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredAgencias(results);
        } else {
            setFilteredAgencias([]); // Esvazia os resultados se tiver menos de 3 caracteres
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
                                    style={{ backgroundColor: "#0152a1" }}
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
                        <div className="row mt-3">
                            <div className="col-sm-3 mb-3">
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
                                    style={{width:'236px'}}
                                />
                            </div>
                        </div>
                        <div className="row mt-3">
                            <div className="col-12 d-flex justify-content-end">
                                <Button
                                    style={{ backgroundColor: "#0152a1" }}
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
