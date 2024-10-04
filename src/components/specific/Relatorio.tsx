import { Calendar } from 'primereact/calendar';
//import { FloatLabel } from 'primereact/floatlabel';
import { useEffect, useState } from 'react';
import { Paginator } from 'primereact/paginator';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { MultiSelect } from 'primereact/multiselect';
import {
    apiGetAgenciaRelatorioByUser,
    apiGetAreaComercialRelatorioByUser,
    apiGetDownloadRelatorio,
    apiGetRelatorioFindByFilter,
    apiGetTotalRelatorio,
    apiGetUnidadeRelatorioByUser,
    apiGetUserId,
    apiGetVendedorRelatorioByUser
} from '../../services/Api';
import { pt_br } from '../../utils/Locale';
import { toastError, toastWarning } from '../../utils/customToast';


const Relatorio = () => {
    const [unidades, setUnidades] = useState([]);
    const [areasComerciais, setAreasComerciais] = useState([]);
    const [agencias, setAgencias] = useState([]);
    const [vendedores, setVendedores] = useState([]);

    const [selectedUnidade, setSelectedUnidade] = useState([]);
    const [selectedAreaComercial, setSelectedAreaComercial] = useState([]);
    const [selectedAgencia, setSelectedAgencia] = useState([]);
    const [selectedVendedor, setSelectedVendedor] = useState([]);

    const [loading, setLoading] = useState(false);
    const [dateStart, setDateStart] = useState(null);
    const [dateEnd, setDateEnd] = useState(null);
    const [data, setData] = useState([]);
    const [total, setTotal] = useState(0);
    const [tableLoading, setTableLoading] = useState(false);

    useEffect(() => {
        loadDadosIniciais();
    }, []);

    const loadDadosIniciais = async () => {
        try {
            setLoading(true);
            const [unidadesResponse, areasResponse, agenciasResponse, vendedoresResponse] = await Promise.all([
                apiGetUnidadeRelatorioByUser(),
                apiGetAreaComercialRelatorioByUser(),
                apiGetAgenciaRelatorioByUser(),
                apiGetVendedorRelatorioByUser(),
            ]);
    
            console.log('Respostas da API:', { 
                unidadesResponse, 
                areasResponse, 
                agenciasResponse, 
                vendedoresResponse 
            });
    
            // Mapear e extrair apenas os valores desejados
            setUnidades(unidadesResponse.data.map(item => ({ label: item.loj_descricao, value: item.loj_codigo })));
            setAreasComerciais(areasResponse.data.map(item => ({ label: item.aco_descricao, value: item.aco_codigo })));
            setAgencias(agenciasResponse.data.map(item => ({ label: item.age_descricao, value: item.age_codigo })));
            setVendedores(vendedoresResponse.data.map(item => ({ label: item.ven_descricao, value: item.ven_codigo })));
        } catch (error) {
            toastError('Erro ao carregar os dados iniciais');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setData([]);

        // Verifica se as datas são válidas
        if (!dateStart || !dateEnd) {
            toastError('As datas de início e fim são obrigatórias.');
            return;
        }

        const params = {
            dataInicio: dateStart.toISOString().split('T')[0],
            dataFim: dateEnd.toISOString().split('T')[0],
            unidades: selectedUnidade.length > 0 ? selectedUnidade : [],
            areasComerciais: selectedAreaComercial.length > 0 ? selectedAreaComercial : [],
            agencias: selectedAgencia.length > 0 ? selectedAgencia : [],
            vendedores: selectedVendedor.length > 0 ? selectedVendedor : [],
        };

        console.log('Parâmetros enviados para a API:', params);

        try {
            setTableLoading(true);
            const response = await apiGetRelatorioFindByFilter(params);

            if (Array.isArray(response.data) && response.data.length > 0) {
                setData(response.data);
                setTotal(response.data.length);
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


    return (
        <>
            <div style={{backgroundColor:'white',borderRadius:'10px',marginTop:'-40px',padding:'inherit',width: '1000px',marginLeft: '300px'}} className='container px-4'>
                <form style={{ backgroundColor: '#f9f9f9', width: '100%', margin: 'auto', padding: '20px', border: '1px solid #ddd', borderRadius: '5px',height:'90%' }} action="">
                    <div className='row mt-3'>
                        <h1 style={{marginTop:'-15px',color:'#0152a1'}}>Relatório</h1>
                        <div className='col-sm-6 mb-3'>
                            <Calendar locale={pt_br} style={{ width: '100%',marginTop:'15px' }} value={dateStart} onChange={(e: any) => setDateStart(e.value)} showIcon placeholder="Data Inicial" dateFormat='dd/mm/yy' className="custom-calendar"  />
                        </div>
                        <div className='col-sm-6 mb-3'>
                            <Calendar locale={pt_br} style={{ width: '100%', marginTop:'15px' }} value={dateEnd} onChange={(e: any) => setDateEnd(e.value)} showIcon placeholder="Data Final" dateFormat='dd/mm/yy' className="custom-calendar"  />
                        </div>
                    </div>
                    <div className='row mt-3'>
                        <div className='col-sm-3 mb-3'>
                            <MultiSelect value={selectedUnidade} style={{ width: '100%' }} showClear loading={loading}
                                options={unidades} filter emptyFilterMessage='Nenhum registro encontrado' emptyMessage='Nenhum registro encontrado'
                                onChange={(e) => handleSelectionChange('unidade', e.value)} optionLabel="name" placeholder="Unidade" className="w-full md:w-14rem" />
                        </div>
                        <div className='col-sm-3 mb-3'>
                            <MultiSelect value={selectedAreaComercial} style={{ width: '100%' }} showClear loading={loading}
                                options={areasComerciais} filter emptyFilterMessage='Nenhum registro encontrado' emptyMessage='Nenhum registro encontrado'
                                onChange={(e) => handleSelectionChange('areaComercial', e.value)} optionLabel="name" placeholder="Área Comercial" className="w-full md:w-14rem" />
                        </div>
                        <div className='col-sm-3 mb-3'>
                            <MultiSelect value={selectedAgencia} style={{ width: '100%' }} showClear loading={loading}
                                options={agencias} filter emptyFilterMessage='Nenhum registro encontrado' emptyMessage='Nenhum registro encontrado'
                                onChange={(e) => handleSelectionChange('agencia', e.value)} optionLabel="name" placeholder="Agência" className="w-full md:w-14rem" />
                        </div>
                        <div className='col-sm-3 mb-3'>
                            <MultiSelect value={selectedVendedor} style={{ width: '100%' }} showClear loading={loading} onClick={handleVendedoresValues}
                                options={vendedores} filter emptyFilterMessage='Nenhum registro encontrado' emptyMessage='Nenhum registro encontrado'
                                onChange={(e) => handleSelectionChange('vendedor', e.value)} optionLabel="name" placeholder="Vendedor" className="w-full md:w-14rem" />
                        </div>
                    </div>
                    <div className="row my-3 d-flex justify-content-end align-items-center">
                        <Button style={{margin:'auto',backgroundColor:'#0152a1'}} className='rounded col-sm-2 mb-3' id='pesquisar' loading={tableLoading} label="Pesquisar" icon="pi pi-search" onClick={handleSubmit} />
                    </div>
                    <DataTable removableSort loading={tableLoading} scrollable scrollHeight="500px" emptyMessage="Nenhum registro encontrado" value={data} tableStyle={{ minWidth: '10rem' }} paginator rows={10} totalRecords={total} >
                        <Column sortable field="fim_tipo" header="Tipo" />
                        <Column sortable field="tur_numerovenda" header="Núm. Venda" />
                        <Column sortable field="tur_codigo" header="Num. Pct" />
                        <Column sortable field="fim_valorliquido" header="Vlr Líq Venda" />
                        <Column sortable field="fim_data" header="Data" />
                        <Column sortable field="fim_markup" header="Mkp" />
                        <Column sortable field="fim_valorinc" header="Inc" />
                        <Column sortable field="fim_valorincajustado" header="Inc Ajustado" />
                        <Column sortable field="aco_descricao" header="Área Comercial" />
                        <Column sortable field="nome_loja" header="Agência" />
                        <Column sortable field="ven_descricao" header="Vendedor" />
                    </DataTable>
                </form>
            </div>
        </>
    );
};

export default Relatorio;
