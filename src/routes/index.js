import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import routes from './routes';
import PrivateRoute from './privateRoute';

// Importações diretas
import Login from '../pages/Cadastro';
import Dashboard from '../pages/Dashboard';
import ItemsList from '../pages/Items';
import ItemDetails from '../pages/DetalhesItems';
import EditItem from '../pages/EditItems';
import AddNewItem from '../pages/AddItems';
import MovimentacaoForm from '../pages/MovimentacaoForm';
import Movimentacao from '../pages/Movimentacao'; // Importe a página de visualização
import MovEdit from '../pages/MovEdit'; // Importe a página de edição

const RouterConfig = () => {
  return (
    <Routes>
      {routes.map((route, index) => {
        const Component = {
          Login,
          Dashboard,
          ItemsList,
          ItemDetails,
          EditItem,
          AddNewItem,
          MovimentacaoForm,
          Movimentacao, // Adicione ao objeto de componentes
          MovEdit // Adicione ao objeto de componentes
        }[route.component];
        
        return (
          <Route
            key={index}
            path={route.path}
            element={
              route.auth ? (
                <PrivateRoute>
                  <Component />
                </PrivateRoute>
              ) : (
                <Component />
              )
            }
          />
        );
      })}
      
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<div>404 - Page Not Found</div>} />
    </Routes>
  );
};

export default RouterConfig;