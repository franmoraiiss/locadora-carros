import React from 'react';
import AppRouter from './routes';
import './App.scss';

import { Sidebar } from './pages/Sidebar';

function App() {
  return (
    <div className="app">
      <Sidebar />
      <AppRouter />
    </div>
  );
}

export default App;
