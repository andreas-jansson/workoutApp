import React, { Component, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";
import "../../static/css/social-my-friends.css";



const public_url = "/api/social-find-friends";
const email_url = "/api/social-find-email-friends";

export default class SocialFindFriendsEmail extends Component {
  static defaultProps = {};

  constructor(props) {
    super(props);

    this.state = {
      sessionActive: false,
      emailFriend: 0,
    };
  }

  handleSubmit = () => 
  { 
      var email = this.state.emailFriend       
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
      }),
    };

    fetch(email_url, requestOptions).then((resp) => {
      if (resp.ok) {
        console.log("✅Friend Request Was Successful✅");
      } else {
        console.log("❌Friend Request Was NOT Successful❌");
      }
    });
};

  renderSearch = () => {
    return (
      <div>
        <div className="sff-request-title" align="center">
          Send an email friend request to people you know.{" "}
        </div>
        <form onSubmit={this.handleSubmit}>
          <div align="center">
            <label>
              <input
                onChange={(e) => {
                  this.setState({ emailFriend: e.target.value });
                }}
                type="email"
                name="email"
                placeholder="Email Address"
              ></input>
            </label>
            <button type="submit" className="sff-request-button">
              Send Request
            </button>
          </div>
        </form>
      </div>
    );
  };

  render() {
    return (
        this.renderSearch()
    )
  }
}
