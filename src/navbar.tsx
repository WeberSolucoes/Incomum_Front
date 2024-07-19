import React from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';

function ContainerOutsideExample() {
  return (
    <div>
      <Navbar expand="lg" className="bg-body-tertiary fixed-top w-100" id='teste'>
        <Container>
          <Navbar.Brand href="#"></Navbar.Brand>
        </Container>
      </Navbar>
    </div>
  );
}

export default ContainerOutsideExample;