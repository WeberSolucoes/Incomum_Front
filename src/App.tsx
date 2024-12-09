import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importando Bootstrap
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/saga-blue/theme.css'; // Importando estilos principais do PrimeReact
import 'primeicons/primeicons.css';
import './assets/styles/base/App.css';
import LoginPage from './pages/LoginPage'
import PrivateRoute from './contexts/PrivateRoute';
import MainPage from './pages/MainPage';
import RecuperarSenha from './pages/RecuperarSenha';
import RedefinirSenha from './pages/RedefinirSenha';
import NotPage from './pages/404Page';
import NotAuthorizePage from './pages/403Page';
import { CodigoProvider } from './contexts/CodigoProvider';
import { AuthProvider } from './contexts/AuthProvider';
import React from 'react';
function App() {
  return (
    <AuthProvider>
      <Router basename=''>
        <CodigoProvider>
          
            <Routes>
              {/* <Route path="/" element={
                <PrivateRoute requiredPermissions={[]} element={<MainPage />} />
              } /> */}
              <Route path="/" element={<PrivateRoute element={<MainPage />} />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/recuperar-senha" element={<RecuperarSenha />} />
              <Route path="/redefinir-senha/" element={<RedefinirSenha />} />
              <Route path="/api/*" component={() => { window.location.href = '/api/incomum/'; }} />
              <Route path="/nao-autorizado" element={<NotAuthorizePage />} />
              
            </Routes>
          
        </CodigoProvider>
      </Router>
    </AuthProvider>
  );
}

export default App;
