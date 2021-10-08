import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Link,
} from "react-router-dom";
import '../../static/css/login.css';
import '../../static/css/header.css';
import Alert from "@material-ui/lab/Alert";
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';


export default class LoginPage extends Component {
  static defaultProps = {};

  constructor(props) {
    super(props);
    //this.state = { sessionActive: false };
    this.state = { email: "", 
    password: "", 
    errorStatus: false, 
    errorString: "",
  };

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

  closeError = () => {
    this.setState({
      errorStatus: false,
      errorString: ""
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
        } 
        else if (response.status == 401){
          this.setState({ errorStatus: true,
          errorString: "Your account is not authorized, Please wait for the staff to accept you." });
        }
        else {
          this.setState({ errorStatus: true,
          errorString: "Invalid email or password"});
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
                type="email"
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
                <br />
                <button
                  className="myButton"
                  variant="contained"
                  onClick={this.OnSignIn}
                >
                  Sign In
                </button>
              </div>
              <p className="no-account">
                Don't have an account? <br />
              <a href="/signup">Register one here!</a>
            </p>
            </form>
          </div>
          <div className="wpmp-alert-container">
            <div className={`alert alert-success ${this.state.errorStatus ? 'login-alert-shown' : 'login-alert-hidden'}`}>
              <Alert severity="error"
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    this.closeError();
                  }}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
              sx={{ mb: 2 }}
            >
            {this.state.errorString}</Alert>
            </div>
          </div>
          </div>
        </div>
    );
  }

  render() {
    return this.LoginPage();
  }
}


