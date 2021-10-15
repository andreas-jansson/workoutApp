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
import WorkoutAddPage from "./WorkoutAddPage";
import WorkoutManagementPage from "./WorkoutManagementPage";
import ReactDOM from 'react-dom';
import ManagementPage from "./ManagementPage";
import WorkoutPlannerPage from "./WorkoutPlannerPage";
import WorkoutPlannerViewPage from "./WorkoutPlannerViewPage";
import WorkoutPlannerManagePage from "./WorkoutPlannerManagePage";
import WorkoutStandardPage from "./WorkoutStandardPage";
import ActiveWorkoutPage from "./ActiveWorkoutPage";
import SettingsPage from "./SettingsPage";
import SocialPage from "./SocialPage";


export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sessionActive: false,
      fname: "",
      role_id: 0,
      selectedNavbar: "",
    };

  }

  /* runs on page load*/
  componentDidMount = () => {
    this.sessionExist();
    this.selectedNavbarController();
  };


  selectedNavbarController = () => {
    console.log(window.location.href);
    const urlPath = window.location.href;
    const result = urlPath.toString().split('/').pop();
    this.setState({ selectedNavbar: result });

    if (result.includes('dashboard') == true) {
      this.setState({ selectedNavbar: 'dashboard' });
    }
    else if (result.includes('workout-planner') == true) {
      this.setState({ selectedNavbar: 'workout-planner' });
    }
    else if(result.includes('active')==true){
      this.setState({selectedNavbar: 'active'});
    }
    else if(result.includes('workout')==true){
      this.setState({selectedNavbar: 'workout'});
    }
    else if(result.includes('social')==true){
      this.setState({selectedNavbar: 'social'});
    }
    else if (result.includes('management') == true) {
      this.setState({ selectedNavbar: 'management' });
    }
  }

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
        return response.json()
      } else {
        console.log("Session Missing");
        var is_root = (location.pathname == "/");
        console.log(is_root)
        if((location.pathname != "/") && (location.pathname != "/login") && (location.pathname != "/signup")){
          window.location.replace("/")
        }
      }
      return response.json()
    }).then((data) => {
      //console.log("***")
      //console.log(data.fname)
      this.setState({
        fname: data.fname,
        role_id: data.role_id,
      });

    })
  }

  handleSignOut = () => {
    const requestOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };

    fetch("/api/sign-out", requestOptions).then((response) => {
      if (response.status == 202) {
        console.log("sign out success");
        this.setState({ sessionActive: false });
        window.location.href = '/login'
      } else {
        console.log("sign out success failed");
      }
    });
  }

  handleNavigation = (e) => {
    e.preventDefault();
    this.setState({ selectedNavbar: e.target.value });
    console.log("clicked: " + e.target.value);
  }


  renderNav() {
    var role
    if (this.state.role_id == 2) {
      role = "Client"
    }
    else if (this.state.role_id == 3) {
      role = "Coach"
    }
    else if (this.state.role_id == 4) {
      role = "Admin"
    }

    return (
      <div className="nav-bar">

        <div className="container-menu-btn">
          <div className="menu-user">
            <p id="menu-user-text-container">
              <p id="menu-user-info">User: </p> <p id="menu-user-info-var">{this.state.fname}</p>
              <br />
              <p id="menu-user-info">Role: </p><p id="menu-user-info-var">{role}</p>
            </p>
          </div>

          <Link to="/dashboard"
            onClick={(e) => { this.setState({ selectedNavbar: "dashboard" }) }}>
            <div className="menu-btn btn1" >
              <div className="menu-btn-icon1">

              </div>
              <div className="menu-btn-text">
                Dashboard
              </div>
              <div className={this.state.selectedNavbar == "dashboard" ? "menu-btn-dot" : "menu-btn-no-dot"}>
              </div>
            </div>
          </Link>
          <Link to="/workout"
            onClick={() => { this.setState({ selectedNavbar: "workout" }) }}
          >
            <div className="menu-btn btn2">
              <div className="menu-btn-icon2">
              </div>
              <div className="menu-btn-text">
                Workout
              </div>
              <div className={this.state.selectedNavbar == "workout" ? "menu-btn-dot" : "menu-btn-no-dot"}>
              </div>
            </div>
          </Link>
          <Link to="/workout-planner"
            onClick={() => { this.setState({ selectedNavbar: "workout-planner" }) }}
          >
            <div className="menu-btn btn3">
              <div className="menu-btn-icon3">
              </div>
              <div className="menu-btn-text">
                Workout Planner
              </div>
              <div className={this.state.selectedNavbar == "workout-planner" ? "menu-btn-dot" : "menu-btn-no-dot"}>
              </div>
            </div>
          </Link>
          {this.state.role_id == 2 &&
          <Link to="/active-workout"
            onClick={() => { this.setState({ selectedNavbar: "active-workout" }) }}
          >
            <div className="menu-btn btn4" >
              <div className="menu-btn-icon4">
              </div>
              <div className="menu-btn-text">
                Active Workout
              </div>
              <div className={this.state.selectedNavbar == "active-workout" ? "menu-btn-dot" : "menu-btn-no-dot"}>
              </div>
            </div>
          </Link>
          }
          {this.state.role_id == 2 &&
          <Link to="/social"
            onClick={() => { this.setState({ selectedNavbar: "social" }) }}
          >
            <div className="menu-btn btn5" >
              <div className="menu-btn-icon5">
              </div>
              <div className="menu-btn-text">
                Social
              </div>
              <div className={this.state.selectedNavbar == "social" ? "menu-btn-dot" : "menu-btn-no-dot"}>
              </div>
            </div>
          </Link>
          }
          {this.state.role_id > 2 ?
            <Link to="/management"
              onClick={() => { this.setState({ selectedNavbar: "management" }) }}
            >
              <div className="menu-btn btn6" >
                <div className="menu-btn-icon6">
                </div>
                <div className="menu-btn-text">
                  Management
                </div>
                <div className={this.state.selectedNavbar == "management" ? "menu-btn-dot" : "menu-btn-no-dot"}>
                </div>
              </div>
            </Link>
            : null}
          {this.state.role_id == 2 ?
            <Link to="/settings"
              onClick={() => { this.setState({ selectedNavbar: "settings" }) }}
            >
              <div className="menu-btn btn6" >
                <div className="menu-btn-icon6">
                </div>
                <div className="menu-btn-text">
                  Settings
                </div>
                <div className={this.state.selectedNavbar == "settings" ? "menu-btn-dot" : "menu-btn-no-dot"}>
                </div>
              </div>
            </Link>
            : null}
        </div>
        <Link to="/login" onClick={this.handleSignOut}>
          <div className="menu-btn btn-signout">
            <div className="menu-btn-icon-signout">
            </div>
            <div className="menu-btn-text">
              Sign Out
            </div>
          </div>
        </Link>
      </div>
    );
  }

  containerSessionName() {
    if (this.state.sessionActive) {
      //console.log("content-container-session");
      return "content-container-session";
    } else {
      //console.log("content-container-no-session");
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
              <Route path="/login" component={LoginPage} />
              <Route path="/signup" component={RegisterPage} />
              <Route path="/workout" component={WorkoutPage} />
              <Route path="/workout-add" component={WorkoutAddPage} />
              <Route path="/workout-management" component={WorkoutManagementPage} />
              <Route path="/management" component={ManagementPage} />
              <Route path="/workout-planner" component={WorkoutPlannerPage} />
              <Route path="/workout-planner-view" component={WorkoutPlannerViewPage} />
              <Route path="/workout-planner-manage" component={WorkoutPlannerManagePage} />
              <Route path="/workout-standard" component={WorkoutStandardPage} />
              <Route path="/active-workout" component={ActiveWorkoutPage} />
              <Route path="/settings" component={SettingsPage} />
              <Route path="/social" component={SocialPage} />
            </Switch>
          </div>
        </Router>
      </div>
    );
  }
}

const appDiv = document.getElementById("app");
render(<App />, appDiv);
