import React, { Component, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";


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
    this.setState({ created : true })

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
                  <option value="Bicep">Bicep</option>
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
                  <input type="text" required className="wcp-input-name"
                  onChange={(e)=>{ this.setState({ exerciseName : e.target.value })}}/>
                  <button type="submit" 
                  className="wcp-button-submit"
                  >Create</button>
                  <button 
                  className="wcp-button-return"
                  onClick={ this.props.CreateFunction }>
                    Return
                  </button>
                </form>
            </div>
        )
    }
    else{
      return(
        <div className="wcep-created-message-container">
            <div className="wcep-created-message-icon">
              Check icon
            </div>
            <div className="wcep-created-message">
              Exsercise {this.state.exerciseName}
              <br/>
              Created!
            </div>
            <button type="submit" onClick={ () =>{ this.setState({created: false})}}>
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
