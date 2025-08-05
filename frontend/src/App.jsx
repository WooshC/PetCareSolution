import React from 'react';
import AppRouter from './router/AppRouter';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <React.StrictMode>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </React.StrictMode>
  );
}

export default App;
