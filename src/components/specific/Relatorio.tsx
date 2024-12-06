import { Calendar } from 'primereact/calendar';
import { useEffect, useState,useCallback } from 'react';
import { Button } from 'primereact/button';
import { MultiSelect } from 'primereact/multiselect';
import { Dropdown } from 'primereact/dropdown';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { apiGetRelatorioFindByFilter, apiGetUnidadeRelatorioByUser, apiGetAreaComercialRelatorioByUser, apiGetAgenciaRelatorioByUser, apiGetVendedorRelatorioByUser } from '../../services/Api';
import { toastError,} from '../../utils/customToast';
import axios from 'axios';
import { locale, addLocale } from 'primereact/api';

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

headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
},


const Relatorio = () => {
    const [unidades, setUnidades] = useState([]);
    const [areasComerciais, setAreasComerciais] = useState([]);
    const [agencias, setAgencias] = useState([]);
    const [vendedores, setVendedores] = useState([]);

    const [selectedUnidade, setSelectedUnidade] = useState(null);
    const [selectedAreaComercial, setSelectedAreaComercial] = useState([]);
    const [selectedVendedor, setSelectedVendedor] = useState(null);
    const [selectedAgencia, setSelectedAgencia] = useState(null);

    const [loading, setLoading] = useState(false);
    const [dateStart, setDateStart] = useState(null);
    const [dateEnd, setDateEnd] = useState(null);
    const [data, setData] = useState([]);
    const [tableLoading, setTableLoading] = useState(false);
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);

    const [soma_totais, setSomaTotais] = useState({
        total_valorinc: 0,
        total_valorincajustado: 0,
        total_valorliquido: 0
    });

    // Carrega dados iniciais (unidades, agencias, vendedores, áreas comerciais)
    useEffect(() => {
        loadDadosIniciais();
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
            const agenciasResponse = await axios.get('http://18.118.35.25:8443/api/incomum/relatorio/agencia-by-user/');
            setAgencias(agenciasResponse.data.valores.map(item => ({ label: item.age_descricao, value: item.age_codigo })));
        } catch (error) {
            toastError('Erro ao carregar as agências');
        }
    
        try {
            // Tenta carregar os vendedores
            const vendedoresResponse = await axios.get('http://18.118.35.25:8443/api/incomum/relatorio/vendedor-by-user/');
        
            // Log para verificar o que está sendo retornado pela API
            console.log('Dados dos vendedores:', vendedoresResponse.data);
        
            // Verifique se a resposta possui a chave 'vendedores'
            if (vendedoresResponse.data && vendedoresResponse.data.vendedores) {
                // Mapeia os vendedores corretamente
                setVendedores(vendedoresResponse.data.vendedores.map(item => ({
                    label: item.ven_descricao, 
                    value: item.ven_codigo
                })));
            } else {
                setVendedores([]); // Caso não haja vendedores
                toastError('Nenhum vendedor encontrado.');
            }
        } catch (error) {
            console.error('Erro ao carregar os vendedores:', error);  // Log do erro
            toastError('Erro ao carregar os vendedores.');
        }
        try {
            // Tenta carregar as áreas comerciais
            const areasResponse = await axios.get('http://18.118.35.25:8443/api/incomum/relatorio/list-all-area/');
            setAreasComerciais(areasResponse.data.associacoes.map(item => ({ label: item.aco_descricao, value: item.aco_codigo })));
        } catch (error) {
            toastError('Erro ao carregar as áreas comerciais');
        } finally {
            setLoading(false);
        }
    };

    const handleUnidadeChange = async (e) => {
        const unidadeId = e ? e.value : null;  // Verifica se há unidade selecionada, caso contrário, null
        setSelectedUnidade(unidadeId);
        setSelectedAreaComercial([]); // Limpa as áreas comerciais ao trocar a unidade
        setVendedores([]); // Limpa os vendedores ao trocar a unidade
    
        try {
            let areasResponse;
            let vendedoresResponse;
    
            // Se houver uma unidade selecionada, busca áreas e vendedores associados
            if (unidadeId) {
                areasResponse = await axios.get(`http://18.118.35.25:8443/api/incomum/relatorio/list-all-areas/`, {
                    params: { unidade: unidadeId }
                });
    
                vendedoresResponse = await axios.get(`http://18.118.35.25:8443/api/incomum/relatorio/vendedor-by-user/`, {
                    params: { unidade: unidadeId }
                });
            } else {
                // Caso não haja unidade, busca todas as áreas comerciais e vendedores
                areasResponse = await axios.get('http://18.118.35.25:8443/api/incomum/relatorio/list-all-areas/');
                vendedoresResponse = await axios.get('http://18.118.35.25:8443/api/incomum/relatorio/vendedor-by-user/');
            }
    
            // Popula as áreas comerciais
            if (areasResponse.data.associacoes.length > 0) {
                setAreasComerciais(areasResponse.data.associacoes.map(item => ({
                    label: item.aco_descricao, value: item.aco_codigo
                })));
            } else {
                setAreasComerciais([]); // Se não houver áreas comerciais
                toastError('Nenhuma área comercial encontrada.');
            }
    
            // Popula os vendedores
            if (vendedoresResponse.data.vendedores.length > 0) {
                setVendedores(vendedoresResponse.data.vendedores.map(item => ({
                    label: item.ven_descricao, value: item.ven_codigo
                })));
            } else {
                setVendedores([]); // Se não houver vendedores
                toastError('Nenhum vendedor encontrado.');
            }
        } catch (error) {
            toastError('Erro ao carregar as áreas comerciais e vendedores.');
            console.error('Erro ao fazer a requisição:', error);
        }
    };

    const fetchAgencias = async (selectedAreaComercial: string | any[]) => {
        // Se áreas forem selecionadas, faz a requisição para buscar as agências
        console.log('Áreas Comerciais Selecionadas:', selectedAreaComercial);
        if (selectedAreaComercial.length > 0) {
            try {
                const response = await axios.get(`http://18.118.35.25:8443/api/incomum/relatorio/agencia-by-user/`, {
                    params: { area_comercial: selectedAreaComercial }  // Passa todas as áreas selecionadas
                });
                console.log('Áreas Comerciais Selecionadas:', selectedAreaComercial);
                // Verifica se há resultados e os mapeia para o Dropdown
                if (response.data.valores.length > 0) {
                    setAgencias(response.data.valores.map(item => ({
                        label: item.age_descricao,
                        value: item.age_codigo
                    })));
                } else {
                    setAgencias([]); // Caso não haja agências
                    toastError('Nenhuma agência encontrada para esta área comercial.');
                }
            } catch (error) {
                toastError('Erro ao carregar as agências');
                console.error('Erro ao fazer a requisição:', error);  // Log do erro para diagnosticar
            }
        } else {
            // Se nenhuma área for selecionada, limpar as agências
            setAgencias([]);
        }
    };


    const handleAreaChange = (e) => {
        setSelectedAreaComercial(e.value); // Atualiza o estado com as áreas selecionadas
        console.log('Áreas Comerciais Selecionadas:', e.value); // Verifique os valores
        fetchAgencias(e.value); // Chama a função para buscar as agências com as áreas selecionadas
    };
    // Função de envio do formulário
    const handleSubmit = useCallback(async (event) => {
        event.preventDefault();
        setData([]);
        if (!dateStart || !dateEnd) {
            toastError('As datas de início e fim são obrigatórias.');
            return;
        }

        const params = {
            dataInicio: dateStart.toISOString().split('T')[0],
            dataFim: dateEnd.toISOString().split('T')[0],
            unidades: selectedUnidade ? [selectedUnidade] : [],
            areasComerciais: selectedAreaComercial.length > 0 ? selectedAreaComercial : [],
            agencias: selectedAgencia ? [selectedAgencia] : [],
            vendedores: selectedVendedor ? [selectedVendedor] : [],
        };

        try {
            setTableLoading(true);
            const response = await apiGetRelatorioFindByFilter(params);
            if (response.data && Array.isArray(response.data.resultados)) {
                setData(response.data.resultados);
                setTotalRecords(response.data.resultados.length);

                // Cálculo dos totais
                const totalValorInc = response.data.resultados.reduce((sum, item) => sum + item.fim_valorinc, 0);
                const totalValorIncAjustado = response.data.resultados.reduce((sum, item) => sum + item.fim_valorincajustado, 0);
                const totalValorLiquido = response.data.resultados.reduce((sum, item) => sum + item.fim_valorliquido, 0);

                // Atualiza os totais
                setSomaTotais({
                    total_valorinc: totalValorInc,
                    total_valorincajustado: totalValorIncAjustado,
                    total_valorliquido: totalValorLiquido,
                });
            } else {
                setData([]);
                setTotalRecords(0);
                toastError('Nenhum resultado encontrado.');
            }
        } catch (error) {
            toastError('Erro ao realizar a consulta');
        } finally {
            setTableLoading(false);
        }
    }, [dateStart, dateEnd, selectedUnidade, selectedAreaComercial, selectedAgencia, selectedVendedor]);

    const onPageChange = (e) => {
        setFirst(e.first);
        setRows(e.rows);
    };

    const formatCurrency = (value) => {
        return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const scrollToBottom = () => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    };
    const handleExport = async () => {
        try {
            const response = await axios.get('http://18.118.35.25:8443/api/incomum/relatorio/download-relatorio/', {
                params: {
                    dataInicio: dateStart?.toISOString().split('T')[0],
                    dataFim: dateEnd?.toISOString().split('T')[0],
                    unidade: selectedUnidade,
                    areaComercial: selectedAreaComercial,
                    agencia: selectedAgencia,
                    vendedor: selectedVendedor,
                },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`, // Incluindo o token
                },
                responseType: 'blob', // Definindo o tipo de resposta como arquivo binário
            });
    
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'relatorio.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Erro ao exportar Excel:', error);
            toastError('Erro ao exportar Excel');
        }
    };

    return (
        <>
        <div style={{backgroundColor:'white',borderRadius:'10px',marginTop:'-40px',padding:'inherit',width: '1100px',marginLeft: '320px', boxShadow: '10px 10px 100px rgba(0, 0, 0, 0.4),-2px -2px 6px rgba(255, 255, 255, 0.6)'}} className="container px-4">
            <form style={{ backgroundColor: '#f9f9f9', width: '100%', margin: 'auto', padding: '20px', border: '1px solid #ddd', borderRadius: '5px',height:'90%' }} onSubmit={handleSubmit}>
                <div className='row mt-3'>
                    <h1 style={{ marginTop: '-15px', color: '#0152a1' }}>Relatório De Faturamento</h1>
                    <div className='col-sm-6 mb-3'>
                        <Calendar value={dateStart} onChange={(e) => setDateStart(e.value)} showIcon placeholder="Data Inicial" locale='pt-BR' dateFormat="dd/mm/yy"  />
                    </div>
                    <div className='col-sm-6 mb-3'>
                        <Calendar style={{marginLeft:'-258px'}} value={dateEnd} onChange={(e) => setDateEnd(e.value)} showIcon placeholder="Data Final" locale='pt-BR' dateFormat="dd/mm/yy"  />
                    </div>
                </div>
                <div className='row mt-3'>
                    <div className='col-sm-3 mb-3'>
                        <Dropdown
                            value={selectedUnidade} 
                            options={unidades} 
                            onChange={handleUnidadeChange}    // Atualiza as áreas comerciais ao mudar a unidade
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
                        <Dropdown 
                            value={selectedAgencia} 
                            options={agencias} 
                            onChange={(e) => setSelectedAgencia(e.value)} 
                            placeholder="Agência" 
                            style={{width:'100%'}} 
                            showClear
                        />
                    </div>
                    <div className='col-sm-3 mb-3'>
                        <Dropdown 
                            value={selectedVendedor} 
                            options={vendedores} 
                            onChange={(e) => setSelectedVendedor(e.value)} 
                            placeholder="Vendedor"
                            style={{width:'100%'}}
                            showClear
                        />
                    </div>
                </div>
                <div className='row mt-3'>
                    <div className='col-12 d-flex justify-content-end'>
                        <Button 
                            style={{marginRight:'8px',backgroundColor:'#1d6f42',border:'none'}}
                            icon="pi pi-file-excel" 
                            onClick={handleExport}
                            className="custom-button" // Estilos adicionais, se necessário
                        />
                        <Button style={{backgroundColor:'#0152a1'}} type="submit" label="Consultar" icon="pi pi-search" />
                    </div>
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
                    >
                        <Column field="fim_tipo" header="Tipo" />
                        <Column field="tur_numerovenda" header="Num.Venda" />
                        <Column field="tur_codigo" header="Num.Pct" />
                        <Column field="fim_data" header="Data" />
                        <Column field="fim_markup" header="Markup" />
                        <Column 
                            field="fim_valorinc" 
                            header="Valor Inc" 
                            body={(rowData) => formatCurrency(rowData.fim_valorinc)} 
                        />
                         <Column 
                            field="fim_valorincajustado" 
                            header="Valor Inc Ajustado" 
                            body={(rowData) => formatCurrency(rowData.fim_valorincajustado)} 
                        />
                         <Column 
                            field="fim_valorliquido" 
                            header="Valor Líquido" 
                            body={(rowData) => formatCurrency(rowData.fim_valorliquido)} 
                        />
                        <Column field="aco_descricao" header="Comercial" />
                        <Column field="age_descricao" header="Agencia" />
                        <Column field="ven_descricao" header="Vendedor" />
                    </DataTable>
                    <div style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: '#f0f0f0', fontWeight: 'bold', padding: '10px 0' }}>
                        <div style={{marginLeft:'30px'}}>Valor Inc: {formatCurrency(soma_totais.total_valorinc)}</div>
                        <div>Valor Inc Ajustado: {formatCurrency(soma_totais.total_valorincajustado)}</div>
                        <div style={{marginRight:'30px'}}>Valor Líquido: {formatCurrency(soma_totais.total_valorliquido)}</div>
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

export default Relatorio;
