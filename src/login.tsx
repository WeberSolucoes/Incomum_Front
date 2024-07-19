import React from 'react';
import { Form, Button } from 'react-bootstrap';
import { InputText } from 'primereact/inputtext';
import 'primeicons/primeicons.css';

function LoginForm() {
  return (
    <div className="card-front" style={{ width: '440px', height: '400px', marginLeft: '380px', marginTop: '-180px' }}>
      <div className="center-wrap">
        <div className="section text-center">
          <h4 className="mb-4 pb-3" style={{ color: '#e87717' }}>Login</h4>
          <Form method="post" id="logar">
            <Form.Group>
              <span className="p-input-icon-left" style={{ display: 'flex', alignItems: 'center' }}>
                <i className="pi pi-user" style={{ color: '#e87717', marginLeft: '20px' }}></i>
                <InputText type='email' name="loginemail" className="form-style" placeholder="Email" style={{ backgroundColor: 'white', color: 'black', flex: 1 }} />
              </span>
            </Form.Group>
            <Form.Group className="mt-2">
              <span className="p-input-icon-left" style={{ display: 'flex', alignItems: 'center' }}>
                <i className="pi pi-lock" style={{ color: '#e87717', marginLeft: '20px' }}></i>
                <InputText type='password' name="loginsenha" className="form-style" placeholder="Senha" style={{ backgroundColor: 'white', color: 'black', flex: 1 }} />
              </span>
            </Form.Group>
            <Button type="submit" className="btn mt-4" style={{ color: '#e87717' }} id='login'>Login</Button>
            <p className="mb-0 mt-4 text-center"><a href="#" className="link">Esqueceu sua senha?</a></p>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
