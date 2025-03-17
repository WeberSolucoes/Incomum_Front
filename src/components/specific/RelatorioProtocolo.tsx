import { Calendar } from 'primereact/calendar';
import { useEffect, useState,useCallback } from 'react';
import { Button } from 'primereact/button';
import { MultiSelect } from 'primereact/multiselect';
import { Dropdown } from 'primereact/dropdown';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { apiGetRelatorioFindByFilter, apiGetUnidadeRelatorioByUser, apiGetAreaComercialRelatorioByUser, apiGetAgenciaRelatorioByUser, apiGetVendedorRelatorioByUser, apiGetMoeda, apiGetCentroCusto, apiGetProtocolo, apiGetProtocoloRelatorio, apiGetSituacaoProtocolo, apiGetAgenciaBancaria } from '../../services/Api';
import { toastError,} from '../../utils/customToast';
import axios from 'axios';
import { locale, addLocale } from 'primereact/api';
import { ProtocoloCreateRequest } from '../../utils/apiObjects';
import { format, startOfMonth as startOfMonthFn } from 'date-fns';

addLocale('pt-BR', {
    firstDayOfWeek: 1,
    dayNames: ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'],
    dayNamesShort: ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'],
    dayNamesMin: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
    monthNames: ['JANEIRO', 'FEVEREIRO', 'MARÇO', 'ABRIL', 'MAIO', 'JUNHO', 'JULHO', 'AGOSTO', 'SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO'],
    monthNamesShort: ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'],
    today: 'Hoje',
    clear: 'Limpar',
    dateFormat: 'dd/mm/yy',
    weekHeader: 'Sm'
});

locale('pt-BR');



const RelatorioProtocolo = () => {
    const [request, setRequest] = useState<ProtocoloCreateRequest>({} as ProtocoloCreateRequest);
    const [unidades, setUnidades] = useState([]);
    const [areasComerciais, setAreasComerciais] = useState([]);
    const [agencias, setAgencias] = useState([]);
    const [vendedores, setVendedores] = useState([]);
    const [bancaria, setBancaria] = useState([]);
    const [moeda, setMoeda] = useState<{ label: string, value: number }[]>([]);
    const [centroCusto, setCentroCusto] = useState<{ label: string, value: number }[]>([]);
    const [previsaoStart, setPrevisaoStart] = useState(null); // Data Previsão Inicial
    const [previsaoEnd, setPrevisaoEnd] = useState(null); // Data Previsão Final
    const [pagamentoStart, setPagamentoStart] = useState(null); // Data Pagamento Inicial
    const [pagamentoEnd, setPagamentoEnd] = useState(null); // Data Pagamento Final


    const [selectedUnidade, setSelectedUnidade] = useState(null);
    const [selectedVendedor, setSelectedVendedor] = useState([]);
    const [loading, setLoading] = useState(false);
    const [dateStart, setDateStart] = useState(null);
    const [dateEnd, setDateEnd] = useState(null);
    const [data, setData] = useState([]);
    const [tableLoading, setTableLoading] = useState(false);
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);
    const [openCalendar, setOpenCalendar] = useState<string | null>(null);



    const [soma_totais, setSomaTotais] = useState({
        prt_valor: 0,
    });

    useEffect(() => {
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1); // Primeiro dia do mês atual
        const endOfDay = today; // Data final será o dia de hoje

        setPrevisaoStart(startOfMonth);
        setPrevisaoEnd(endOfDay);
    }, []); 


    const formatDate = (dateString) => {
        if (!dateString) return ''; // Retorna vazio se a data for nula ou indefinida
    
        // Converte a string de data para um objeto Date
        const date = new Date(dateString);
    
        // Verifica se a data é válida
        if (isNaN(date.getTime())) {
            console.error("Data inválida:", dateString);
            return '';
        }
    
        // Formata a data no formato dd/mm/yyyy
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Mês é base 0
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const handleCalendarOpen = (calendarName: string) => {
        if (openCalendar && openCalendar !== calendarName) {
            document.dispatchEvent(new Event('click')); // Fecha qualquer calendário aberto
        }
        setOpenCalendar(calendarName);
    };
    

    const handleDateChange = (setter, field, value) => {
        console.log(`Nova data selecionada para ${field}:`, value);
    
        // Verifica se a data existe e a formata corretamente
        const formattedDate = value ? format(value, 'yyyy-MM-dd') : null;
    
        // Atualiza o estado individual
        setter(value);
    
        // Atualiza o estado dos filtros
        setFilters((prevFilters) => ({
            ...prevFilters,
            [field]: formattedDate, // Usa a data formatada no formato correto
        }));
    };


    const [filters, setFilters] = useState({
        dateStart: '',
        dateEnd: '',
        unidade: '',
        areaComercial: null,
        protocolo: '',
        contaBancaria: null,
        situacaoProtocolo: null,
        centroCusto: null,
        moe_codigo: null
    });
    
    const handleMoedaChange = (e) => {
        const selectedValue = e.value; // Extrai o valor selecionado (único)
        setFilters((prevFilters) => ({
            ...prevFilters,
            moe_codigo: selectedValue, // Atualiza o campo moe_codigo com um único valor
        }));
    };
    
    const handleCentroCustoChange = (e) => {
        const selectedValue = e.value; // Extrai o valor selecionado (único)
        setFilters((prevFilters) => ({
            ...prevFilters,
            centroCusto: selectedValue, // Atualiza o campo moe_codigo com um único valor
        }));
    };

    const handleSituacaoProtocoloChange = (e) => {
        const selectedValue = e.value; // Extrai o valor selecionado (único)
        setFilters((prevFilters) => ({
            ...prevFilters,
            situacaoProtocolo: selectedValue, // Atualiza o campo moe_codigo com um único valor
        }));
    };

    const handleLojaChange = (e) => {
        const selectedValue = e.value; // Extrai o valor selecionado (único)
        setFilters((prevFilters) => ({
            ...prevFilters,
            unidade: selectedValue, // Atualiza o campo moe_codigo com um único valor
        }));
    };

    const handleBancariaChange = (e) => {
        const selectedValue = e.value; // Extrai o valor selecionado (único)
        setFilters((prevFilters) => ({
            ...prevFilters,
            contaBancaria: selectedValue, // Atualiza o campo moe_codigo com um único valor
        }));
    };

    const handleComercialChange = (e) => {
        const selectedValue = e.value; // Extrai o valor selecionado (único)
        setFilters((prevFilters) => ({
            ...prevFilters,
            areaComercial: selectedValue, // Atualiza o campo moe_codigo com um único valor
        }));
    };
    
    const handleInputChange = (event) => {
        const { name, value } = event.target;
    
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value,  // Atualiza apenas o campo alterado
        }));
    };
    
    
    
    
    
    // Carrega dados iniciais (unidades, agencias, vendedores, áreas comerciais)
    useEffect(() => {
        loadDadosIniciais();
        loadMoedas();
        loadCentroCusto();
        loadSituacaoProtocolo();
        loadBancaria();
    }, []);

    useEffect(() => {
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1); // Primeiro dia do mês atual
        const endOfDay = today; // Data final será o dia de hoje

        setDateStart(startOfMonth);
        setDateEnd(endOfDay);
    }, []); 

    const loadDadosIniciais = async () => {
        setLoading(true);
        try {
            // Tenta carregar as unidades
            const unidadesResponse = await apiGetUnidadeRelatorioByUser();
            setUnidades(unidadesResponse.data.map(item => ({ label: item.loj_descricao, value: item.loj_codigo })));
        } catch (error) {
            toastError('Erro ao carregar as unidades');
        }
    
        try {
            // Tenta carregar as agências
            const agenciasResponse = await apiGetAgenciaRelatorioByUser();
            setAgencias(agenciasResponse.data.valores.map(item => ({ label: item.age_descricao, value: item.age_codigo })));
        } catch (error) {
            toastError('Erro ao carregar as agências');
        }
        try {
            // Tenta carregar as áreas comerciais
            const areasResponse = await apiGetAreaComercialRelatorioByUser();
            setAreasComerciais(areasResponse.data.associacoes.map(item => ({ label: item.aco_descricao, value: item.aco_codigo })));
        } catch (error) {
            toastError('Erro ao carregar as áreas comerciais');
        } finally {
            setLoading(false);
        }
    };

    const loadMoedas = async () => {
        try {
            const agenciasResponse = await apiGetMoeda();
    
            console.log("Resposta da API:", agenciasResponse.data); // Depuração
    
            // Certifique-se de que agenciasResponse.data é um array de objetos no formato { moe_codigo, moe_descricao }
            const moedaOptions = agenciasResponse.data.map(item => ({
                label: item.moe_descricao, // Descrição da moeda
                value: item.moe_codigo, // Código da moeda
            }));
    
            setMoeda(moedaOptions);
        } catch (error) {
            console.error("Erro ao carregar moedas:", error);
            toastError('Erro ao carregar as moedas');
        }
    };

    const loadCentroCusto = async () => {
        try {
            const agenciasResponse = await apiGetCentroCusto();
            console.log("Resposta da API:", agenciasResponse.data);
    
            const moedaOptions = agenciasResponse.data.map(item => ({
                label: item.cta_descricao,  // Descrição
                value: item.cta_codigo      // Código
            }));
    
            console.log("Opções de Centro de Custo:", moedaOptions); // Verifique se as opções estão corretas
    
            setCentroCusto(moedaOptions);
        } catch (error) {
            console.error("Erro ao carregar Centro De Custo:", error);
            toastError('Erro ao carregar Centro De Custo');
        }
    };


    const loadSituacaoProtocolo = async () => {
        try {
            const agenciasResponse = await apiGetSituacaoProtocolo();
            console.log("Resposta da API:", agenciasResponse.data);
    
            const moedaOptions = agenciasResponse.data.map(item => ({
                label: item.spr_descricao,  // Descrição
                value: item.spr_codigo      // Código
            }));
    
            console.log("Opções de Situação Protocolo:", moedaOptions); // Verifique se as opções estão corretas
    
            setVendedores(moedaOptions);
        } catch (error) {
            console.error("Erro ao carregar Situação Protocolo:", error);
            toastError('Erro ao carregar Situação Protocolo');
        }
    };
    

    const loadBancaria = async () => {
        try {
            const agenciasResponse = await apiGetAgenciaBancaria();
            console.log("Resposta da API:", agenciasResponse.data);
    
            const moedaOptions = agenciasResponse.data.map(item => ({
                label: item.age_descricao,  // Descrição
                value: item.age_codigo      // Código
            }));
    
            console.log("Opções de Agência Bancaria:", moedaOptions); // Verifique se as opções estão corretas
    
            setBancaria(moedaOptions);
        } catch (error) {
            console.error("Erro ao carregar Agência Bancaria:", error);
            toastError('Erro ao carregar Agência Bancaria');
        }
    };


    const validateDates = () => {
        // Verifica se as datas estão preenchidas
        if (!previsaoStart || !previsaoEnd) {
            toastError('As datas de início e fim são obrigatórias.');
            return false;
        }
    
        // Verifica se a diferença entre as datas é maior que 3 meses
        const diffInMonths = (previsaoEnd.getFullYear() - previsaoStart.getFullYear()) * 12 + (previsaoEnd.getMonth() - previsaoStart.getMonth());
        if (diffInMonths > 3) {
            toastError('A diferença entre as datas não pode ser maior que 3 meses.');
            return false;
        }
    
        return true; // Retorna true se as datas forem válidas
    };
    

    // Função de envio do formulário

    const handleSubmit = useCallback(async (event) => {
        event.preventDefault();
    
        // Verifica se as datas estão preenchidas
        if (!validateDates()) {
            return; // Interrompe a execução se as datas forem inválidas
        }
    
        setData([]);
    
        const params = {
            dateStart: previsaoStart ? format(previsaoStart, 'yyyy-MM-dd') : '',
            dateEnd: previsaoEnd ? format(previsaoEnd, 'yyyy-MM-dd') : '',
            pagamentoStart: pagamentoStart ? format(pagamentoStart, 'yyyy-MM-dd') : '',
            pagamentoEnd: pagamentoEnd ? format(pagamentoEnd, 'yyyy-MM-dd') : '',
            unidade: filters.unidade || '',
            areaComercial: filters.areaComercial || '',
            protocolo: filters.protocolo || '',
            contaBancaria: filters.contaBancaria || '',
            situacaoProtocolo: filters.situacaoProtocolo || '',
            centroCusto: filters.centroCusto || '',
            moe_codigo: filters.moe_codigo || ''
        };
    
        console.log("Parâmetros enviados:", params);
    
        try {
            setTableLoading(true);
            const response = await apiGetProtocoloRelatorio(params);
    
            if (Array.isArray(response.data)) {
                setData(response.data);
                const totalPagamento = response.data.reduce((sum, item) => sum + item.prt_valor, 0);
                setSomaTotais({
                    prt_valor: totalPagamento,
                });
            } else {
                setData([]);
                toastError('Nenhum resultado encontrado.');
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
            toastError('Erro ao realizar a consulta');
        } finally {
            setTableLoading(false);
        }
    }, [filters, previsaoStart, previsaoEnd, pagamentoStart, pagamentoEnd]);
    

    
    const onPageChange = (e) => {
        setFirst(e.first);
        setRows(e.rows);
    };



    const formatCurrency = (value) => {
        if (value === null || value === undefined) return '';
    
        // Trunca o valor para 2 casas decimais sem arredondar
        const truncatedValue = Math.floor(value * 100) / 100;
    
        // Formata o valor para moeda BRL
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2,
        }).format(truncatedValue);
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const scrollToBottom = () => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    };
    const handleExport = async (event) => {
        event.preventDefault();
        setTableLoading(true); // Ativa o estado de carregamento
    
        if (!validateDates()) {
            setTableLoading(false); // Desativa o estado de carregamento em caso de erro
            return;
        }
    
        try {
            // Realiza uma nova consulta antes de exportar
            const consultaResponse = await apiGetProtocoloRelatorio({
                dateStart: previsaoStart ? format(previsaoStart, 'yyyy-MM-dd') : '',
                dateEnd: previsaoEnd ? format(previsaoEnd, 'yyyy-MM-dd') : '',
                pagamentoStart: pagamentoStart ? format(pagamentoStart, 'yyyy-MM-dd') : '',
                pagamentoEnd: pagamentoEnd ? format(pagamentoEnd, 'yyyy-MM-dd') : '',
                unidade: filters.unidade || '',
                areaComercial: filters.areaComercial || '',
                protocolo: filters.protocolo || '',
                contaBancaria: filters.contaBancaria || '',
                situacaoProtocolo: filters.situacaoProtocolo || '',
                centroCusto: filters.centroCusto || '',
                moe_codigo: filters.moe_codigo || ''
            });
    
            // Atualiza os dados com a nova consulta
            setData(consultaResponse.data);
    
            // Exporta os dados atualizados
            const exportResponse = await axios.get("http://localhost:8000/api/incomum/protocolo/export-csv/", {
                params: {
                    dateStart: previsaoStart ? format(previsaoStart, 'yyyy-MM-dd') : '',
                    dateEnd: previsaoEnd ? format(previsaoEnd, 'yyyy-MM-dd') : '',
                    pagamentoStart: pagamentoStart ? format(pagamentoStart, 'yyyy-MM-dd') : '',
                    pagamentoEnd: pagamentoEnd ? format(pagamentoEnd, 'yyyy-MM-dd') : '',
                    unidade: filters.unidade || '',
                    areaComercial: filters.areaComercial || '',
                    protocolo: filters.protocolo || '',
                    contaBancaria: filters.contaBancaria || '',
                    situacaoProtocolo: filters.situacaoProtocolo || '',
                    centroCusto: filters.centroCusto || '',
                    moe_codigo: filters.moe_codigo || ''
                },
                responseType: "blob",
            });
    
            const blob = new Blob([exportResponse.data], { type: "text/csv" });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "relatorio.csv");
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Erro ao gerar relatório:", error);
            toastError('Erro ao exportar o relatório.');
        } finally {
            setTableLoading(false); // Desativa o estado de carregamento ao finalizar
        }
    };

    

    return (
        <>
        <div style={{backgroundColor:'white',borderRadius:'10px',marginTop:'0px',padding:'inherit',width: '1100px',marginLeft: '320px', boxShadow: '10px 10px 100px rgba(0, 0, 0, 0.4),-2px -2px 6px rgba(255, 255, 255, 0.6)'}} className="container px-4">
            <h1 style={{ marginTop: '10px', color: '#0152a1' }}>Relatório Protocolo</h1>
            <form style={{ backgroundColor: '#f9f9f9', width: '100%', margin: 'auto', padding: '20px', border: '1px solid #ddd', borderRadius: '5px',height:'90%' }} onSubmit={handleSubmit}>
                <div className='row mt-3'>
                    <div className='col-sm-3 mb-3'>
                        <div className="form-group">
                            <label>Data Previsão Inicial</label>
                            <Calendar
                                value={previsaoStart}
                                onChange={(e) => handleDateChange(setPrevisaoStart, 'previsaoStart', e.value)}
                                onFocus={() => handleCalendarOpen('previsaoStart')}
                                showIcon
                                placeholder="Data Inicial"
                                locale='pt-BR'
                                dateFormat="dd/mm/yy"
                            />
                        </div>
                    </div>
                    <div className='col-sm-3 mb-3'>
                        <div className="form-group">
                            <label>Data Previsão Final</label>
                            <Calendar
                                value={previsaoEnd}
                                onChange={(e) => handleDateChange(setPrevisaoEnd, 'previsaoEnd', e.value)}
                                onFocus={() => handleCalendarOpen('previsaoEnd')}
                                showIcon
                                placeholder="Data Final"
                                locale='pt-BR'
                                dateFormat="dd/mm/yy"
                            />
                        </div>
                    </div>

                    {/* Filtro de Pagamento (Data Vencimento) */}
                    <div className='col-sm-3 mb-3'>
                        <div className="form-group">
                            <label>Data Pagamento Inicial</label>
                            <Calendar
                                value={pagamentoStart}
                                onChange={(e) => handleDateChange(setPagamentoStart, 'pagamentoStart', e.value)}
                                onFocus={() => handleCalendarOpen('pagamentoStart')}
                                showIcon
                                placeholder="Data Inicial"
                                locale='pt-BR'
                                dateFormat="dd/mm/yy"
                            />
                        </div>
                    </div>
                    <div className='col-sm-3 mb-3'>
                        <div className="form-group">
                            <label>Data Pagamento Final</label>
                            <Calendar
                                value={pagamentoEnd}
                                onChange={(e) => handleDateChange(setPagamentoEnd, 'pagamentoEnd', e.value)}
                                onFocus={() => handleCalendarOpen('pagamentoEnd')}
                                showIcon
                                placeholder="Data Final"
                                locale='pt-BR'
                                dateFormat="dd/mm/yy"
                            />
                        </div>
                    </div>
                </div>

                <div className='row mt-3'>
                    <div className='col-sm-3 mb-3'>
                        <div className="form-group">
                            <label htmlFor="cid_codigo">Unidade</label>
                            <Dropdown
                                value={filters.unidade} 
                                options={unidades} 
                                onChange={handleLojaChange}    // Atualiza as áreas comerciais ao mudar a unidade
                                placeholder="Unidade"
                                style={{width:'100%',textAlign: 'left' }}
                                panelStyle={{ width: '10%',textAlign: 'left' }} // Largura do painel
                                showClear={selectedUnidade !== null}
                                filter
                                emptyFilterMessage="Nenhuma opção disponível"
                                emptyMessage="Sem opções disponíveis"
                            />
                        </div>
                    </div>
                    <div className='col-sm-3 mb-3'>
                        <div className="form-group">
                            <label htmlFor="cid_codigo">Área Comercial</label>
                            <Dropdown 
                                value={filters.areaComercial} 
                                options={areasComerciais} 
                                onChange={handleComercialChange} 
                                placeholder="Área Comercial" 
                                style={{width:'100%',textAlign: 'left' }}
                                panelStyle={{ width: '10%',textAlign: 'left' }} // Largura do painel
                                showClear
                                filter
                                emptyFilterMessage="Nenhuma opção disponível"
                                emptyMessage="Sem opções disponíveis"
                            />
                        </div> 
                    </div>
                    <div className='col-sm-3 mb-3'>
                        <div className="form-group">
                            <label htmlFor="cid_codigo">Num. Protocolo</label>
                            <input
                                type="text"
                                id="prt_codigo"
                                name="protocolo" // Alterado para garantir que corresponda ao estado
                                value={filters.protocolo || ''}
                                onChange={handleInputChange}
                                style={{ width: '100%' }}
                            />
                        </div>
                    </div>
                    <div className='col-sm-3 mb-3'>
                        <div className="form-group">
                            <label htmlFor="cid_codigo">Conta Bancaria</label>
                            <Dropdown
                                value={filters.contaBancaria} 
                                options={bancaria} 
                                onChange={handleBancariaChange}
                                placeholder="Conta Bancaria"
                                style={{width:'100%'}}
                                showClear
                                filter
                                filterBy="label" // Filtra com base na descrição (label)
                                optionLabel="label"
                            />
                        </div>
                    </div>
                    <div className='col-sm-3 mb-3'>
                        <div className="form-group">
                            <label htmlFor="cid_codigo">Situação Protocolo</label>
                            <Dropdown
                                value={filters.situacaoProtocolo} 
                                options={vendedores} 
                                onChange={handleSituacaoProtocoloChange}
                                placeholder="Situação Protocolo"
                                style={{width:'100%'}}
                                showClear
                                filter
                                filterBy="label" // Filtra com base na descrição (label)
                                optionLabel="label"
                            />
                        </div>
                    </div>
                    <div className='col-sm-3 mb-3'>
                        <div className="form-group">
                            <label htmlFor="cid_codigo">Centro de Custo</label>
                            <Dropdown
                                value={filters.centroCusto} // Passa o estado com os valores selecionados
                                options={centroCusto} // Passa as opções para o MultiSelect
                                onChange={handleCentroCustoChange} // Chama a função ao selecionar um valor
                                placeholder="Centro de Custo"
                                style={{ width: '100%' }}
                                showClear
                                filter
                                filterBy="label"
                                optionLabel="label"
                            />
                        </div>
                    </div>
                    <div className='col-sm-3 mb-3'>
                        <div className="form-group">
                            <label htmlFor="cid_codigo">Moeda</label>
                            <Dropdown
                                value={filters.moe_codigo} // Valor selecionado (único)
                                options={moeda} // Opções disponíveis
                                onChange={handleMoedaChange} // Função de mudança
                                placeholder="Moeda"
                                style={{ width: '100%' }}
                                showClear
                                filter
                                filterBy="label"
                                optionLabel="label"
                            />
                        </div>
                    </div>
                    <div className='col-12 d-flex justify-content-end'>
                        <Button 
                            style={{marginRight:'8px',backgroundColor:'#1d6f42',border:'none', borderRadius: '10px'}}
                            icon="pi pi-file-excel" 
                            onClick={handleExport}
                            type="button" // Define o tipo como "button"
                            className="custom-button" // Estilos adicionais, se necessário
                        />
                        <Button style={{backgroundColor:'#0152a1', borderRadius: '10px'}} type="submit" label="Consultar" icon="pi pi-search" />
                    </div>
                </div>
                <div className='row mt-3'>
                    
                </div>
            </form>

            <div className='row mt-5'>
                <div className='col-12'>
                    <DataTable 
                        value={data} 
                        loading={tableLoading}
                        responsiveLayout="scroll"
                        paginator
                        first={first}
                        totalRecords={totalRecords} 
                        rows={rows}
                        onPage={onPageChange}
                        rowsPerPageOptions={[10, 20, 50]} // Opções de paginação
                        className="custom-datatable" 
                    >
                        <Column 
                            field="prt_datacadastro" 
                            header="Data Programação" 
                            body={(rowData) => formatDate(rowData.prt_datacadastro)}
                        />
                        <Column 
                            field="prt_datavencimento" 
                            header="Data Pagamento" 
                            body={(rowData) => formatDate(rowData.prt_datavencimento)}
                        />
                        <Column field="prt_codigo" header="N. Protocolo"/>
                        <Column field="loja_nome" header="Agência" />
                        <Column field="conta_nome" header="Centro De Custo"/>
                        <Column field="fornecedor_nome" header="Parceiro" />
                        <Column field="prt_observacao" header="Observação" />
                        <Column field="prt_valor" header="Valor Pagamento" body={(rowData) => formatCurrency(rowData.prt_valor)}  />
                    </DataTable>
                    <div className="container-valores" style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: '#f0f0f0', fontWeight: 'bold', padding: '10px 0' }}>
                        <div style={{marginLeft:'20px'}}>Valor Pagamento: {formatCurrency(soma_totais.prt_valor)}</div>
                    </div>
                </div>
            </div>
        </div>
          {/* Botões de rolagem */}
          <div style={{
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
            }}>
                <Button
                    icon="pi pi-arrow-up"
                    onClick={scrollToTop}
                    style={{ backgroundColor: '#0152a1', border: 'none',borderRadius:'10px' }}
                />
                <Button
                    icon="pi pi-arrow-down"
                    onClick={scrollToBottom}
                    style={{ backgroundColor: '#0152a1', border: 'none',borderRadius:'10px' }}
                />
            </div>
        </>
    );
};

export default RelatorioProtocolo;
