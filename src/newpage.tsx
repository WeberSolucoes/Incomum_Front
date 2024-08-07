import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './App.css';
import './cadastro.css';
import './agencia.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import CadastroForm from './cadastro';

function Sidebar() {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const closeNav = () => {
    // Implemente a lógica para fechar o sidebar se necessário
  };

  return (
    <>
      <div>
        <Navbar expand="lg" className="bg-body-tertiary fixed-top w-100" id='navbar'>
          <Container>
            <Navbar.Brand href="#"></Navbar.Brand>
          </Container>
        </Navbar>
      </div>
      <div id="mySidebar" className="sidebar">
        <a href="javascript:void(0)" className="closebtn" onClick={closeNav} style={{ marginTop: '40px' }}>&times;</a>
        <img src="https://incoback.com.br/static/img/logo.png" className="logo" alt="Logo" style={{ marginLeft: '5px', width: '240px', marginTop: '70px' }} />
        <ul className="list-unstyled ps-0">
          <li style={{ marginTop: '30px' }} className="mb-1">
            <i className="pi pi-home" style={{ color: '#e87717', position: 'relative', marginRight: '190px', marginBottom: '5px', fontSize: '22px' }}></i>
            <Link to="/logado" style={{ marginTop: '-46px', marginLeft: '14px', height: '49.6px', color: '#0152a1' }}>
              <button style={{ color: '#0152a1', marginLeft: '12px' }} className="btn btn-toggle align-items-center rounded collapsed">
                Home
              </button>
            </Link>
          </li>
          <li className="mb-1">
            <i className="pi pi-upload" style={{ color: '#e87717', position: 'relative', marginRight: '190px', marginTop: '18px', fontSize: '22px' }}></i>
            <button style={{ marginTop: '-52px', marginLeft: '38px', height: '49.6px', color: '#0152a1' }} className="btn btn-toggle align-items-center rounded collapsed" onClick={() => toggleSection('cadastro')}>
              Cadastro
            </button>
            {openSection === 'cadastro' && (
              <div className="collapse show">
                <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                  <li><Link to="/agencia" className="link-dark rounded" style={{ color: '#0152a1',marginLeft : '-130px',fontFamily : 'Poppins, sans-serif' }}>Agência</Link></li>
                  <li><Link to="/agencia" className="link-dark rounded" style={{ color: '#0152a1',marginLeft : '-120px',fontFamily : 'Poppins, sans-serif',marginTop : '1px' }}>Vendedor</Link></li>
                </ul>
              </div>
            )}
          </li>
          <li className="mb-1">
            <i className="pi pi-cloud-upload" style={{ color: '#e87717', position: 'relative', marginRight: '190px', marginTop: '4px', fontSize: '22px' }}></i>
            <button style={{ marginTop: '-52px', marginLeft: '38px', height: '49.6px', color: '#0152a1' }} className="btn btn-toggle align-items-center rounded collapsed" onClick={() => toggleSection('lancamentos')}>
              Lançamentos
            </button>
            {openSection === 'lancamentos' && (
              <div className="collapse show">
                <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                  <li><a href="#" className="link-dark rounded" style={{ color: '#0152a1',fontFamily : 'Poppins, sans-serif' }}>Opção</a></li>
                </ul>
              </div>
            )}
          </li>
          <li className="mb-1">
            <i className="pi pi-dollar" style={{ color: '#e87717', position: 'relative', marginRight: '190px', marginTop: '4px', fontSize: '22px' }}></i>
            <button style={{ marginTop: '-52px', marginLeft: '38px', height: '49.6px', color: '#0152a1' }} className="btn btn-toggle align-items-center rounded collapsed" onClick={() => toggleSection('financeiro')}>
              Financeiro
            </button>
            {openSection === 'financeiro' && (
              <div className="collapse show">
                <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                  <li><a href="#" className="link-dark rounded" style={{ color: '#0152a1',fontFamily : 'Poppins, sans-serif' }}>Opção</a></li>
                </ul>
              </div>
            )}
          </li>
          <li className="mb-1">
            <i className="pi pi-briefcase" style={{ color: '#e87717', position: 'relative', marginRight: '190px', marginTop: '4px', fontSize: '22px' }}></i>
            <button style={{ marginTop: '-52px', marginLeft: '38px', height: '49.6px', color: '#0152a1' }} className="btn btn-toggle align-items-center rounded collapsed" onClick={() => toggleSection('gerencial')}>
              Gerencial
            </button>
            {openSection === 'gerencial' && (
              <div className="collapse show">
                <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small" style={{marginLeft : '120px'}}>
                  <li><Link to="/faturamento" className="link-dark rounded" style={{ color: '#0152a1',marginLeft : '-160px',fontFamily : 'Poppins, sans-serif' }}>Faturamento Unidade</Link></li>
                  <li><Link to="/faturamento_comercial" className="link-dark rounded" style={{ color: '#0152a1',fontFamily : 'Poppins, sans-serif',marginTop : '1px' }}>Faturamento Comercial</Link></li>
                  <li><Link to="/faturamento_vendedor" className="link-dark rounded" style={{ color: '#0152a1',fontFamily : 'Poppins, sans-serif',marginTop : '1px' }}>Faturamento Vendedor</Link></li>
                </ul>
              </div>
            )}
          </li>
          <li className="mb-1">
            <i className="pi pi-receipt" style={{ color: '#e87717', position: 'relative', marginRight: '190px', marginTop: '4px', fontSize: '22px' }}></i>
            <button style={{ marginTop: '-52px', marginLeft: '38px', height: '49.6px', color: '#0152a1' }} className="btn btn-toggle align-items-center rounded collapsed" onClick={() => toggleSection('relatorios')}>
              Relatórios
            </button>
            {openSection === 'relatorios' && (
              <div className="collapse show">
                <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small" style={{marginLeft : '120px'}}>
                  <li><Link to="/relatorio" className="link-dark rounded" style={{ color: '#0152a1',fontFamily : 'Poppins, sans-serif' }}>Simplificado de Vendas</Link></li>
                </ul>
              </div>
            )}
          </li>
        </ul>
      </div>
      <CadastroForm/>
    </>
  );
}

export default Sidebar;
