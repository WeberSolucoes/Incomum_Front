import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import 'react-toastify/dist/ReactToastify.css';
import ToastContainer from './contexts/ToastContainer.tsx';
import { AuthProvider } from './contexts/AuthProvider.tsx';
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
      <ToastContainer />
    </AuthProvider>
  </React.StrictMode>,
)
