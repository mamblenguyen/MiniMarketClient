import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './styles/tailwind.css'; // Tailwind phải đứng trước
import './styles/index.css';    // Custom CSS sau để override


ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

