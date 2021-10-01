import React, { Component, useState, useEffect } from "react";
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import CheckIcon from '@material-ui/icons/Check'
import '../../static/css/register-coach.css';
import {green, red} from '@material-ui/core/colors'
import { createTheme } from "@material-ui/core/styles";
import { MuiThemeProvider } from "@material-ui/core";

const my_theme = createTheme({palette: {primary: green, secondary: red}})

export default class PendingAccountsPage extends Component{
  constructor(props){
    super(props);
    this.state = {
      users: [],
      isLoaded: false,
    };
  }

  showUsers() {
    fetch('/api/get-pending-users')
      .then(res => res.json())
      .then(result => {
        this.setState({
          isLoaded: true,
          users: result
        });
      });
  }

  componentDidMount() {
    this.showUsers();
  }

  denyUser = (e) => {
    let id = e.currentTarget.value;
    const requestOptions = {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({
        id,
      })
    }
    fetch("/api/deny-user", requestOptions).then((response) => {
      if (response.ok) {
        console.log("Denied!");
        this.showUsers();
      } else {
        console.log("Failed!");
      }
    });
  };

  approveUser = (e) => {
    let id = e.currentTarget.value;
    const requestOptions = {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({
        id,
      })
    }
    fetch("/api/approve-user", requestOptions).then((response) => {
      if (response.ok) {
        console.log("Approved!");
        this.showUsers();
      } else {
        console.log("Failed!");
      }
    });
  };

  render() {
    const { users } = this.state;
    if (!this.state.isLoaded) {
      return <div>Loading ... </div>;
    } else {
      return (
        <div className="cap-container">
        <div className="cap-section">
        <ul>
          {users.map(item => (
            <div className = '' key={item.id}>
              <div>{item.fname} {item.lname} | {item.email}
              <MuiThemeProvider theme={my_theme}><IconButton onClick={this.approveUser} value={item.id} aria-label="check" size="large" color="primary"><CheckIcon /></IconButton></MuiThemeProvider>
              <MuiThemeProvider theme={my_theme}><IconButton onClick={this.denyUser} value={item.id} aria-label="delete" size="large" color="secondary"><DeleteIcon /></IconButton></MuiThemeProvider>
              </div>
            </div>
          ))}
        </ul>
        </div>
        </div>
      );
    }
  }
}