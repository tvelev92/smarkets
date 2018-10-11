import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import EventsDashboard from './EventsDashboard';
import logo from './logo.svg';
import './App.css';

const Home = () => (
  <div>
    <h2>Home</h2>
  </div>
);

const About = () => (
  <div>
    <h2>About</h2>
  </div>
);

const Child = ({ match }) => (
  <div>
    <h3>ID: {match.params.id}</h3>
  </div>
);


class App extends Component {
  render() {
    return (
       <Router>
         <div>
         <Route exact path="/" component={EventsDashboard} />
         <Route path="/:id" component={Child} />
         </div>
       </Router>
    );
  }
}

export default App;
