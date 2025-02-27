import React from 'react';
import ReactDOM from 'react-dom/client'; // Utilisez react-dom/client pour React 18
import { Provider } from 'react-redux'; // Importez Provider depuis react-redux

import './index.css';
import App from './main.tsx';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root')); // Utilisez createRoot pour React 18

root.render(
  <React.StrictMode>
        <App />
  </React.StrictMode>
);

reportWebVitals();
