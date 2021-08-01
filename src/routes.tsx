import { Switch, Route, BrowserRouter, NavLink } from 'react-router-dom';

import { Home } from './pages/Home';
import { Users } from './pages/Users';
import { Cars } from './pages/Cars';
import { Clients } from './pages/Clients';
import { Rent } from './pages/Rent';

const pages = [
  {
    name: 'Usuários',
    address: '/users',    
  },
  {
    name: 'Carros',
    address: '/cars',    
  },
  {
    name: 'Clientes',
    address: '/clients',    
  },
  {
    name: 'Aluguel',
    address: '/rent'
  }
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
            <Route path="/users">
              <Users />
            </Route>
            <Route path="/cars">
              <Cars />
            </Route>
            <Route path="/clients">
              <Clients />
            </Route>
            <Route path="/rent">
              <Rent />
            </Route>
          </Switch>
        </Route>
      </Switch>
    </BrowserRouter>
  );
};
