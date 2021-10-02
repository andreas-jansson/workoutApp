import React, { Component, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";
import '../../static/css/workout-planner.css';


export default class WorkoutPlannerViewPage extends Component {
  static defaultProps = {};

  constructor(props) {
    super(props);

    this.state = {

    };
  }
  

renderPlannerView(){
  return(
    <div className="wpvp-container">
        View
    </div>
  );
}


  render() {
    return(this.renderPlannerView());
  }
}
