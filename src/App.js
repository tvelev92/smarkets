import React, { Component } from 'react';
import { BrowserRouter, Route } from "react-router-dom";
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import rootReducer from './data/reducers';
import EventsDashboard from './EventsDashboard';
import logo from './logo.svg';
import './App.css';

const store = createStore(rootReducer)

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Provider store={store}>
          <Route exact path="/" component={EventsDashboard} />
        </Provider>
      </BrowserRouter>
    );
  }
}

export default App;
