import React, { Component, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";
import '../../static/css/workout-planner.css';


export default class WorkoutPlannerPage extends Component {
  static defaultProps = {};

  constructor(props) {
    super(props);

    this.state = {

    };
  }

  handleMainOption = (e) =>{
    if(e.target.value == "manage"){
      this.props.history.push("/workout-planner-manage");
    }
    else{
      this.props.history.push("/workout-planner-view");
    }
}


renderPlannerFlow(){
  return(
    <div className="wpp-container">
      <button className="wpp-navigation nav-box1" value="manage" onClick={ this.handleMainOption }>
        Manage Schedule
        <div className="wpp-lineStyle" />
      </button>
      <button className="wpp-navigation nav-box2" value="view" onClick={ this.handleMainOption }>
        View Schedule
        <div className="wpp-lineStyle" />
      </button>
    </div>
  );

}


//id scheduledDate user_id workout_id
  render() {
    return(this.renderPlannerFlow());
  }
}
