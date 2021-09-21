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
          <Redirect push to="/dashboard" />
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
    <div>
      <div>
        <h2>Sign up for an account!</h2>
      </div>
      <div>
        <form onSubmit={handleSubmit}>
          <label>
            <input
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
            <input
              type="text"
              value={lname}
              onChange={(e) => {
                setLname(e.target.value);
              }}
              name="last-name"
              placeholder="Last name"
            ></input>
          </label>
          <br />
          <label>
            <input
              type="text"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              name="email"
              placeholder="E-mail"
            ></input>
          </label>
          <br />
          <label>
            <input
              type="text"
              value={pw1}
              onChange={(e) => {
                setPw1(e.target.value);
              }}
              name="password1"
              placeholder="Password"
            ></input>
          </label>
          <br />
          <label>
            <input
              type="text"
              value={pw2}
              onChange={(e) => {
                setPw2(e.target.value);
              }}
              name="password2"
              placeholder="Confirm"
            ></input>
          </label>
          <br />
          <input type="submit" value="Submit" />
        </form>
      </div>
    </div>
  );
}

export default RegisterPage2;
