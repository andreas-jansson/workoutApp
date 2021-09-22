import React, { Component, useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";

function RegisterPage2(props) {
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [pw1, setPw1] = useState("");
  const [pw2, setPw2] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fname,
        lname,
        email,
        pw1,
      }),
    };
    fetch("/api/register-user", requestOptions)
      .then((response) => {
        if (response.ok) {
          <Redirect push to="/dashboard" />;
        } else {
          console.log("Failed!");
        }
      })
      .then(() => this.props.history.push("/"));

    console.log(fname);
    console.log(lname);
    console.log(email);
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
                      type="text"
                      value={fname}
                      onChange={(e) => {
                        setFname(e.target.value);
                      }}
                      name="first-name"
                      placeholder="First name"
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
                      value={lname}
                      onChange={(e) => {
                        setLname(e.target.value);
                      }}
                      name="last-name"
                      placeholder="Last name"
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
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                      }}
                      name="email"
                      placeholder="E-mail"
                    ></input>
                  </label>
                  <div align="left" className="signup-padding">
                  <i class="material-icons">vpn_key</i>
                    Password
                  </div>
                  <label>
                    <input
                      className="signup-text"
                      type="text"
                      value={pw1}
                      onChange={(e) => {
                        setPw1(e.target.value);
                      }}
                      name="password1"
                      placeholder="Password"
                    ></input>
                  </label>
                  <label>
                    <div align="left" className="signup-padding">
                      <i class="material-icons">repeat</i>
                      Confirm Password   
                    </div>
                    <input
                      className="signup-text"
                      type="text"
                      value={pw2}
                      onChange={(e) => {
                        setPw2(e.target.value);
                      }}
                      name="password2"
                      placeholder="Confirm Password"
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

export default RegisterPage2;
