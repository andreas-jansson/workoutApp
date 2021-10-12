import React, { Component, useState, useEffect } from "react";
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import CheckIcon from '@material-ui/icons/Check'
import '../../static/css/register-coach.css';
import { green, red } from '@material-ui/core/colors'
import { createTheme } from "@material-ui/core/styles";
import { MuiThemeProvider } from "@material-ui/core";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
}
  from '@material-ui/core'


const my_theme = createTheme({ palette: { primary: green, secondary: red, orange: "#e66a04" } })

export default class PendingAccountsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      isLoaded: false,
      open: false,
      targetedId: null,
    };
  }

  handleClickOpen = (e) => {
    this.setState({ open: true, targetedId: e.currentTarget.value })
  };

  handleClose = () => {
    this.setState({ open: false, targetedId: null })
  };

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

  denyUser = () => {
    let id = this.state.targetedId
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
      })
    }
    fetch("/api/deny-user", requestOptions).then((response) => {
      if (response.ok) {
        console.log("Woho!!");
        this.handleClose();
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
      headers: { "Content-Type": "application/json" },
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
            {users.length == 0
            ?<div >There are no members waiting to be accepted</div>
            :
            <ul>
              {users.map(item => (
                <div className='' key={item.id}>
                  <div>{item.fname} {item.lname} | {item.email}
                    <MuiThemeProvider theme={my_theme}><IconButton onClick={this.approveUser} value={item.id} aria-label="check" size="large" color="primary"><CheckIcon /></IconButton></MuiThemeProvider>
                    <MuiThemeProvider theme={my_theme}><IconButton onClick={this.handleClickOpen} value={item.id} aria-label="delete" size="large" color="secondary"><DeleteIcon /></IconButton></MuiThemeProvider>
                  </div>
                </div>
              ))}
            </ul>
            }
            <Dialog
              open={this.state.open}
              onClose={this.handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
              PaperProps={{
                style: {
                  backgroundColor: '#292727',
                  color: '#e66a04',
                },
              }}
            >
              <DialogTitle id="alert-dialog-title" >
                {"Attention!"}
              </DialogTitle>
              <DialogContent>
              <MuiThemeProvider theme={my_theme}><DialogContentText color="orange" id="alert-dialog-description">
                  Are your sure you want to deny access for this user?
                </DialogContentText></MuiThemeProvider>
              </DialogContent>
              <DialogActions>
                <MuiThemeProvider theme={my_theme}><Button color="primary" onClick={this.handleClose}>Take me back!</Button></MuiThemeProvider>
                <MuiThemeProvider theme={my_theme}><Button color="secondary" onClick={this.denyUser} autoFocus>
                  Deny!
                </Button></MuiThemeProvider>
              </DialogActions>
            </Dialog>
          </div>
        </div>
      );
    }
  }
}