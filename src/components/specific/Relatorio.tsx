import { Calendar } from 'primereact/calendar';
//import { FloatLabel } from 'primereact/floatlabel';
import { useEffect, useState } from 'react';
import { Paginator } from 'primereact/paginator';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { MultiSelect } from 'primereact/multiselect';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import {
    apiGetAgenciaRelatorioByUser,
    apiGetAreaComercialRelatorioByUser,
    apiGetRelatorioFindByFilter,
    apiGetTotalRelatorio,
    apiGetUnidadeRelatorioByUser,
    apiGetUserId,
    apiGetVendedorRelatorioByUser
} from '../../services/Api';
import { pt_br } from '../../utils/Locale';
import { toastError, toastWarning } from '../../utils/customToast';




const Relatorio = () => {
    const [userId] = useState<Promise<number>>(async (): Promise<number> => {
        const responseUserId = await apiGetUserId();
        return responseUserId.data.id
    });

    const [unidades, setUnidades] = useState([]);
    const [areasComerciais, setAreasComerciais] = useState([]);
    const [agencias, setAgencias] = useState([]);
    const [vendedores, setVendedores] = useState([]);

    const [selectedUnidade, setSelectedUnidade] = useState(null);
    const [selectedAreaComercial, setSelectedAreaComercial] = useState([]);
    const [selectedAgencia, setSelectedAgencia] = useState(null);
    const [selectedVendedor, setSelectedVendedor] = useState(null);

    const [loading, setLoading] = useState(false);
    const [tableLoading, setTableLoading] = useState(false);
    const [page, setPage] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(10);
    const [total, setTotal] = useState(0);

    const [totalData, setTotalData] = useState<any>([]);

    const [dateStart, setDateStart] = useState<Date | null>(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
    const [dateEnd, setDateEnd] = useState<Date | null>(new Date());
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            // puxar as unidades
            handleUnidadesValues();
            // puxar areas
            handleAreasValues();
            // puxar agencias
            handleAgenciasValues();
            // puxar vendedores
            // handleVendedoresValues();
        }
        fetchData();
    }, []);
    useEffect(() => {
        if (selectedAreaComercial == null)
            setAreasComerciais('' as any);
        if (selectedVendedor == null)
            setVendedores('' as any);
        if (selectedAgencia == null)
            setAgencias('' as any);
        setPage(0);
    }, [selectedAreaComercial, selectedAgencia, selectedVendedor, selectedUnidade])
    useEffect(() => {
        handleAreasValues();
    }, [selectedUnidade])
    useEffect(() => {
        handleAgenciasValues();
    }, [selectedAreaComercial])
    useEffect(() => {
        setPage(page);
        handleSubmit();
    }, [page, pageSize]);
    async function handleUnidadesValues() {
        try {
            setLoading(true);
            const response = await apiGetUnidadeRelatorioByUser(await userId);
            setUnidades(response.data.map((item: any) => ({ name: item.loj_descricao, value: item.loj_codigo })));
        }
        catch (error: any) {
            toastError(error.message);
        }
        finally {
            setLoading(false);
        }

    }
    async function handleAreasValues() {
        try {
            setLoading(true);
            const response = await apiGetAreaComercialRelatorioByUser(await userId, selectedUnidade);
            setAreasComerciais(response.data.map((item: any) => ({ name: item.aco_descricao, value: item.aco_codigo })));
        }
        catch (error: any) {
            toastError(error.message);
        }
        finally {
            setLoading(false);
        }

    }
    async function handleVendedoresValues() {
        try {
            setLoading(true);
            const response = await apiGetVendedorRelatorioByUser(await userId, selectedUnidade);
            setVendedores(response.data.map((item: any) => ({ name: item.first_name + " " + item.last_name, value: item.id })));
        }
        catch (error: any) {
            toastError(error.message);
        }
        finally {
            setLoading(false);
        }
    }
    async function handleAgenciasValues() {
        try {
            setLoading(true);
            const response = await apiGetAgenciaRelatorioByUser(await userId, selectedAreaComercial);
            setAgencias(response.data.map((item: any) => ({ name: item.age_descricao, value: item.age_codigo })));
        }
        catch (error: any) {
            toastError(error.message);
        }
        finally {
            setLoading(false);
        }
    }
    function handleSelectionChange(name: string, value: any) {
        if (name === 'unidade')
            setSelectedUnidade(value);
        if (name === 'areaComercial')
            setSelectedAreaComercial(value);
        if (name === 'agencia')
            setSelectedAgencia(value);
        if (name === 'vendedor')
            setSelectedVendedor(value);
    }
    function handlePageChange(e: any) {
        setPage(e.page);
        setPageSize(e.rows);
    }
    async function handleSubmit() {
        const body = {
            'unidades': selectedUnidade,
            'areasComerciais': selectedAreaComercial,
            'agencias': selectedAgencia,
            'vendedores': selectedVendedor,
            'dataInicio': dateStart?.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-'),
            'dataFim': dateEnd?.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-'),
            'page': page + 1,
            'pageSize': pageSize,
            'usuario_id': await userId
        }
        try {
            setTableLoading(true);
            const response = await apiGetRelatorioFindByFilter(body);
            console.log(response.data);
            const totalResponse = await apiGetTotalRelatorio(body);
            setTotal(response.data.count);
            setData(response.data.results);
            setTotalData(totalResponse.data);
        }
        catch (error: any) {
            if (error.code == "ECONNABORTED") {
                toastWarning("O servidor demorou para responder. Tente novamente mais tarde");
            }
        }
        finally {
            setTableLoading(false);
        }
    }

    const exportToExcel = async () => {
      try {
          const dataInicio = dateStart?.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-');
          const dataFim = dateEnd?.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-');
          const pageSize = 10; // Ajuste conforme necessário
          let page = 1;
          let allData: any[] = [];
          let hasMoreData = true;
  
          while (hasMoreData) {
              const response = await apiGetRelatorioFindByFilter({
                  dataInicio,
                  dataFim,
                  unidade: selectedUnidade,
                  areaComercial: selectedAreaComercial,
                  agencia: selectedAgencia,
                  vendedor: selectedVendedor,
                  pageSize,
                  page,
                  export: 'true' // Indicador de que estamos exportando
              });
  
              const data = response.data.results || response.data; // Ajuste conforme o formato da resposta
              allData = allData.concat(data);
              hasMoreData = data.length === pageSize;
              page++;
          }
  
          // Criar o workbook e adicionar a worksheet
          const wb = XLSX.utils.book_new();
          const ws = XLSX.utils.json_to_sheet(allData);
          XLSX.utils.book_append_sheet(wb, ws, 'Relatório');
  
          // Gerar o blob e iniciar o download
          const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
          const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          saveAs(blob, 'relatorio.xlsx');
  
      } catch (error) {
          console.error('Erro ao exportar para Excel:', error);
      }
  };


    return (
        <>
            <div className='container px-4'>

                <div className='row mt-3'>
                    <h1>Relatório</h1>
                    <div className='col-sm-6 mb-3'>
                        <Calendar locale={pt_br} style={{ width: '100%' }} value={dateStart} onChange={(e: any) => setDateStart(e.value)} showIcon placeholder="Data Inicial" dateFormat='dd/mm/yy' />
                    </div>
                    <div className='col-sm-6 mb-3'>
                        <Calendar locale={pt_br} style={{ width: '100%' }} value={dateEnd} onChange={(e: any) => setDateEnd(e.value)} showIcon placeholder="Data Final" dateFormat='dd/mm/yy' />
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
                <div className="my-3 d-flex justify-content-end align-items-center">
                    <Button className='rounded' id='pesquisar' loading={tableLoading} label="Pesquisar" icon="pi pi-search" onClick={handleSubmit} />
                </div>
                <div className='d-flex justify-content-between align-items-center gap-3'>
                    <div></div>
                    <div className='d-flex gap-4'>
                        {<h5>Total Liquido: {totalData.total_valorliquido}</h5>}
                        {<h5>Total Inc: {totalData.total_valorinc}</h5>}
                        {<h5>Total Inc Ajustado: {totalData.total_valorincajustado}</h5>}
                    </div>
                    <Button className='rounded' type="button" icon="pi pi-file-excel" severity="success" data-pr-tooltip="CSV" onClick={exportToExcel} />
                </div>

                <DataTable removableSort loading={tableLoading} scrollable scrollHeight="500px" emptyMessage="Nenhum registro encontrado" value={data} tableStyle={{ minWidth: '10rem' }}>
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
                <Paginator first={page * pageSize} rows={pageSize} totalRecords={total} rowsPerPageOptions={[5, 10, 20, 30]} onPageChange={handlePageChange} />
            </div>
        </>
    );
};

export default Relatorio;