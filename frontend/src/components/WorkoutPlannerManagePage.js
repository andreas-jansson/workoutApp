import React, { Component, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";
import '../../static/css/workout-planner-manage.css';


export default class WorkoutPlannerManagePage extends Component {
  static defaultProps = {};

  constructor(props) {
    super(props);

    this.state = {

    };
  }

  renderPlannerManage(){
    return(
      <div className="wpmp-container">
        <div className="wpmp-section wpmp-box1">
            
        </div>
        <div className="wpmp-section wpmp-box2">

        </div>
      </div>
    );
  }
  


//id scheduledDate user_id workout_id
  render() {
    return(this.renderPlannerManage());
  }
}
