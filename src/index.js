import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import store from './store/store';
import { Provider } from 'react-redux';
import { fetchContacts } from './store/contactSlice'

// Will use https://jsonplaceholder.typicode.com/
// import './fakeServer/server'

store.dispatch(fetchContacts())

ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
  document.getElementById('root')
);

