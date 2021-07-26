import { Switch, Route, BrowserRouter, Link, NavLink } from 'react-router-dom';

import { Dashboard } from './pages/Dashboard';
import { Home } from './pages/Home';
import { Users } from './pages/Users';

const pages = [
  {
    name: 'Dashboard',
    address: '/dashboard'
  },
  {
    name: 'Users',
    address: '/users'
  },
]

export default function AppRouter() {
  return (
    <BrowserRouter>
      <div className="sidebar">
        <div className="main-logo">
          <Link to="/"><img src="/xicodes-logo.png" alt="" /></Link>        
        </div>
        <div className="menu-container">
          <nav>
            {pages.map((page) => {
              return (
                <div className="nav-button">
                  <NavLink 
                    exact to={page.address}                    
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
          </Switch>
        </Route>
      </Switch>
    </BrowserRouter>
  );
};
