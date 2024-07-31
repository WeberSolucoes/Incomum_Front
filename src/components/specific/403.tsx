import '../../assets/styles/pages/403.css';
import { useNavigate } from 'react-router-dom';
const NotAuthorize = () => {
  const navigate = useNavigate();
  return (
    <div style={{ height: '100vh' }}>
      <div className="not-found-container">
        <div className="space"></div>
        <div className="wrapper">
          <div className="img-wrapper">
            <span id='img403'></span>
          </div>
          <p>Não autorizado. <br /> Caso não esteja conseguindo acessar a página, entrar em contato com suporte.</p>

          <button type="button" onClick={(e) => { e.preventDefault(); navigate('/') }}>Voltar</button>
          <button style={{ marginLeft: '10px' }} type="button" onClick={(e) => { e.preventDefault(); navigate('/login') }}>Login</button>

        </div>
      </div>
    </div>
  );
};

export default NotAuthorize;