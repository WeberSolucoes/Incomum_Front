import { Calendar } from 'primereact/calendar';
//import { FloatLabel } from 'primereact/floatlabel';
import { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { MultiSelect } from 'primereact/multiselect';
import { apiGetAgenciaRelatorioByUser, apiGetAreaComercialRelatorioByUser, apiGetRelatorioFindByFilter, apiGetUnidadeRelatorioByUser, apiGetUserId, apiGetVendedorRelatorioByUser } from '../../services/Api';



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
            handleVendedoresValues();
        }
        fetchData();
    }, []);
    useEffect(() => {
        if(selectedAreaComercial == null)
            setAreasComerciais('' as any);
        if(selectedVendedor == null)
            setVendedores('' as any);
        if(selectedAgencia == null)
            setAgencias('' as any);
    },[selectedAreaComercial,selectedAgencia,selectedVendedor])
    useEffect(() => {
        handleAreasValues();
        handleVendedoresValues();
    },[selectedUnidade])
    useEffect(() => {
        handleAgenciasValues();
    },[selectedAreaComercial])
    async function handleUnidadesValues() {
        try{
            setLoading(true);
            const response = await apiGetUnidadeRelatorioByUser(await userId);
            setUnidades(response.data.map((item: any) => ({ name: item.loj_descricao, value: item.loj_codigo })));
        }
        catch(error){
            console.log(error);
        }
        finally{
            setLoading(false);
        }
        
    }
    async function handleAreasValues() {
        try{
            setLoading(true);
            const response = await apiGetAreaComercialRelatorioByUser(await userId,selectedUnidade);
            setAreasComerciais(response.data.map((item: any) => ({ name: item.aco_descricao, value: item.aco_codigo })));
        }
        catch(error){
            console.log(error);
        }
        finally{
            setLoading(false);
        }
        
    }
    async function handleVendedoresValues() {
        try{
            setLoading(true);
            const response = await apiGetVendedorRelatorioByUser(await userId,selectedUnidade);
            setVendedores(response.data.map((item: any) => ({ name: item.first_name + " " + item.last_name, value: item.id })));
        }
        catch(error){
            console.log(error);
        }
        finally{
            setLoading(false);
        }
    }
    async function handleAgenciasValues() {
        try{
            setLoading(true);
            const response = await apiGetAgenciaRelatorioByUser(await userId,selectedAreaComercial);
            setAgencias(response.data.map((item: any) => ({ name: item.age_descricao ,value: item.age_codigo })));
        }
        catch(error){
            console.log(error);
        }
        finally{
            setLoading(false);
        }
    }
    function handleSelectionChange(name:string ,value: any) {
        if(name === 'unidade')
            setSelectedUnidade(value);
        if(name === 'areaComercial')
            setSelectedAreaComercial(value);
        if(name === 'agencia')
            setSelectedAgencia(value);
        if(name === 'vendedor')
            setSelectedVendedor(value);
    }
    async function handleSubmit() {
        const body = {
            'unidades': selectedUnidade,
            'areasComerciais': selectedAreaComercial,
            'agencias': selectedAgencia,
            'vendedores': selectedVendedor,
            'dataInicio': dateStart?.toLocaleDateString('pt-BR',{day:'2-digit',month:'2-digit',year:'numeric'}).replace(/\//g,'-'),
            'dataFim': dateEnd?.toLocaleDateString('pt-BR',{day:'2-digit',month:'2-digit',year:'numeric'}).replace(/\//g,'-')
        }
        try{
            setLoading(true);
            console.log(dateStart)
            console.log(dateEnd)
            const response = await apiGetRelatorioFindByFilter(body);
            setData(response.data);
        }
        catch(error){
            console.log(error);
        }
        finally{
            setLoading(false);
        }
    }


    return (
        <div className='container px-4'>
            <div className='row mt-5'>
                <div className='col-sm-6 mb-3'>
                    <Calendar style={{ width: '100%' }} value={dateStart} onChange={(e: any) => setDateStart(e.value)} showIcon placeholder="Data Inicial" dateFormat='dd/mm/yy' />
                </div>
                <div className='col-sm-6 mb-3'>
                    <Calendar style={{ width: '100%' }} value={dateEnd} onChange={(e: any) => setDateEnd(e.value)} showIcon placeholder="Data Final" dateFormat='dd/mm/yy' />
                </div>
            </div>
            <div className='row mt-5'>
                <div className='col-sm-3 mb-3'>
                    <MultiSelect value={selectedUnidade} style={{ width: '100%' }} showClear loading={loading}
                        options={unidades} filter emptyFilterMessage='Nenhum registro encontrado' emptyMessage='Nenhum registro encontrado'
                        onChange={(e) => handleSelectionChange('unidade',e.value)} optionLabel="name" placeholder="Unidade" className="w-full md:w-14rem" />
                </div>
                <div className='col-sm-3 mb-3'>
                    <MultiSelect value={selectedAreaComercial} style={{ width: '100%' }} showClear loading={loading}
                        options={areasComerciais} filter emptyFilterMessage='Nenhum registro encontrado' emptyMessage='Nenhum registro encontrado'
                        onChange={(e) => handleSelectionChange('areaComercial',e.value)} optionLabel="name" placeholder="Área Comercial" className="w-full md:w-14rem" />
                </div>
                <div className='col-sm-3 mb-3'>
                    <MultiSelect value={selectedAgencia} style={{ width: '100%' }} showClear loading={loading}
                        options={agencias} filter emptyFilterMessage='Nenhum registro encontrado' emptyMessage='Nenhum registro encontrado'
                        onChange={(e) => handleSelectionChange('agencia',e.value)} optionLabel="name" placeholder="Agência" className="w-full md:w-14rem" />
                </div>
                <div className='col-sm-3 mb-3'>
                    <MultiSelect value={selectedVendedor} style={{ width: '100%' }} showClear loading={loading}
                        options={vendedores} filter emptyFilterMessage='Nenhum registro encontrado' emptyMessage='Nenhum registro encontrado'
                        onChange={(e) => handleSelectionChange('vendedor',e.value)} optionLabel="name" placeholder="Vendedor" className="w-full md:w-14rem" />
                </div>
            </div>
            <div className="my-3 d-flex justify-content-center align-items-center">
                <Button className='rounded' id='pesquisar' loading={loading} label="Pesquisar" icon="pi pi-search" onClick={handleSubmit} />
            </div>
            {/* <Button type="button" icon="pi pi-file-excel" severity="success" data-pr-tooltip="CSV" /> */}

            <DataTable scrollable scrollHeight="500px" emptyMessage="Nenhum registro encontrado" value={data} tableStyle={{ minWidth: '10rem' }}>
                <Column field="fim_tipo" header="Tipo" />
                <Column field="tur_numerovenda" header="Núm. Venda" />
                <Column field="tur_codigo" header="Num. Pct" />
                <Column field="fim_valorliquido" header="Vlr Líq Venda" />
                <Column field="fim_data" header="Data" />
                <Column field="fim_markup" header="Mkp" />
                <Column field="fim_valorinc" header="Inc" />
                <Column field="fim_valorincajustado" header="Inc Ajustado" />
                <Column field="aco_descricao" header="Área Comercial" />
                <Column field="nome_loja" header="Agência" />
            </DataTable>
        </div>
    );
};

export default Relatorio;