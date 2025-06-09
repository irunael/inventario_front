import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ItemsProvider } from './contexts/ItemsContext';
import RouterConfig from './routes';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ItemsProvider>
          <div className="App">
            <RouterConfig />
          </div>
        </ItemsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
