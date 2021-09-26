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
import ReactDOM from 'react-dom';


export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sessionActive: false,
      fname: "",
      role_id: 0,
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
        return response.json()
      } else {
        console.log("Session Missing");
      }
      return response.json()
    }).then((data)=>{
        console.log("***")
        console.log(data.fname)
        this.setState({ 
            fname: data.fname,
            role_id: data.role_id,
        });
        
    })
  }

  handleSignOut = () =>{
    const requestOptions = {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      };
  
      fetch("/api/sign-out", requestOptions).then((response) => {
        if (response.status == 202) {
          console.log("sign out success");
          this.setState({ sessionActive: false });
          window.location.href='/login'
        } else {
          console.log("sign out success failed");
        }
      });
  }

  renderNav() {
    var role
    if(this.state.role_id == 1){
        role = "Client"
    }
    else if(this.state.role_id == 2){
        role = "Coach"
    }
    else if(this.state.role_id == 3){
        role = "Admin"
    }
    
    return (
      <div className="nav-bar">
        
        <div className="container-menu-btn">
        <div className="menu-user">
            <p id="menu-user-text-container">
            <p id="menu-user-info">User: </p> <p id="menu-user-info-var">{ this.state.fname }</p>
            <br/>
            <p id="menu-user-info">Role: </p><p id="menu-user-info-var">{ role }</p>
            </p>
          </div>
            <Link to="/dashboard">
                <div className="menu-btn btn1">
                    <div className="menu-btn-icon1">
                        
                    </div>
                    <div className="menu-btn-text">
                    Dashboard
                    </div>
                </div>
            </Link>
            <Link to="/workout">
                <div className="menu-btn btn2">
                <div className="menu-btn-icon2">
                        
                </div>
                <div className="menu-btn-text">
                    Workout
                </div>
                </div>
            </Link>
            <Link to="/dashboard">
                <div className="menu-btn btn3">
                <div className="menu-btn-icon3">
                </div>
                <div className="menu-btn-text">
                    Workout Planner
                </div>
                </div>
            </Link>
            <Link to="/dashboard">
                <div className="menu-btn btn4">
                <div className="menu-btn-icon4">
                </div>
                <div className="menu-btn-text">
                    Active Workout
                </div>
                </div>
            </Link>
            <Link to="/dashboard">
                <div className="menu-btn btn5">
                <div className="menu-btn-icon5">
                    </div>
                    <div className="menu-btn-text">
                        Instagram 2.0
                    </div>
                </div>
            </Link>
            { this.state.role_id > 2? 
                <Link to="/managment">
                    <div className="menu-btn btn6">
                        <div className="menu-btn-icon6">
                            </div>
                            <div className="menu-btn-text">
                                Management
                            </div>
                        </div>
                    </Link>
                :null }  
        </div>
        <Link to="/login" onClick={ this.handleSignOut }>
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
              <Route path="/login" component={LoginPage} />
              <Route path="/signup" component={RegisterPage} />
              <Route path="/workout" component={WorkoutPage} />
              <Route path="/workout-add" component={WorkoutAddPage} />
            </Switch>
            </div>
          </Router>
      </div>
    );
  }
}

const appDiv = document.getElementById("app");
render(<App />, appDiv);
