import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './privateRoute';

// Importações corrigidas
import Login from '../pages/Login'; // ou o caminho correto para Login
import Register from '../pages/Cadastro'; // ou o caminho correto para Register
import Dashboard from '../pages/Dashboard';
import ItemsList from '../pages/Items';
import ItemDetails from '../pages/DetalhesItems';
import EditItem from '../pages/EditItems';
import AddNewItem from '../pages/AddItems';
import Movimentacao from '../pages/Movimentacao';
import MovimentacaoForm from '../pages/MovimentacaoForm';

const RouterConfig = () => {
  return (
    <Routes>
      {/* Rotas públicas */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Rotas protegidas */}
      <Route path="/dashboard" element={
        <PrivateRoute>
          <Dashboard />
        </PrivateRoute>
      } />
      <Route path="/items" element={
        <PrivateRoute>
          <ItemsList />
        </PrivateRoute>
      } />
      <Route path="/item/:id" element={
        <PrivateRoute>
          <ItemDetails />
        </PrivateRoute>
      } />
      <Route path="/item/:id/edit" element={
        <PrivateRoute>
          <EditItem />
        </PrivateRoute>
      } />
      <Route path="/add-item" element={
        <PrivateRoute>
          <AddNewItem />
        </PrivateRoute>
      } />
      <Route path="/movimentacao" element={
        <PrivateRoute>
          <Movimentacao />
        </PrivateRoute>
      } />
      <Route path="/movimentacao-form" element={
        <PrivateRoute>
          <MovimentacaoForm />
        </PrivateRoute>
      } />

      {/* Redirecionamentos */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<div>404 - Page Not Found</div>} />
    </Routes>
  );
};

export default RouterConfig;