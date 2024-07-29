import { Calendar } from 'primereact/calendar';
import { FloatLabel } from 'primereact/floatlabel';
import { useEffect, useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { fetchAreaComercial } from '../../services/Api';

const Relatorio = () => {
    const [areasComerciais, setAreasComerciais] = useState([]);

    useEffect(() => {
        const getAreasComerciais = async () => {
            try {
                const data = await fetchAreaComercial();
                setAreasComerciais(data);
            } catch (error) {
                console.error('Erro ao buscar áreas comerciais:', error);
            }
        };

        getAreasComerciais();
    }, []);

    return (
        <div className='container'>
            <Row>
                <Col style={{ marginTop: '40px' }}>
                    <FloatLabel>
                        <Calendar id='calendario' showIcon />
                        <label htmlFor="calendario">Data Inicial</label>
                    </FloatLabel>
                </Col>
                <Col style={{ marginTop: '46px', marginLeft: '-300px' }}>
                    <p>Até</p>
                </Col>
                <Col style={{ marginTop: '40px', marginLeft: '-500px' }}>
                    <FloatLabel>
                        <Calendar id='calendario' showIcon />
                        <label htmlFor="calendario">Data Final</label>
                    </FloatLabel>
                </Col>
            </Row>
            <Row style={{ marginTop: '30px' }}>
                <Col>
                    <Dropdown optionLabel="name" editable placeholder="Unidade" className="w-full md:w-14rem" />
                </Col>
                <Col>
                    <Dropdown optionLabel="name" editable placeholder="Area Comercial" className="w-full md:w-14rem" />
                </Col>
                <Col>
                    <Dropdown optionLabel="name" editable placeholder="Agencia" className="w-full md:w-14rem" />
                </Col>
                <Col>
                    <Dropdown optionLabel="name" editable placeholder="Vendedor" className="w-full md:w-14rem" />
                </Col>
            </Row>
            <Row className="d-flex justify-content-center">
                <Col md="auto">
                    <Button label="Pesquisar" icon="pi pi-check" style={{ margin: 'auto', marginTop: '50px' }} />
                </Col>
            </Row>
            <Button type="button" icon="pi pi-file" data-pr-tooltip="CSV" />
            <Button type="button" icon="pi pi-file-excel" severity="success" data-pr-tooltip="XLS" />
            <Button type="button" icon="pi pi-file-pdf" severity="warning" data-pr-tooltip="PDF" />

            <DataTable value={areasComerciais} tableStyle={{ minWidth: '10rem' }}>
                <Column field="aco_codigo" header="Código" />
                <Column field="aco_descricao" header="Descrição" />
                <Column field="aco_situacao" header="Situação" />
                <Column field="aco_rateio" header="Rateio" />
                <Column field="loja_codigo.loj_descricao" header="Loja" />
            </DataTable>
        </div>
    );
};

export default Relatorio;