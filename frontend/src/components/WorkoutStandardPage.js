import React, {Component, useEffect} from "react";
import { BrowserRouter as Router, Switch, Route, Link, Redirect} from "react-router-dom";
import ReactDOM from 'react-dom';
//import WorkoutCreateExercisePage from "./WorkoutCreateExercisePage"
import '../../static/css/workout-managment.css';
import WorkoutCreateExercisePage from './WorkoutCreateExercisePage';
import Alert from "@material-ui/lab/Alert";

export default class WorkoutStandardPage extends Component{

    static defaultProps = {
        createExerciseView: false,
        
    };

    constructor(props){
        super(props);

        this.state={
            sessionActive: false,
            workoutName: "",
            workoutDesc: "",
            category: "None",
            exersizeList: "",
            exerciseId: 0,
            workoutSaved: false,
            createExerciseView: this.props.createExerciseView,
            workoutOpened: false,
        };


        //this.handleParentUpdate = this.handleParentUpdate.bind(this);
        this.handleViewWorkout = this.handleViewWorkout.bind(this);
        }

    componentDidMount = () =>{
        this.LoadAllWorkouts()
    }


    handleReturn = (e) =>{
        e.preventDefault();
        console.log("Return!");
        this.setState({workoutOpened: false})
        window.location.reload();
    }



    handleBtnReturn = () =>{
        this.setState({category: "None"})
        var element = document.getElementsByClassName("wmp-dynamic-exercise-container")[0].remove();
    }

    handleViewWorkout = (e) =>{
        e.preventDefault();
        console.log("Viewing workouts!");
        console.log("value: " + e.target.innerHTML);
        this.setState({
            workoutOpened: true,
            workoutName: e.target.innerHTML
        });


        fetch("/api/get-workout-exercises?name=" + e.target.innerHTML)
        .then((response) => {
            if (!response.ok){
                console.log("Failed get exercise!");
            }
            return response.json()}
            ).then((data)=>{
                const elemContainer = document.createElement('div');
                elemContainer.className = "wmp-dynamic-exercise-added-container";
                elemContainer.id = "wmp-dynamic-exercise-added-container";
                //const formTest = document.createElement('form');
                //formTest.onclick = this.handleDeleteWorkout
                var unique_id
                for(var i = 0; i < data.length; i++) {
                    unique_id = this.state.exerciseId;
                    console.log(unique_id);
                    //console.log(data[i].name);
                    var exerciseName = data[i].name.toString();
                    
                    var elemItem = document.createElement('div');
                    elemItem.className = "wmp-exercise-added-item";
                    elemItem.id = unique_id;
                    elemItem.value = exerciseName;

                    var elemTextContainer = document.createElement('div');
                    elemTextContainer.className = "wmp-exercise-added-elemTextContainer"

                    var elemText = document.createTextNode(exerciseName);
                    elemText.value = exerciseName;

                 

                    elemContainer.appendChild(elemItem);
                    elemItem.appendChild(elemTextContainer);
                    elemTextContainer.appendChild(elemText);
                    this.setState({exerciseId : this.state.exerciseId + 1});

                }
                //console.log(elemContainer)
                //formTest.appendChild(elemContainer);
                const workoutList = document.getElementsByClassName("wmp-dynamic-workout-container")[0];
                workoutList.innerHTML='';
                let workoutExerciseList = document.getElementsByClassName("wmp-workout-opened-container")[0].appendChild(elemContainer);
            });
    }

    

    LoadAllWorkouts = () =>{
        console.log("loading workouts")

        fetch("/api/get-workouts")
        .then((response) => {
            if (!response.ok){
                console.log("Failed get workouts!");
            }
            return response.json()}
            ).then((data)=>{
                const elemContainer = document.createElement('div');
                elemContainer.className = "wmp-dynamic-workout-container"

                //const formTest = document.createElement('form');
                //formTest.onclick = this.handleDeleteWorkout
                //var unique_id
                for(var i = 0; i < data.length; i++) {
                    //unique_id = this.state.exerciseId;
                    console.log(data[i].name);
                    var exerciseName = data[i].name.toString();
                    
                    var elemItem = document.createElement('div');
                    elemItem.className = "wmp-workout-item";
                    elemItem.id = i;
                    elemItem.value = exerciseName;

                    var elemTextContainer = document.createElement('button');
                    elemTextContainer.className = "wmp-workout-elemTextContainer-btn"
                    elemTextContainer.onclick = this.handleViewWorkout;

                    var elemText = document.createTextNode(exerciseName);
                    elemText.value = exerciseName

                    elemContainer.appendChild(elemItem);
                    elemItem.appendChild(elemTextContainer)
                    elemTextContainer.appendChild(elemText);
                }
                console.log(elemContainer)
                //formTest.appendChild(elemContainer);

                let targetNode = document.getElementsByClassName("wmp-workout-container")[0].appendChild(elemContainer);

            });
    }

    RenderWorkoutFlow(){
        if(this.state.workoutOpened == true){
            if(this.state.category=="None"){
                return(
                    <div className="wmp-container">
                        <div className="wmp-section wmp-box1">
                            <div className="wmp-box1-title">
                                Standard Workouts
                            </div>                        
                            <div className="wmp-workout-opened-container">
                                 
                            </div>
                                <div className="wmp-workout-btns-container">
                                    <button onClick ={ this.handleReturn } className="wmp-workout-exercies-return-btn">
                                        Return
                                    </button>
                                    <div className="wmp-alert-container">
                                        <div className={`alert alert-success ${this.state.workoutSaved ? 'wmp-alert-shown' : 'wmp-alert-hidden'}`}>
                                            <Alert severity="success">Workout Saved!</Alert>
                                        </div>
                                    </div>
                                </div>
                        </div>
              
                    </div>
                );
            }
            else{
                return(
                    <div className="wmp-container">
                        <div className="wmp-section wmp-box1">
                            <div className="wmp-box1-title">
                                Standard Workouts
                            </div>                        
                            <div className="wmp-workout-opened-container">
                                 
                            </div>
                                <div className="wmp-workout-btns-container">
                                    <button onClick ={ this.handleReturn } className="wmp-workout-exercies-return-btn">
                                        Return
                                    </button>
    
                                </div>
                        </div>
                    </div>
                );
            }
        }
        else{
            return(
                <div className="wmp-container">
                    <div className="wmp-section wmp-box1">
                        <div className="wmp-box1-title">
                            Standard Workouts
                        </div>
                        <div className="wmp-workout-container">
                            
                        </div>
                        <div className="wmp-workout-btns-container">
                        
                        </div>
                    </div>
                </div>
            )
        }
    }

    render(){
        return(
            this.RenderWorkoutFlow()
         );
    }

}


