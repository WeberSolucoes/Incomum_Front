import React from 'react';
import '../../assets/styles/pages/403.css';
const NotAuthorize = () => {
  return (
    <div style={{ height: '100vh' }}>
      <div className="not-found-container">
        <div className="space"></div>
        <div className="wrapper">
          <div className="img-wrapper">
            <span id='img403'></span>
          </div>
          <p>Não autorizado. <br /> Caso não esteja conseguindo acessar a página, entrar em contato com suporte.</p>
          <a href="/">
            <button type="button">Voltar</button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotAuthorize;