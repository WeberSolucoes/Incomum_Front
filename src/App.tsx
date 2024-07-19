import React from 'react';
import ContainerOutsideExample from './navbar';
import Imagem from './imagem';
import LoginForm from './login';
import './index.css';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

function MainPage() {
  return (
    <div>
      <Imagem />
      <ContainerOutsideExample />
      <LoginForm />
    </div>
  );
}

export default MainPage;
