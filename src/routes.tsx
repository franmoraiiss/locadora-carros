import { Switch, Route, BrowserRouter, Link } from 'react-router-dom';

import { Dashboard } from './pages/Dashboard';
import { Home } from './pages/Home';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <div className="sidebar">
        <div className="main-logo">
          <Link to="/" style={{ textDecoration: 'none' }}><h1>LOGO</h1></Link>        
        </div>
        <div className="menu-container">
          <nav>
            <div className="nav-button">
              <Link to="/dashboard">Dashboard</Link>
            </div>
            <div className="nav-button">
              <Link to="/users">
                <span>Usuários</span>
              </Link>
            </div>
            <div>
              <Link to="/cars"><span>Carros</span></Link>
            </div>
            <div>
              <Link to="/rent"><span>Aluguel</span></Link>
            </div>
            <div>
              <Link to="/settings"><span>Configurações</span></Link>
            </div>
          </nav>
        </div>
      </div>
      <Switch>
        <Route>
          <Switch>            
            <Route exact path="/">
              <Home />
            </Route>
            <Route path="/dashboard">
              <Dashboard />
            </Route>
          </Switch>
        </Route>
      </Switch>
    </BrowserRouter>
  );
};
