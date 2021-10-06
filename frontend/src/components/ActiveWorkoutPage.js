import React, {Component, useEffect} from "react";
import { BrowserRouter as Router, Switch, Route, Link, Redirect} from "react-router-dom";
import '../../static/css/active-workout.css';


export default class ActiveWorkoutPage extends Component{

    static defaultProps = {
    };

    constructor(props){
        super(props);

        this.state={
            sessionActive: false,
            workoutSelected: "",
            workoutComplete: false,
        };
    }

    getScheduledWorkouts=()=>{

    }

    getOtherWorkouts=()=>{
        
    }   

    renderWorkoutComplete(){

    }

    renderWorkoutLogging(){

    }

    renderWorkoutSelection(){
        return(
            <div className="awp-container">
                <div className="awp-workout-selection-box">
                    Scheduled Workout
                    <div className="awp-workout-scheduled-workouts">

                    </div>
                    Available workouts
                    <div className="awp-workout-other-workouts">

                    </div>
                    <button>
                        Continue
                    </button>
                    Please Select a workout to continue
                </div>
            </div>
        );
    }
    


    renderActiveFlow(){
       if(this.state.workoutSelected == ""){
           this.renderWorkoutSelection()
       }
       else if(this.state.workoutComplete == false){
           this.renderWorkoutLogging()
       }
       else{
           this.renderWorkoutComplete()
       }
    }
    
    render(){
        return(
            this.renderActiveFlow()
         );
    }

}
