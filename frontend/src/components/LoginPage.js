import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";
import '../../static/css/login.css';
import '../../static/css/header.css';


export default class LoginPage extends Component {
  static defaultProps = {};

  constructor(props) {
    super(props);
    //this.state = { sessionActive: false };
    this.state = { email: "", password: "" };

    this.OnSignIn = this.OnSignIn.bind(this);
    this.EmailChange = this.EmailChange.bind(this);
    this.PasswordChange = this.PasswordChange.bind(this);
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
          window.location.href = "/dashboard";
          return response.json()
        } else {
          console.log("Session Missing");
        }
        return response.json()
      })
    }

    
  EmailChange(event) {
    this.setState({ email: event.target.value });
  }

  PasswordChange(event) {
    this.setState({ password: event.target.value });
  }

  OnSignIn(event) {
    let email = this.state.email
    let password = this.state.password
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
          email, password,
      }),
    };
    fetch("/api/login-user", requestOptions)
    .then((response) => {
      if (response.ok) {
        console.log("Success!");
        window.location.href = "/dashboard";
      } else {
        console.log("Failed!");
      }
    });

    event.preventDefault();
  }

  RenderHeader() {
    return (
      <div className="header-container">
        <div className="header-btn-container">
          <Link to="/login">
            <div className="header-btn-btn1">Pricing</div>
          </Link>
          <Link to="/login">
            <div className="header-btn-btn2">About</div>
          </Link>
          <Link to="">
            <div className="header-btn-btn3">Home</div>
          </Link>
        </div>
      </div>
    );
  }

  LoginPage() {
    return (
      <div className="sp-section lp-container">
        {this.RenderHeader()}
        <div className="box-centering">
          <div className="login-box box-centering">
            <div align="center" className="login-padding">
              Email
            </div>
            <form>
                <input
                  className="login-text"
                  type="text"
                  email={this.state.email}
                  onChange={this.EmailChange}
                  maxLength="50"
                />
              <div align="center" className="login-padding">
                Password
              </div>
                <input
                  className="login-text"
                  type="password"
                  password={this.state.password}
                  onChange={this.PasswordChange}
                  maxLength="30"
                />
              <div align="center">
                  <button
                    className="myButton"
                    variant="contained"
                    onClick={this.OnSignIn}
                  >
                    Sign In
                  </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  render() {
    return this.LoginPage();
  }
}


