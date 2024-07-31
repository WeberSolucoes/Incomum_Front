import React from 'react';
import '../../assets/styles/pages/404.module.css'
const NotAuthorize = () => {
    return (
      <div style={{height : '100%'}}> 
        <div className="not-found-container">
            <div className="space"></div>
            <div className="wrapper">
            <div className="img-wrapper">
                <span></span>
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