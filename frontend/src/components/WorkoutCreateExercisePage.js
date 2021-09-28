import React, { Component, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";
import '../../static/css/workout-create-exercise.css';



/*
  1. Create a handler in parent view named "handleParentUpdate"
  2. call it from parent as such: <WorkoutCreateExercisePage handleParentUpdate={ this.handleParentUpdate.bind(this)}/>

*/

export default class WorkoutCreateExercisePage extends Component {
  static defaultProps = {};

  constructor(props) {
    super(props);

    this.state = {
      sessionActive: false,
      selectValue: "Abs",
      exerciseName: "None",
      created: false,
    };
  }

  handleCreateExercise = (e) =>{
    e.preventDefault();
    console.log(this.state.selectValue)
    console.log(this.state.exerciseName)

    var exerciseName = this.state.exerciseName;
    var exerciseType = this.state.selectValue;

    const requestOptions={
      method: 'POST',
      headers: {'Content-Type' : 'application/json'},
      body: JSON.stringify({
          exerciseName,
          exerciseType,
      }),
  };

  fetch("/api/create-exercise", requestOptions)
  .then((response) => {
      if (!response.ok){
          console.log("Failed save exercise!");
      }
      else{
          console.log("Success save exercise!");
          this.setState({ created : true })

      }
  })
  }

  

  CreateExerciseFlow(){
    if(this.state.created == false){
        return(
            <div className="wcp-container">
                <div className="wcp-title">
                  Create Exercise
                </div>
                <form onSubmit={ this.handleCreateExercise }>
                <lable> Select Exercise Type</lable>
                <select className="wcp-select-type" 
                  defaultValue={this.state.selectValue} 
                  onChange={(e)=>{ this.setState({ selectValue : e.target.value })}}
                >
                  <option value="Abs">Abs</option>
                  <option value="Back">Back</option>
                  <option value="Biceps">Biceps</option>
                  <option value="Calves">Calves</option>
                  <option value="Cardio">Cardio</option>
                  <option value="Chest">Chest</option>
                  <option value="Forearms">Forearms</option>
                  <option value="Glutes">Glutes</option>
                  <option value="Legs">Legs</option>
                  <option value="Shoulders">Shoulders</option>
                  <option value="Triceps">Triceps</option>
                  <option value="Other">Other</option>
                </select>
                <lable> Select Exercise Name</lable>
                  <input type="text" className="wcp-input-name"
                  onChange={(e)=>{ this.setState({ exerciseName : e.target.value })}}/>
                  <button type="submit" 
                  className="wcp-button-submit"
                  >Create</button>
                </form>
                <div className="wcp-button-return-container">
                  <button 
                    className="wcp-button-return"
                    onClick={ this.props.handleParentUpdate }>
                      Return
                    </button>
                  </div>
            </div>
        )
    }
    else{
      return(
        <div className="wcep-created-message-container">
            <div className="wcep-created-message-icon">
            </div>
            <div className="wcep-created-message">
              <h2>{this.state.exerciseName}</h2>
              <br/>
              <h3>Created!</h3>
            </div>
            <button type="submit" className="wcep-created-message-return-btn" onClick={ this.props.handleParentUpdate }>
              Return
            </button>
        </div>

      );
    }

  }

  render() {
    return this.CreateExerciseFlow()
  }
}
