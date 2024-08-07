import React from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';

function Imagem() {
  return (
    <div className="header">
      <Container fluid className="limite-pagina" style={{ marginRight: '188px', width: '100%' }}>
        <Navbar expand="lg" variant="light" className="bg-transparent">
          <Navbar.Brand href="home">
            <img src="https://incoback.com.br/static/img/logo.png" className="logo" style={{ marginLeft: '-100px', marginTop: '-650px' }} alt="Logo" />
            <img src="https://incoback.com.br/static/img/25anos.jpg" style={{ width: '115px', marginLeft: '1px', marginTop: '-650px' }} alt="25 Anos" />
          </Navbar.Brand>
          <Navbar.Text id="titulo" style={{ marginLeft: '500px', fontSize: '14px', color: '#e87717', marginTop: '-600px' }}>
            Incoback - Software de Gestão Empresarial
          </Navbar.Text>
        </Navbar>
      </Container>
    </div>
  );
}

export default Imagem;
