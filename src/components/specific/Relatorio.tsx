import { Calendar } from 'primereact/calendar';
import { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { MultiSelect } from 'primereact/multiselect';
import { Dropdown } from 'primereact/dropdown';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { apiGetRelatorioFindByFilter, apiGetUnidadeRelatorioByUser, apiGetAreaComercialRelatorioByUser, apiGetAgenciaRelatorioByUser, apiGetVendedorRelatorioByUser } from '../../services/Api';
import { toastError,} from '../../utils/customToast';
import axios from 'axios';


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
    const [total, setTotal] = useState(0);
    const [tableLoading, setTableLoading] = useState(false);

    useEffect(() => {
        loadDadosIniciais();
    }, []);

    const [totals, setTotals] = useState({
        totalValorInc: 0,
        totalValorIncAjustado: 0,
        totalValorLiquido: 0
    });

    const loadDadosIniciais = async () => {
        setLoading(true);
        try {
            const [unidadesResponse, areasResponse, agenciasResponse, vendedoresResponse] = await Promise.all([
                apiGetUnidadeRelatorioByUser(),
                apiGetAreaComercialRelatorioByUser(),
                apiGetAgenciaRelatorioByUser(),
                apiGetVendedorRelatorioByUser(),
            ]);

            setUnidades(unidadesResponse.data.map(item => ({ label: item.loj_descricao, value: item.loj_codigo })));
            setAreasComerciais(areasResponse.data.associacoes.map(item => ({ label: item.aco_descricao, value: item.aco_codigo })));
            setAgencias(agenciasResponse.data.valores.map(item => ({ label: item.age_descricao, value: item.age_codigo })));
            setVendedores(vendedoresResponse.data.vende.map(item => ({ label: item.ven_descricao, value: item.ven_codigo })));
        } catch (error) {
            toastError('Erro ao carregar os dados iniciais');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (event) => {
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
    
            if (response.data && Array.isArray(response.data.resultados) && response.data.resultados.length > 0) {
                setData(response.data.resultados);
                setTotal(response.data.resultados.length);
    
                // Cálculo dos totais
                const totalValorInc = response.data.resultados.reduce((sum, item) => sum + item.fim_valorinc, 0);
                const totalValorIncAjustado = response.data.resultados.reduce((sum, item) => sum + item.fim_valorincajustado, 0);
                const totalValorLiquido = response.data.resultados.reduce((sum, item) => sum + item.fim_valorliquido, 0);
    
                // Atualiza os totais como números
                setTotals({
                    totalValorInc,
                    totalValorIncAjustado,
                    totalValorLiquido,
                });
            } else {
                setData([]);
                setTotal(0);
                toastError('Nenhum resultado encontrado.');
            }
        } catch (error) {
            console.error('Erro ao realizar a consulta:', error);
            toastError('Erro ao realizar a consulta');
        } finally {
            setTableLoading(false);
        }
    };


    const handleExport = async () => {
        try {
            const response = await axios.get('http://18.118.35.25:8443/api/incomum/relatorio/download-relatorio/', {
                params: {
                    dataInicio: dateStart?.toISOString().split('T')[0], // Adicionei a formatação
                    dataFim: dateEnd?.toISOString().split('T')[0],
                    unidade: selectedUnidade, // Envia apenas a unidade selecionada
                    areaComercial: selectedAreaComercial,
                    agencia: selectedAgencia,
                    vendedor: selectedVendedor,
                },
                responseType: 'blob',
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
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const scrollToBottom = () => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    };
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    return (
        <>
        <div style={{backgroundColor:'white',borderRadius:'10px',marginTop:'-40px',padding:'inherit',width: '1100px',marginLeft: '320px', boxShadow: '10px 10px 100px rgba(0, 0, 0, 0.4),-2px -2px 6px rgba(255, 255, 255, 0.6)'}} className="container px-4">
            <form style={{ backgroundColor: '#f9f9f9', width: '100%', margin: 'auto', padding: '20px', border: '1px solid #ddd', borderRadius: '5px',height:'90%' }} onSubmit={handleSubmit}>
                <div className='row mt-3'>
                    <h1 style={{ marginTop: '-15px', color: '#0152a1' }}>Relatório</h1>
                    <div className='col-sm-6 mb-3'>
                        <Calendar value={dateStart} onChange={(e) => setDateStart(e.value)} showIcon placeholder="Data Inicial" />
                    </div>
                    <div className='col-sm-6 mb-3'>
                        <Calendar style={{marginLeft:'-258px'}} value={dateEnd} onChange={(e) => setDateEnd(e.value)} showIcon placeholder="Data Final" />
                    </div>
                </div>
                <div className='row mt-3'>
                    <div className='col-sm-3 mb-3'>
                        <Dropdown
                            value={selectedUnidade} 
                            options={unidades} 
                            onChange={(e) => setSelectedUnidade(e.value)} 
                            placeholder="Unidade"
                            style={{width:'100%'}}
                            panelStyle={{ width: '10%' }} // Largura do painel  
                        />
                    </div>
                    <div className='col-sm-3 mb-3'>
                        <MultiSelect 
                            value={selectedAreaComercial} 
                            options={areasComerciais} 
                            onChange={(e) => setSelectedAreaComercial(e.value)} 
                            placeholder="Área Comercial" 
                            display="chip" 
                            style={{width:'100%'}}
                            panelStyle={{ width: '100%' }} // Largura do painel
                        />
                    </div>
                    <div className='col-sm-3 mb-3'>
                        <Dropdown 
                            value={selectedAgencia} 
                            options={agencias} 
                            onChange={(e) => setSelectedAgencia(e.value)} 
                            placeholder="Agência" 
                            style={{width:'100%'}} 
                        />
                    </div>
                    <div className='col-sm-3 mb-3'>
                        <Dropdown 
                            value={selectedVendedor} 
                            options={vendedores} 
                            onChange={(e) => setSelectedVendedor(e.value)} 
                            placeholder="Vendedor"
                            style={{width:'100%'}}
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
                        totalRecords={total} 
                        responsiveLayout="scroll"
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
                        <div>Total:</div>
                        <div>Valor Inicial: {formatCurrency(totals.totalValorInc)}</div>
                        <div>Valor Ajustado: {formatCurrency(totals.totalValorIncAjustado)}</div>
                        <div>Valor Líquido: {formatCurrency(totals.totalValorLiquido)}</div>
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
