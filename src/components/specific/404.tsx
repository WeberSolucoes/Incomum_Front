import React from 'react';
import '../../assets/styles/pages/404.css';
const NotFound = () => {
  return (
    <div style={{ height: '100vh' }}>
      <div className="not-found-container">
        <div className="space"></div>
        <div className="wrapper">
          <div className="img-wrapper">
            <span id='img404'></span>
          </div>
          <p>Página não encontrada. <br /> Caso não esteja conseguindo acessar a página, entrar em contato com suporte.</p>
          <a href="/">
            <button type="button">Voltar</button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotFound;