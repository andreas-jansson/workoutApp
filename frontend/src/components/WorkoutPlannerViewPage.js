import React, { Component, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";
import "../../static/css/workout-planner.css";
import CalendarPage from "./CalendarPage";

export default class WorkoutPlannerViewPage extends Component {
  static defaultProps = {};

  constructor(props) {
    super(props);

    this.state = {
      userId: 0,
    };
  }

  getUserId() {
    fetch("/api/get-user-id")
      .then((response) => {
        /*{<CalendarPage user={32} />}*/
        return response.json();
      })
      .then((data) => {
        this.setState({ userId: data });
      });
  }
  componentDidMount = () => {
    this.getUserId();
  }
  
  render() {
    
    return (
      <div className="wpmp-section wpmp-box2">{<CalendarPage user={this.state.userId} />}</div>
    );
  }
}
