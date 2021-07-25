import { Switch, Route, BrowserRouter } from 'react-router-dom';

import { Dashboard } from './pages/Dashboard';
import { Home } from './pages/Home';

export default function AppRouter() {
  return (
    <BrowserRouter>
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
