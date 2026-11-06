import React from 'react';
import ReactDOM from 'react-dom/client';
// Hoja de estilos de Bootstrap. Se importa una sola vez aquí y queda
// disponible para todos los componentes de react-bootstrap.
import 'bootstrap/dist/css/bootstrap.min.css';
// Íconos de Bootstrap. Se usan con <i className="bi bi-nombre-del-icono" />.
import 'bootstrap-icons/font/bootstrap-icons.css';
// Nuestros ajustes propios. Va después para poder sobrescribir a Bootstrap.
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
