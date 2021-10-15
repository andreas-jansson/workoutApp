import React, { Component } from "react";
import {
  Link,
} from "react-router-dom";
import '../../static/css/register.css';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import ValidateRegistration from "./ValidateRegistration";
import { MuiThemeProvider } from "@material-ui/core";
import { createTheme } from "@material-ui/core/styles";
import Alert from "@material-ui/lab/Alert";

import '../../static/css/register.css';
import '../../static/css/header.css';

const validateSignUpForm = ValidateRegistration.validateSignUpForm;

const my_theme = createTheme({
  palette: {
    primary: {
      main: "#e66a04"
    }, secondary: {
      light: '#0066ff',
      main: '#0044ff',
    }
  },
  overrides: {
    MuiFilledInput: {
      root: {
        backgroundColor: "rgb(232, 241, 250)",
        "&:hover": {
          backgroundColor: "rgb(250, 232, 241)",
          "@media (hover: none)": {
            backgroundColor: "rgb(232, 241, 250)"
          }
        },
        "&.Mui-focused": {
          backgroundColor: "rgb(250, 241, 232)"
        }
      }
    }
  }
})

export default class RegisterPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        fname: null,
        lname: null,
        email: null,
        password: null,
        confirmed_password: null,
      },
      errors: {
      },
      type: "password",
      btnTxt: "show",
      invalidInfo: false,
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount = () => {
    this.sessionExist();
  };

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

  sendDetailsToServer = () => {
    let fname = this.state.user.fname;
    let lname = this.state.user.lname;
    let email = this.state.user.email;
    let password = this.state.user.password;
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
        window.location.href = "/login";
      } else {
        this.setState({ invalidInfo: true });
      }
    });
  };

  handleChange(e) {
    const { name, value } = e.target
    this.setState({
      user: {
        ...this.state.user,
        [name]: value
      }
    })
  }

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

  validateForm = (e) => {
    e.preventDefault()
    var payload = validateSignUpForm(this.state.user);
    if (payload.success) {
      this.setState({
        errors: {}
      });
      console.info("Valid Form");
      this.sendDetailsToServer();
    } else {
      const payloaderrors = payload.errors;
      this.setState({
        errors: payloaderrors
      });
      console.error("Invalid Form");
    }
  }

  render() {
    return (
      <div className="reg-Picture">
        {this.RenderHeader()}

        <MuiThemeProvider theme={my_theme}>
          <div className="loginBox">
            <h1>Sign Up</h1>
            {this.state.errors.message && <p style={{ color: "red" }}>{this.state.errors.message}</p>}

            <form onSubmit={this.validateForm}>
              <TextField
                color="primary"
                label="First Name"
                variant="filled"
                margin='normal'
                name="fname"
                className='regTextField'
                value={this.state.user.fname}
                onChange={this.handleChange}
                error={this.state.errors.fname}
                helperText={this.state.errors.fname}
              />
              <br />
              <TextField
                color="primary"
                label="Last Name"
                variant="filled"
                margin='normal'
                name="lname"
                className='regTextField'
                value={this.state.user.lname}
                onChange={this.handleChange}
                error={this.state.errors.lname}
                helperText={this.state.errors.lname}
              />
              <br />
              <TextField
                color="primary"
                label="Email"
                variant="filled"
                margin='normal'
                name="email"
                className='regTextField'
                value={this.state.user.email}
                onChange={this.handleChange}
                error={this.state.errors.email}
                helperText={this.state.errors.email}
              />
              <br />
              <TextField
                color="primary"
                type={this.state.type}
                label="Password"
                variant="filled"
                margin='normal'
                name="password"
                className='regTextField'
                value={this.state.user.password}
                onChange={this.handleChange}
                error={this.state.errors.password}
                helperText={this.state.errors.password}
              />
              <br />
              <TextField
                color="primary"
                type={this.state.type}
                label="Confirm Password"
                variant="filled"
                margin='normal'
                name="confirmed_password"
                className='regTextField'
                value={this.state.user.confirmed_password}
                onChange={this.handleChange}
                error={this.state.errors.confirmed_password}
                helperText={this.state.errors.confirmed_password}
              />
              <br />
              <Button
                primary={true}
                color='primary'
                variant='contained'
                size='large'
                type="submit"
                label="submit"
                margin="normal"
              >
                Submit
              </Button>
            </form>
            <p>
              Aleady have an account? <br />
              <a href="/login">Log in here</a>
            </p>
          </div>
        </MuiThemeProvider>
        <div className="reg-alert-container">
          <div className={`alert alert-success ${this.state.invalidInfo ? 'reg-alert-shown' : 'reg-alert-hidden'}`}>
            <Alert severity="error">Email already exists</Alert>
          </div>
        </div>
      </div>
    );
  };
}
