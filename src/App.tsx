import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importando Bootstrap
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/saga-blue/theme.css'; // Importando estilos principais do PrimeReact
import 'primeicons/primeicons.css';
import './assets/styles/base/App.css';
import LoginPage from './pages/LoginPage'
import RelatorioPage from './pages/RelatorioPage'
import PrivateRoute from './contexts/PrivateRoute';
import NaoAutorizadoPage from './pages/NaoAutorizadoPage';
import MainPage from './pages/MainPage';
import RecuperarSenha from './pages/RecuperarSenha';
import RedefinirSenha from './pages/RedefinirSenha';
function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" Component={LoginPage} />
          <Route path="/relatorio" Component={RelatorioPage} />
          <Route path="/recuperar-senha" Component={RecuperarSenha} />
          <Route path="/redefinir-senha/:uid/:token" Component={RedefinirSenha} />
          <Route path='/' Component={ MainPage}/>
          <Route path="/nao-autorizado" Component={NaoAutorizadoPage} />
        </Routes>
      </Router>

    </>
  )
}

export default App
