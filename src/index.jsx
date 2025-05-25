import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, HashRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './components/login.jsx';
import MainNxt from './components/mainnxt.jsx';
import Register from './components/register.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';

// dynamic router selection depending on environment var
const Router = import.meta.env.MODE === 'dev' ? BrowserRouter : HashRouter;

const container = document.getElementById('app');
const root = createRoot(container);

root.render(
  <Router>
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/main" element={<MainNxt />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  </Router>
);
