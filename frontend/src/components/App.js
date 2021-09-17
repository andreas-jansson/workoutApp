import React, { Component } from "react";
import { render } from "react-dom";
import StartPage from "./StartPage";

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <StartPage/>
      </div>
    );
  }
}

const appDiv = document.getElementById("app");
render(<App />, appDiv);