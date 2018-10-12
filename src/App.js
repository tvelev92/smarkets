import React, { Component } from 'react';
import { BrowserRouter, Route } from "react-router-dom";
import EventsDashboard from './EventsDashboard';
import logo from './logo.svg';
import './App.css';


class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Route exact path="/" component={EventsDashboard} />
      </BrowserRouter>
    );
  }
}

export default App;
