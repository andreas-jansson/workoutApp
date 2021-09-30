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
export default class ManageAccountsPage extends Component {
  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      selectedPage: "default",
    };
    //this.state = { sessionActive: false };
  }
  render(){
    return(<div>Manage Accounts Page!</div>)
}
  //Här skrivs kod
}