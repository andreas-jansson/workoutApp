import React, { Component } from "react";
import { render } from "react-dom";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";
import StartPage from "./StartPage";
import DashboardPage from "./DashboardPage";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import WorkoutPage from "./WorkoutPage";
import WorkoutAddPage from "./WorkoutAddPage";
import WorkoutManagementPage from "./WorkoutManagementPage";
import ReactDOM from "react-dom";
export default class ClientManagementPage extends Component {
  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      selectedPage: "default",
      users: [],
      open: false,
      coachId: null,
    };
    //this.state = { sessionActive: false };
  }
  handleClickOpen = (e) => {
    this.setState({ open: true });
  };
  showUnassignedUsers() {
    fetch("/api/list-unassigned-clients")
      .then((response) => {
        if (!response.ok) {
          console.log("No users loaded!");
        } else {
          console.log("Loaded one or more users!");
        }
        return response.json();
      })
      .then((data) => {
        const table = document.createElement("table");
        const tableBody = document.createElement("tbody");
        for (var i = 0; i < data.length; i++) {
          console.log(data[i].fname);
          var userRow = document.createElement("tr");
          var userCell = document.createElement("td");
          var userCellText = document.createTextNode(""+data[i].fname+" "+data[i].lname);
          userCell.appendChild(userCellText);
          userRow.appendChild(userCell);
          tableBody.appendChild(userRow);
        }
        table.appendChild(tableBody);
        let targetNode = document.getElementsByClassName("cmp-unassigned-users")[0].appendChild(table);
      });
  }
  componentDidMount() {
    this.showUnassignedUsers();
  }
  render() {
    return (
      <table className="cmp-unassigned-users">
        {/*pls do stuff*/ }
      </table>
    );
  }
  //Här skrivs kod
}
