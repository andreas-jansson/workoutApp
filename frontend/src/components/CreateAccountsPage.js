import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Switch,
  withRouter,
  Route,
  Link,
  Redirect,
} from "react-router-dom";
import '../../static/css/register-coach.css';
import '../../static/css/createAccountsPage.css';
import Alert from "@material-ui/lab/Alert";
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';


const validEmailRegex = RegExp(
  /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
);
const validateForm = (errors) => {
  let valid = true;
  Object.values(errors).forEach((val) => val.length > 0 && (valid = false));
  return valid;
};

export default class CreateAccountsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fname: null,
      lname: null,
      email: null,
      password: null,
      confirmed_password: null,
      role: 'Client',
      alertStatus: false,
      isPostSuccessful: false,
      alertString: '',
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
    console.log(this.state.role);
    let fname = this.state.fname;
    let lname = this.state.lname;
    let email = this.state.email;
    let password = this.state.password;
    let role = this.state.role;
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fname,
        lname,
        email,
        password,
        role,
      }),
    };
    console.log(requestOptions.body);
    fetch("/api/register-coach", requestOptions).then((response) => {
      if (response.ok) {
        this.setState({
          alertStatus: true,
          isPostSuccessful: true,
          fname: '',
          lname: '',
          email: '',
          password: '',
          confirmed_password: '',
          alertString: "Account registered successfully!"
        })
        Array.from(document.querySelectorAll("input")).forEach(input => (input.value = ''))
      } else {
        this.setState({
          alertStatus: true,
          isPostSuccessful: false,
          alertString: "Email is already in use!"
        })
      }
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    if (
      validateForm(this.state.errors) &&
      this.state.password === this.state.confirmed_password
    ) {
      console.info("Passwords match");
      this.sendDetailsToServer();
    } else {
      console.error("Invalid Form");
    }
  };

  closeAlert = () => {
    this.setState({
      alertStatus: false,
      isPostSuccessful: false,
      alertString: ''
    })
  }

  render() {
    const { errors } = this.state;
    return (
      <div>
        <div className="cap-container">
          <div className="cap-section">
            <form onSubmit={this.handleSubmit} noValidate id='myForm'>
              <div>
                <i class="material-icons">account_circle</i>
                <label htmlFor="fname">First Name</label>
                <br />
                <input
                  type="text-signup"
                  className="cap-signup-text"
                  name="fname"
                  onChange={this.handleChange}
                  noValidate
                />
                {errors.fname.length > 0 && (
                  <span className="error">{errors.fname}</span>
                )}
              </div>

              <div align="left" className="lname" className='cap-text-spacing'>
                <i class="material-icons">account_circle</i>
                <label htmlFor="lname">Last Name</label>
                <br />
                <input
                  minlength="8"
                  type="text-signup"
                  className="cap-signup-text"
                  name="lname"
                  onChange={this.handleChange}
                  noValidate
                />
                {errors.lname.length > 0 && (
                  <span className="error">{errors.lname}</span>
                )}
              </div>

              <div align="left" className="email" className='cap-text-spacing'>
                <i class="material-icons">contact_mail</i>
                <label htmlFor="email">Email</label>
                <br />
                <input
                  type="email-signup"
                  className="cap-signup-text"
                  name="email"
                  onChange={this.handleChange}
                  noValidate
                />
                {errors.email.length > 0 && (
                  <span className="error">{errors.email}</span>
                )}
              </div>

              <div align="left" className="password" className='cap-text-spacing'>
                <i class="material-icons">vpn_key</i>
                <label htmlFor="password">Password</label>
                <br />

                <input
                  type="password"
                  className="cap-signup-text"
                  name="password"
                  onChange={this.handleChange}
                  noValidate
                />
                {errors.password.length > 0 && (
                  <span className="error">{errors.password}</span>
                )}
              </div>

              <div className="info">
              </div>
              <div align="left" className="confirmed_password" className='cap-text-spacing'>
                <i class="material-icons">repeat</i>
                <label htmlFor="confirmed_password">Confirm Password</label>
                <br />

                <input
                  type="password"
                  className="cap-signup-text"
                  name="confirmed_password"
                  onChange={this.handleChange}
                  noValidate
                />
                {errors.confirmed_password.length > 0 && (
                  <span className="error">{errors.confirmed_password}</span>
                )}
              </div>

              <div className='cap-text-spacing'>
                <label>Choose user role: </label>
                <br />
                <select defaultValue={this.state.role} onChange={(e) => { this.setState({ role: e.target.value }) }} className='cap-select-type'>
                  <option value="Client">Client</option>
                  <option value="Coach">Coach</option>
                </select>
              </div>

              <div class="container">
                <br />
                <div class="center">
                  <button class="cap-create-btn" type="submit" align="center">
                    <span>Create Account</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
          <div className="cap-alert-container">
              <div className={`alert alert-success ${this.state.alertStatus ? 'login-alert-shown' : 'login-alert-hidden'}`}>
                <Alert severity={this.state.isPostSuccessful ? 'success' : 'error'}
                  action={
                    <IconButton
                      aria-label="close"
                      color="inherit"
                      size="small"
                      onClick={() => {
                        this.closeAlert();
                      }}
                    >
                      <CloseIcon fontSize="inherit" />
                    </IconButton>
                  }
                  sx={{ mb: 2 }}
                >
                  {this.state.alertString}</Alert>
              </div>
            </div>
          </div>
      </div>
    );
  }
}
