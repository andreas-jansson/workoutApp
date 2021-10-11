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
      userId: null,
      refresh: false,
    };
    //this.state = { sessionActive: false };
  }
  handleClientToAdd = (e) =>{
    console.log(e.target.value);
    var userId = e.target.value;
    const requestOptions={
      method: 'POST',
      headers: {'Content-Type' : 'application/json'},
      body: JSON.stringify({
          userId
      }),
  };

  fetch("/api/add-client-to-coach", requestOptions)
  .then((response)=> {
    if (!response.ok){
      console.log("Couldn't Add Client to Coach");
  }
  else{
      console.log("Added Client to Coach!");
      //this.setState({refresh:!this.state.refresh})
      //console.log(!this.state.refresh)
       
  }
      this.showAssignedUsers();
      this.showUnassignedUsers(); 
  })
  }
  handleClientToRemove = (e) => {
    console.log(e.target.value);
    var userId = e.target.value;
    const requestOptions={
      method: 'POST',
      headers: {'Content-Type' : 'application/json'},
      body: JSON.stringify({
          userId
      }),
  };
  fetch("/api/remove-client-from-coach", requestOptions)
  .then((response)=> {
    if (!response.ok){
      console.log("Couldn't remove Client from Coach");
  }
  else{
      console.log("Removed Client from Coach!");   
  }
      this.showAssignedUsers();
      this.showUnassignedUsers(); 
  })
  }
  

  showUnassignedUsers() {
    let targetNode = document.getElementsByClassName("cmp-unassigned-table")[0];
    let targetNode2 = document.getElementsByClassName("cmp-assigned-table")[0];
        if(targetNode != null){
            targetNode.remove();
        }
        if(targetNode2 != null){
          targetNode2.remove();
      }
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
        table.className="cmp-unassigned-table";
        const tableBody = document.createElement("tbody");
      
        for (var i = 0; i < data.length; i++) {
          console.log(data[i].fname);
          var userRow = document.createElement("tr");
          var userCell = document.createElement("td");

          var rowButtons = document.createElement("button")
          var rowButtonsText = document.createTextNode("Add");
          rowButtons.appendChild(rowButtonsText);
          rowButtons.value = data[i].id;
          rowButtons.onclick = this.handleClientToAdd;
          
          var userCellText = document.createTextNode(""+data[i].fname+" "+data[i].lname);
          userCell.appendChild(userCellText);
          userCell.appendChild(rowButtons);
          userRow.appendChild(userCell);
          tableBody.appendChild(userRow);
        }
        
        table.appendChild(tableBody);
        
        let targetNode = document.getElementsByClassName("cmp-unassigned-users")[0].appendChild(table);
      });
  }
  showAssignedUsers() {
    let targetNode = document.getElementsByClassName("cmp-assigned-table")[0];
    let targetNode2 = document.getElementsByClassName("cmp-unassigned-table")[0];
        if(targetNode != null){
            targetNode.remove();
        }
        if(targetNode2 != null){
          targetNode2.remove();
      }
    fetch("/api/get-client")
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
        table.className="cmp-assigned-table";
        const tableBody = document.createElement("tbody");
        
        for (var i = 0; i < data.length; i++) {
          console.log(data[i].fname);
          var userRow = document.createElement("tr");
          var userCell = document.createElement("td");

          var rowButtons = document.createElement("button")
          var rowButtonsText = document.createTextNode("Remove");
          rowButtons.appendChild(rowButtonsText);
          rowButtons.value = data[i].id;
          rowButtons.onclick = this.handleClientToRemove;
          
          var userCellText = document.createTextNode(""+data[i].fname+" "+data[i].lname);
          userCell.appendChild(userCellText);
          userCell.appendChild(rowButtons);
          userRow.appendChild(userCell);
          tableBody.appendChild(userRow);
        }
        
        table.appendChild(tableBody);
        
        let targetNode = document.getElementsByClassName("cmp-assigned-users")[0].appendChild(table);
      });
  }
  componentDidMount() {
    this.showUnassignedUsers();
    this.showAssignedUsers();
  }
  render() {
    return (
      <div>
        <table className="cmp-unassigned-users">
        </table>
        <table className="cmp-assigned-users">
        </table>
      </div>
    );
  }
  //Här skrivs kod
}
