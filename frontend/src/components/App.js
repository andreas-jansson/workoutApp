import React, { Component } from "react";
import { render } from "react-dom";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";
import StartPage from "./StartPage";
import DashboardPage from "./DashboardPage";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import WorkoutPage from "./WorkoutPage";


export default class App extends Component {
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
      }
    });
  };

  renderNav() {
    return (
      <div className="nav-bar">
        <div className="container-menu-btn">
            <Link to="/dashboard">
                <div className="menu-btn btn1">Dashboard</div>
            </Link>
            <Link to="/workout">
                <div className="menu-btn btn2">Workout</div>
            </Link>
            <Link to="/dashboard">
                <div className="menu-btn btn3">Workout Planner</div>
            </Link>
            <Link to="/dashboard">
                <div className="menu-btn btn4">Active Workout</div>
            </Link>
            <Link to="/dashboard">
                <div className="menu-btn btn1">Instagram 2.0</div>
            </Link>
        </div>
      </div>
    );
  }

  containerSessionName() {
    if (this.state.sessionActive) {
      console.log("content-container-session");
      return "content-container-session";
    } else {
      console.log("content-container-no-session");
      return "content-container-no-session";
    }
  }

  render() {
    return (
      <div className="app-container">
          <Router>
          {this.state.sessionActive ? this.renderNav() : null}
              <div className={this.containerSessionName()}>
            <Switch>
              <Route exact path="/">
                {this.state.sessionActive ? (
                  <Redirect to="/dashboard" />
                ) : (
                  <StartPage />
                )}
              </Route>
              <Route path="/dashboard" component={DashboardPage} />
              <Route path="/workout" component={WorkoutPage} />
            </Switch>
            </div>
          </Router>
      </div>
    );
  }
}

const appDiv = document.getElementById("app");
render(<App />, appDiv);
