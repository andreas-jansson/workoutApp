import React, { Component, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";
import '../../static/css/dashboard.css';
import '../../static/css/navbar.css';
//import '../../static/css/header.css';

export default class DashboardPage extends Component {
  static defaultProps = {};

  constructor(props) {
    super(props);

    this.state = {
      sessionActive: false,
    };
  }


  DashboardPage() {
    return (
      /* main container*/
      <div className="db-container">
        <div className="db-section1">
          <div className="db-section1-box1">
          <p className="db-section1-big-text">Wednesday</p>
            <p className="db-section1-small-text">Next Workout</p>
          </div>
          <div className="db-section1-box2">
          <p className="db-section1-big-text">Squats 140 Kg</p>
          <p className="db-section1-small-text">Latest Personal Record</p>
          </div>
          <div className="db-section1-box3">
            <p className="db-section1-big-text">Jennifer</p>
            <p className="db-section1-small-text">Personal Coach</p>
          </div>
          </div>
        <div className="db-container2">
          <div className="db-section2">
          </div>
          <div className="db-section3">
          <div id="donutchart"></div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    return this.DashboardPage();
  }
}
