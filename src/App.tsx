import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importando Bootstrap
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/saga-blue/theme.css'; // Importando estilos principais do PrimeReact
import 'primeicons/primeicons.css';
import './assets/styles/base/App.css';
import LoginPage from './pages/LoginPage'
import RelatorioPage from './pages/RelatorioPage'
//import PrivateRoute from './contexts/PrivateRoute';
import MainPage from './pages/MainPage';
import RecuperarSenha from './pages/RecuperarSenha';
import RedefinirSenha from './pages/RedefinirSenha';
import NotPage from './pages/404Page';
import NotAuthorizePage from './pages/403Page';
function App() {
  return (
    <Router basename=''>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/relatorio" element={<RelatorioPage />} />
        <Route path="/recuperar-senha" element={<RecuperarSenha />} />
        <Route path="/redefinir-senha/:uid/:token" element={<RedefinirSenha />} />

        <Route path="/nao-autorizado" element={<NotAuthorizePage />} />
        <Route path="*" element={<NotPage />} /> {/* Rota 404 */}
      </Routes>
    </Router>
  );
}

export default App;