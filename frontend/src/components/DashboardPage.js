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

  /* runs on page load*/
  componentDidMount = () => {
    this.sessionExist();
  };

  /* redirects if session exists */
  sessionExist = () => {
    const requestOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };

    fetch("/api/session-exist", requestOptions).then((response) => {
      if (response.status == 202) {
        console.log("session exists");
        this.setState({ sessionActive: true });
      } else {
        console.log("Session Missing");
        /* Remove the "//" comment to make localhost:8000/dashboard redirect to the index */
        //this.props.history.push("/");
      }
    });
  };

  DashboardPage() {
    return (
      /* main container*/
      <div className="db-container">
        <div className="db-section1">
          <div className="db-section1-img" />
        </div>
        <div className="db-container2">
          <div className="db-section2">
          </div>
          <div className="db-section3">
          </div>
        </div>
      </div>
    );
  }

  render() {
    return this.DashboardPage();
  }
}
