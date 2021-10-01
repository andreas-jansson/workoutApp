import React, { Component } from "react";
import ClientManagementPage from "./ClientManagementPage";
import CreateAccountsPage from "./CreateAccountsPage";
import ManageAccountsPage from "./ManageAccountsPage";
import PendingAccountsPage from "./PendingAccountsPage";

export default class ManagementPage extends Component {
  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      selectedPage: "default",
    };
    //this.state = { sessionActive: false };
  }
  handleNavigationState = (e) => {
    e.preventDefault();
    this.setState({ selectedPage: e.target.value });
    //this.renderSelectedPage(e.target.value);
  };

  renderButtons() {
      //TODO:
      //Buttons should be rendered based on which role the user is logged in as
    return (
      <div>
        <button
          value="pending_accounts"
          onClick={this.handleNavigationState}
          className="wap-create-workout-btn"
        >
          Pending Accounts
        </button>
        <button
          value="manage_accounts"
          onClick={this.handleNavigationState}
          className="wap-create-workout-btn"
        >
          Manage Accounts
        </button>
        <button
          value="create_accounts"
          onClick={this.handleNavigationState}
          className="wap-create-workout-btn"
        >
          Create Account
        </button>
        <button
          value="client_management"
          onClick={this.handleNavigationState}
          className="wap-create-workout-btn"
        >
          Client Management
        </button>
      </div>
    );
  }
  render = () => {
    var myDict = { 
      "default": <div></div>,
      "pending_accounts": <PendingAccountsPage />,
      "manage_accounts": <ManageAccountsPage />,
      "create_accounts": <CreateAccountsPage />,
      "client_management": <ClientManagementPage />,
    };
    return (
      <div>
        {this.renderButtons()}
        {myDict[this.state.selectedPage]}
      </div>
    );
  };
}
