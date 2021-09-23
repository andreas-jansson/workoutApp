import React, { Component } from 'react';
import {
    BrowserRouter as Router,
    Switch,
    withRouter,
    Route,
    Link,
    Redirect,
  } from "react-router-dom";
//import './style.css';

const validEmailRegex = RegExp(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i);
const validateForm = (errors) => {
    let valid = true;
    Object.values(errors).forEach(
        (val) => val.length > 0 && (valid = false)
    );
    return valid;
}

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
                fname: '',
                lname: '',
                email: '',
                password: '',
                confirmed_password: '',
            }
        };
    }

    handleChange = (event) => {
        event.preventDefault();
        const { name, value } = event.target;
        let errors = this.state.errors;

        switch (name) {
            case 'fname':
                errors.fname =
                    value.length < 3
                        ? 'Full Name must be 3 characters long!'
                        : '';
                break;
            case 'lname':
                errors.lname =
                    value.length < 3
                        ? 'Full Name must be 3 characters long!'
                        : '';
                break;
            case 'email':
                errors.email =
                    validEmailRegex.test(value)
                        ? ''
                        : 'Email is not valid!';
                break;
            case 'password':
                errors.password =
                    value.length < 8
                        ? 'Password must be 8 characters long!'
                        : '';
                break;
            case 'confirmed_password':
                errors.confrimed_password =
                    value.length < 8
                        ? 'Password must be 8 characters long!'
                        : '';
                    break;
            default:
                break;
        }
        this.setState({ errors, [name]: value });
    }

    sendDetailsToServer = () => {
        let fname = this.state.fname
        let lname = this.state.lname
        let email = this.state.email
        let password = this.state.password
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
              fname, lname, email, password
          }),
        };
        console.log(requestOptions.body)
        fetch("/api/register-user", requestOptions)
        .then((response) => {
          if (response.ok) {
            window.location.href='/'

          } else {
            console.log("Failed!");
          }
        })
    }

    handleSubmit = (event) => {
        event.preventDefault();
        if (validateForm(this.state.errors) && this.state.password === this.state.confirmed_password) {
            console.info('Valid Form')
            this.sendDetailsToServer()
        } else {
            console.error('Invalid Form')
        }
    }

    render() {
        const { errors } = this.state;
        return (
            <div className='wrapper'>
                <div className='form-wrapper'>
                    <h2>Create Account</h2>
                    <form onSubmit={this.handleSubmit} noValidate>
                        <div className='fname'>
                            <label htmlFor="fname">First Name</label>
                            <input type='text' name='fname' onChange={this.handleChange} noValidate />
                            {errors.fname.length > 0 &&
                                <span className='error'>{errors.fname}</span>}
                        </div>
                        <div className='lname'>
                            <label htmlFor="lname">Last Name</label>
                            <input type='text' name='lname' onChange={this.handleChange} noValidate />
                            {errors.lname.length > 0 &&
                                <span className='error'>{errors.lname}</span>}
                        </div>
                        <div className='email'>
                            <label htmlFor="email">Email</label>
                            <input type='email' name='email' onChange={this.handleChange} noValidate />
                            {errors.email.length > 0 &&
                                <span className='error'>{errors.email}</span>}
                        </div>
                        <div className='password'>
                            <label htmlFor="password">Password</label>
                            <input type='password' name='password' onChange={this.handleChange} noValidate />
                            {errors.password.length > 0 &&
                                <span className='error'>{errors.password}</span>}
                        </div>
                        <div className='info'>
                            <small>Password must be eight characters in length.</small>
                        </div>
                        <div className='confirmed_password'>
                            <label htmlFor="confirmed_password">Password</label>
                            <input type='password' name='confirmed_password' onChange={this.handleChange} noValidate />
                            {errors.confirmed_password.length > 0 &&
                                <span className='error'>{errors.confirmed_password}</span>}
                        </div>
                        <div className='submit'>
                            <button>Create</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}