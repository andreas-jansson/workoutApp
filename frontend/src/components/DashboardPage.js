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
      information: [],
      sessionActive: false,
    };
  }

  getDashboardData = () => {
    fetch('/api/get-dashboard-data')
      .then(res => res.json())
      .then(result => {
        this.setState({
          isLoaded: true,
          information: result
        });
      });
  }

  componentDidMount = () => {
    this.getDashboardData();
  };


  DashboardPage() {
    const { information } = this.state;
    return (
      /* main container*/
      <div className="db-container">
        <h2 className="db-header-big-text"> The last 7 days you have </h2>
        <div class="db-row">
          <div class="db-column">
          <div className="db-card">
            <p className="db-section1-big-text">Lifted a total of <span style={{color: "white"}}>{information[0]}</span> kg</p>
          </div>
          <div className="db-card">
            <p className="db-section1-big-text">Performed a total of <span style={{color: "white"}}>{information[1]}</span> reps</p>
          </div>
          </div>
        <div class="db-column">
        <div className="db-card">
            <p className="db-section1-big-text">Heaviest lift of <span style={{color: "white"}}>{information[2]}</span> kg</p>
          </div>
          <div className="db-card">
            <p className="db-section1-big-text">Performed <span style={{color: "white"}}>{information[3]}</span> workouts</p>
          </div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    return this.DashboardPage();
  }
}
