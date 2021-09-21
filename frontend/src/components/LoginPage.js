import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link, Redirect} from "react-router-dom";

export default class LoginPage extends Component {

  static defaultProps = {
  };

  constructor(props) {
    
    super(props);
    //this.state = { sessionActive: false };
    this.state = { email: "", password: "" };

    this.OnSignIn = this.OnSignIn.bind(this);
    this.EmailChange = this.EmailChange.bind(this);
    this.PasswordChange = this.PasswordChange.bind(this);
  }

  EmailChange(event) {
    this.setState({ email: event.target.value });
  }

  PasswordChange(event) {
    this.setState({ password: event.target.value });
  }

  OnSignIn(event) {
    if (this.state.email == "test" && this.state.password == "hej") {
      alert("Hello World");
    } else {
      alert(this.state.email);
    }
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
            <label>
              <input
                className="login-text"
                type="text"
                email={this.state.email}
                onChange={this.EmailChange}
                maxLength="50"
              />
            </label>
            <div align="center" className="login-padding">
              Password
            </div>
            <label>
              <input
                className="login-text"
                type="password"
                password={this.state.password}
                onChange={this.PasswordChange}
                maxLength="30"
              />
            </label>
            <div align="center">
              <p>
                <button
                  className="myButton"
                  variant="contained"
                  onClick={this.OnSignIn}
                >
                  Sign In
                </button>
              </p>
            </div>
          </form>
        </div>
        </div>
      </div>
    );
  }

  render() {
    return (this.LoginPage());
  }
}