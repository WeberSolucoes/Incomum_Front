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

const Relatorio = () => {
    const [areasComerciais] = useState([]);
    const [dateStart, setDateStart] = useState<undefined | null | Date>();
    const [dateEnd, setDateEnd] = useState<undefined | null | Date>();
    const toast = useRef(null);

    useEffect(() => {
        // Usando dados fictícios
        return
    }, []);

    const handleSubmit = () => {
        if (!dateStart || !dateEnd) {
            toastError('Preencha todos os campos obrigatórios')
            return;
        }

        // lógica de submissão aqui
        console.log('Submetido com sucesso!');
    };

    return (
        <div className='container' style={{width: '1120px'}}>
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
                    <Dropdown style={{marginBottom: '16px'}} optionLabel="name" editable placeholder="Unidade" className="w-full md:w-14rem" />
                </Col>
                <Col>
                    <Dropdown style={{marginBottom: '16px'}} optionLabel="name" editable placeholder="Area Comercial" className="w-full md:w-14rem" />
                </Col>
                <Col>
                    <Dropdown style={{marginBottom: '16px'}} optionLabel="name" editable placeholder="Agencia" className="w-full md:w-14rem" />
                </Col>
                <Col>
                    <Dropdown style={{marginBottom: '16px'}} optionLabel="name" editable placeholder="Vendedor" className="w-full md:w-14rem" />
                </Col>
            </Row>
            <Row className="d-flex justify-content-center">
                <Col md="auto">
                    <Button id='pesquisar' label="Pesquisar" icon="pi pi-search" style={{ margin: 'auto', marginTop: '50px' }} onClick={handleSubmit} />
                </Col>
            </Row>
            <Button type="button" icon="pi pi-file-excel" severity="success" data-pr-tooltip="CSV" />

            <DataTable value={areasComerciais} tableStyle={{ minWidth: '10rem' }}>
                <Column field="aco_codigo" header="Código" />
                <Column field="aco_descricao" header="Descrição" />
                <Column field="aco_situacao" header="Situação" />
                <Column field="aco_rateio" header="Rateio" />
                <Column field="loja_codigo.loj_descricao" header="Loja" />
                <Column field="loja_codigo.loj_descricao" header="Loja" />
                <Column field="loja_codigo.loj_descricao" header="Loja" />
                <Column field="loja_codigo.loj_descricao" header="Loja" />
                <Column field="loja_codigo.loj_descricao" header="Loja" />
                <Column field="loja_codigo.loj_descricao" header="Loja" />
            </DataTable>
        </div>
    );
};

export default Relatorio;