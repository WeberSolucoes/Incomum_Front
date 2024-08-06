import { Calendar } from 'primereact/calendar';
//import { FloatLabel } from 'primereact/floatlabel';
import { useEffect, useRef, useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
//import { fetchAreaComercial } from '../../services/Api';
import { Toast } from 'primereact/toast';
import { toastError} from '../../utils/customToast';
import { MultiSelect } from 'primereact/multiselect';
import { fetchFiltraUnidade, fetchRelatorioList } from '../../services/Api';




const FAKE_AGENCIAS = {
  'A1-1': [{ name: 'Agência 1-1-1', code: 'AG1-1-1' }, { name: 'Agência 1-1-2', code: 'AG1-1-2' }],
  'A2-1': [{ name: 'Agência 2-1-1', code: 'AG2-1-1' }, { name: 'Agência 2-1-2', code: 'AG2-1-2' }],
  'A3-1': [{ name: 'Agência 3-1-1', code: 'AG3-1-1' }, { name: 'Agência 3-1-2', code: 'AG3-1-2' }],
};

const FAKE_VENDEDORES = {
  'AG1-1-1': [{ name: 'Vendedor 1', code: 'V1' }, { name: 'Vendedor 2', code: 'V2' }],
  'AG2-1-1': [{ name: 'Vendedor 3', code: 'V3' }, { name: 'Vendedor 4', code: 'V4' }],
  'AG3-1-1': [{ name: 'Vendedor 5', code: 'V5' }, { name: 'Vendedor 6', code: 'V6' }],
};




const Relatorio = () => {
  const [unidades, setUnidades] = useState([]);
  const [areasComerciais, setAreasComerciais] = useState([]);
  const [agencias, setAgencias] = useState([]);
  const [vendedores, setVendedores] = useState([]);

  const [selectedUnidade, setSelectedUnidade] = useState(null);
  const [selectedAreaComercial, setSelectedAreaComercial] = useState([]);
  const [selectedAgencia, setSelectedAgencia] = useState(null);
  const [selectedVendedor, setSelectedVendedor] = useState(null);

  const [dateStart, setDateStart] = useState(null);
  const [dateEnd, setDateEnd] = useState(null);
  const [data, setData] = useState([]);

  const toast = useRef(null);

  useEffect(() => {
    const fetchInitialData = async () => {
        try {
            const response = await fetchFiltraUnidade();
            console.log('Resposta da API:', response); // Adicione um log para depuração
            setAreasComerciais(response.areas_comerciais);
            // Atualize outras partes do estado se necessário
        } catch (error) {
            console.error('Erro ao buscar áreas comerciais e unidades', error);
        }
    };

    fetchInitialData();
  }, []);


  const handleSelectionChange = (type, value) => {
      switch (type) {
          case 'unidade':
              setSelectedUnidade(value);
              setAreasComerciais(value ? FAKE_AREAS_COMERCIAIS[value.code] || [] : []);
              setSelectedAreaComercial([]);
              setAgencias([]);
              setSelectedAgencia(null);
              setVendedores([]);
              setSelectedVendedor(null);
              break;
          case 'areaComercial':
              setSelectedAreaComercial(value);
              setAgencias(value.length > 0 ? FAKE_AGENCIAS[value[0].code] || [] : []);
              setSelectedAgencia(null);
              setVendedores([]);
              setSelectedVendedor(null);
              break;
          case 'agencia':
              setSelectedAgencia(value);
              setVendedores(value ? FAKE_VENDEDORES[value.code] || [] : []);
              setSelectedVendedor(null);
              break;
          case 'vendedor':
              setSelectedVendedor(value);
              break;
          default:
              break;
      }
  };

  const handleSubmit = async () => {
      if (!dateStart || !dateEnd) {
          toastError('Selecione a data inicial e final');
          return;
      }

      try {
          const formattedDateStart = dateStart.toISOString().split('T')[0];
          const formattedDateEnd = dateEnd.toISOString().split('T')[0];

          const response = await fetchRelatorioList({
              dateStart: formattedDateStart,
              dateEnd: formattedDateEnd,
              unidade: selectedUnidade ? selectedUnidade.code : null,
              areaComercial: selectedAreaComercial.length > 0 ? selectedAreaComercial.map(area => area.code) : null,
              agencia: selectedAgencia ? selectedAgencia.code : null,
              vendedor: selectedVendedor ? selectedVendedor.code : null,
          });

          console.log('Dados recebidos da API:', response.data);
          setData(response.data);
      } catch (error) {
          toastError('Erro ao buscar dados');
      }
  };

  return (
      <div className='container' style={{ width: '1120px' }}>
          <Toast ref={toast} />
          <Row>
              <Col style={{ marginTop: '40px' }}>
                  <Calendar value={dateStart} onChange={(e) => setDateStart(e.target.value)} showIcon placeholder="Data Inicial" />
              </Col>
              <Col style={{ marginTop: '40px' }}>
                  <Calendar style={{ marginLeft: '-280px' }} value={dateEnd} onChange={(e) => setDateEnd(e.target.value)} showIcon placeholder="Data Final" />
              </Col>
          </Row>
          <Row style={{ marginTop: '30px' }}>
              <Col>
                  <Dropdown value={selectedUnidade}
                      options={unidades}
                      onChange={(e) => handleSelectionChange('unidade', e.value)} style={{ marginBottom: '16px' }} optionLabel="name" editable placeholder="Unidade" className="w-full md:w-14rem" />
              </Col>
              <Col>
                  <MultiSelect value={selectedAreaComercial}
                      options={areasComerciais}
                      onChange={(e) => handleSelectionChange('areaComercial', e.value)} style={{ marginBottom: '16px', width: '236px' }} optionLabel="name" editable placeholder="Área Comercial" className="w-full md:w-14rem" />
              </Col>
              <Col>
                  <Dropdown value={selectedAgencia}
                      options={agencias}
                      onChange={(e) => handleSelectionChange('agencia', e.value)} style={{ marginBottom: '16px' }} optionLabel="name" editable placeholder="Agência" className="w-full md:w-14rem" />
              </Col>
              <Col>
                  <Dropdown value={selectedVendedor}
                      options={vendedores}
                      onChange={(e) => handleSelectionChange('vendedor', e.value)} style={{ marginBottom: '16px' }} optionLabel="name" editable placeholder="Vendedor" className="w-full md:w-14rem" />
              </Col>
          </Row>
          <Row className="d-flex justify-content-center">
              <Col md="auto">
                  <Button id='pesquisar' label="Pesquisar" icon="pi pi-search" style={{ margin: 'auto', marginTop: '50px' }} onClick={handleSubmit} />
              </Col>
          </Row>
          <Button type="button" icon="pi pi-file-excel" severity="success" data-pr-tooltip="CSV" />

          <DataTable value={data} tableStyle={{ minWidth: '10rem' }}>
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