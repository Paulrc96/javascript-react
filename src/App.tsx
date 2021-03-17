import {
  BrowserRouter as Router,
  Link, Route, Switch
} from 'react-router-dom';
import './App.css';
import MutationTest from './MutationTest';
import QueryTest from './QueryTest';

function App() {  
  return (
    <Router>
      <div className="nav-bar">
        <Link to="/">QUERY TEST</Link>
        <Link to="/mutation" className="right-item">MUTACI&Oacute;N</Link>
      </div>
      <Switch>
        <Route path="/" exact>
          <QueryTest />
        </Route>
        <Route path="/mutation" exact>
          <MutationTest />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
