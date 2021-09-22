import React, { Component, useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";

function RegisterPage(props) {
  const [state , setState] = useState({
    fname : "",
    lname : "",
    email : "",
    password : "",
    confirmed_password : ""
  })

  const handleChange = (e) => {
    const {id , value} = e.target   
    setState(prevState => ({
        ...prevState,
        [id] : value
    }))
  }

  const redirectToLogin = () => {
    props.history.push('/login'); 
  }

  const sendDetailsToServer = () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        "fname":state.fname,
        "lname":state.lname,
        "email":state.email,
        "password":state.password,
      }),
    };
    console.log(requestOptions.body)
    fetch("/api/register-user", requestOptions)
      .then((response) => {
        if (response.ok) {
          <Redirect push to="/dashboard" />;
        } else {
          console.log("Failed!");
        }
      })
      .then(() => props.history.push("/login"));

    console.log(fname);
    console.log(lname);
    console.log(email);
  }
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (state.password === state.confirmed_password) {
      sendDetailsToServer();
    }
    else{
      alert("Passwords did not match");
    }
  };

  return (
    <div className="signup-section signup-container">
      <div>
        <div>
          <div>
            <div align="center" className="signup-text-title">
              Sign up for an account!
            </div>
          </div>
          <div className="box-centering">
            <div className="signup-box box-centering">
              <div align="center" className="signup-padding">
                <form onSubmit={handleSubmit}>
                  <label>
                    <div align="left" className="signup-padding">
                    <i class="material-icons">account_circle</i>
                      First name
                    </div>
                    <input
                      className="signup-text"
                      id="fname"
                      type="text"
                      value={state.fname}
                      onChange={handleChange}
                      name="first-name"
                    ></input>
                  </label>
                  <br />
                  <label>
                    <div align="left" className="signup-padding">
                    <i class="material-icons">account_circle</i>
                      Last name
                    </div>
                    <input
                      className="signup-text"
                      type="text"
                      id="lname"
                      value={state.lname}
                      onChange={handleChange}
                      name="last-name"
                    ></input>
                  </label>
                  <div align="left" className="signup-padding">
                  <i class="material-icons">contact_mail</i>
                    Email
                  </div>
                  <label>
                    <input
                      className="signup-text"
                      type="text"
                      id="email"
                      value={state.email}
                      onChange={handleChange}
                      name="email"
                    ></input>
                  </label>
                  <div align="left" className="signup-padding">
                  <i class="material-icons">vpn_key</i>
                    Password
                  </div>
                  <label>
                    <input
                      className="signup-text"
                      type="password"
                      id="password"
                      value={state.password}
                      onChange={handleChange}
                    ></input>
                  </label>
                  <label>
                    <div align="left" className="signup-padding">
                      <i class="material-icons">repeat</i>
                      Confirm Password   
                    </div>
                    <input
                      className="signup-text"
                      type="password"
                      id="confirmed_password"
                      value={state.confirmed_password}
                      onChange={handleChange}
                    ></input>
                  </label>
                  <br /> <br />   <br /> <br />   <br /> <br />
                  <div class="container">
                    <div class="center">
                      <button class="btn" type="submit">
                        <svg
                          width="180px"
                          height="60px"
                          viewBox="0 0 180 60"
                          class="border"
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
                      <div className="mt-2">
                <span>Already have an account? </span>
                <span className="loginText" onClick={() => redirectToLogin()}>Login here</span> 
                  </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
