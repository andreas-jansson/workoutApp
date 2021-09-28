import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Switch,
  withRouter,
  Route,
  Link,
  Redirect,
} from "react-router-dom";
import '../../static/css/register.css';

const validEmailRegex = RegExp(
  /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
);
const validateForm = (errors) => {
  let valid = true;
  Object.values(errors).forEach((val) => val.length > 0 && (valid = false));
  return valid;
};

export default class RegisterPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fname: null,
      lname: null,
      email: null,
      password: null,
      confirmed_password: null,
      errors: {
        fname: "",
        lname: "",
        email: "",
        password: "",
        confirmed_password: "",
      },
    };
  }

  handleChange = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    let errors = this.state.errors;

    switch (name) {
      case "fname":
        errors.fname =
          value.length < 3 ? "❌" : "";
        break;
      case "lname":
        errors.lname =
          value.length < 3 ? "❌" : "";
        break;
      case "email":
        errors.email = validEmailRegex.test(value)
          ? ""
          : "❌";
        break;
      case "password":
        errors.password =
          value.length < 8 ? "❌" : "";
        break;
      case "confirmed_password":
        errors.confirmed_password =
          value.length < 8 ? "❌" : "";
        break;
      default:
        break;
    }
    this.setState({ errors, [name]: value });
  };

  sendDetailsToServer = () => {
    let fname = this.state.fname;
    let lname = this.state.lname;
    let email = this.state.email;
    let password = this.state.password;
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fname,
        lname,
        email,
        password,
      }),
    };
    console.log(requestOptions.body);
    fetch("/api/register-user", requestOptions).then((response) => {
      if (response.ok) {
        window.location.href = "/";
      } else {
        console.log("Failed!");
      }
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    if (
      validateForm(this.state.errors) &&
      this.state.password === this.state.confirmed_password
    ) {
      console.info("Valid Form");
      this.sendDetailsToServer();
    } else {
      console.error("Invalid Form");
    }
  };

  RenderHeader() {
    return (
      <div className="header-container">
        <div className="header-btn-container">
          <Link to="/pricing">
            <div className="header-btn-btn1">Pricing</div>
          </Link>
          <Link to="/about">
            <div className="header-btn-btn2">About</div>
          </Link>
          <Link to="">
            <div className="header-btn-btn3">Home</div>
          </Link>
        </div>
      </div>
    );
  }

  render() {
    const { errors } = this.state;
    return (
      <div className="signup-section signup-container">
        <div align="center" className="signup-text-title">
          Create an Account
        </div>
        {this.RenderHeader()}
        <div className="box-centering">
          <div className="signup-box box-centering">
            <div align="center" className="signup-padding">
              <form onSubmit={this.handleSubmit} noValidate>
                <div align="left" className="fname">
                  <i class="material-icons">account_circle</i>
                  <label htmlFor="fname">First Name</label>
                  <br />
                  <input
                    type="text-signup"
                    className="signup-text"
                    name="fname"
                    placeholder="First name"
                    onChange={this.handleChange}
                    noValidate
                  />
                  {errors.fname.length > 0 && (
                    <span className="error">{errors.fname}</span>
                  )}
                </div>

                <div align="left" className="lname">
                  <i class="material-icons">account_circle</i>
                  <label htmlFor="lname">Last Name</label>
                  <br />
                  <input
                  minlength="8"
                    type="text-signup"
                    className="signup-text"
                    name="lname"
                    placeholder="Last name"
                    onChange={this.handleChange}
                    noValidate
                  />
                  {errors.lname.length > 0 && (
                    <span className="error">{errors.lname}</span>
                  )}
                </div>

                <div align="left" className="email">
                  <i class="material-icons">contact_mail</i>
                  <label htmlFor="email">Email</label>
                  <br />
                  <input
                    type="email-signup"
                    className="signup-text"
                    name="email"
                    placeholder="Email"
                    onChange={this.handleChange}
                    noValidate
                  />
                  {errors.email.length > 0 && (
                    <span className="error">{errors.email}</span>
                  )}
                </div>

                <div align="left" className="password">
                  <i class="material-icons">vpn_key</i>
                  <label htmlFor="password">Password</label>
                  
                  <input
                    type="password"
                    className="signup-text"
                    name="password"
                    className="reg-password"
                    onChange={this.handleChange}
                    noValidate
                  />
                  {errors.password.length > 0 && (
                    <span className="error">{errors.password}</span>
                  )}
                </div>

                <div className="info">
                </div>
                <div align="left" className="confirmed_password">
                  <i class="material-icons">repeat</i>
                  <label htmlFor="confirmed_password">Confirm Password</label>
                  <input
                    className="signup-text"
                    type="password"
                    name="confirmed_password"
                    onChange={this.handleChange}
                    noValidate
                  />
                  {errors.confirmed_password.length > 0 && (
                      <span className="error">{errors.confirmed_password}</span>
                      )}
                </div>
                      <span class="small-signup" > Password must be eight characters in length.</span>
                <div class="container">
                    <br/> 
                  <div class="center">
                    <button class="btn-signup-button" type="submit">
                      <svg 
                        width="180px"
                        height="60px"
                        viewBox="0 0 180 60"
                        class="signup"
                      >
                        <polyline
                          points="179,1 179,59 1,59 1,1 179,1"
                          class="bg-line"
                        />
                        <polyline
                          points="179,1 179,59 1,59 1,1 179,1"
                          class="hl-line"
                        />
                      </svg>
                      <span>Sign Up</span>
                    </button>
                    <br /> <br />
                    <div className="mt-3">
                      <a href="/login">Already have an account? </a>
                    </div>
                    <br/>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
