import { Switch, Route, BrowserRouter, NavLink } from 'react-router-dom';

import { Dashboard } from './pages/Dashboard';
import { Home } from './pages/Home';
import { Users } from './pages/Users';
import { Cars } from './pages/Cars';

const pages = [
  {
    name: 'Dashboard',
    address: '/dashboard',    
  },
  {
    name: 'Usuários',
    address: '/users',    
  },
  {
    name: 'Carros',
    address: '/cars',    
  },
]

export default function AppRouter() {
  return (
    <BrowserRouter>
      <div className="sidebar">
        <div className="main-logo">
          <NavLink to="/"><img src="/localiza-logo.png" alt="" /></NavLink>        
        </div>
        <div className="menu-container">
          <nav>
            {pages.map((page, index) => {
              return (
                <div className="nav-button" key={index}>
                  <NavLink 
                    exact 
                    to={page.address}                    
                  >
                    {page.name}
                  </NavLink>
                </div>
              );
            })}
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
            <Route path="/users">
              <Users />
            </Route>
            <Route path="/cars">
              <Cars />
            </Route>
          </Switch>
        </Route>
      </Switch>
    </BrowserRouter>
  );
};
