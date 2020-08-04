import React from 'react';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import { Auth0Provider,withAuthenticationRequired  } from "@auth0/auth0-react";
import { createBrowserHistory } from 'history';
import 'antd/dist/antd.css';
import './App.css'
import Home from './pages/home';
import Private from './pages/private';
import About from './pages/about';


const ProtectedRoute = ({ component, ...args }) => (
  <Route component={withAuthenticationRequired(component)} {...args} />
);

export const history = createBrowserHistory();

const onRedirectCallback = (appState) => {
  // Use the router's history module to replace the url
  history.replace(appState?.returnTo || window.location.pathname);
};

function App() {

    return (
      <Auth0Provider
      domain="dev-v9fbw0wq.eu.auth0.com"
      clientId="uCOfOa2yRvNiImFrLzF4jM7cQNFBridt"
      redirectUri={window.location.origin}
      onRedirectCallback={onRedirectCallback}
    >
        <Router history={history}>
        <Switch>
          <Route path="/" exact component={Home}/>
          <Route path="/about" exact component={About}/>
          {/* <Route path="/private" component={Private} /> */}
          <ProtectedRoute path="/private" component={Private} />
          <Redirect to='/'/>
        </Switch>
      </Router>
    </Auth0Provider>
      )
  
}
  
  export default App;
