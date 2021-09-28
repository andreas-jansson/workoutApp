import React, {Component, useEffect} from "react";
import { BrowserRouter as Router, Switch, Route, Link, Redirect} from "react-router-dom";
import ReactDOM from 'react-dom';
//import WorkoutCreateExercisePage from "./WorkoutCreateExercisePage"
import '../../static/css/workout-managment.css';
import WorkoutCreateExercisePage from './WorkoutCreateExercisePage';
import Alert from "@material-ui/lab/Alert";

export default class WorkoutManagmentPage extends Component{

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
        this.handleDeleteWorkout = this.handleDeleteWorkout.bind(this);
        this.handleViewWorkout = this.handleViewWorkout.bind(this);
        this.SaveWorkout = this.SaveWorkout.bind(this);
        this.handleCreateWorkout = this.handleCreateWorkout.bind(this);
        }

    componentDidMount = () =>{
        this.LoadAllWorkouts()
    }

    handleDeleteWorkout = (e) =>{
        e.preventDefault();
        console.log("Delete workouts!");
        //console.log(e.target.value);
        var confirm_choice = confirm('Are you sure you wish to delete ' + e.target.value +'?')
        if(confirm_choice == true){
            console.log("Deleted!");
            this.DeleteWorkout(e.target.value);
        }
        else{
            console.log("No can do");
        }
    }

    handleReturn = (e) =>{
        e.preventDefault();
        console.log("Return!");
        window.location.reload();
    }

    handleRemoveExercise(e){
        e.preventDefault();
        console.log("removing id: " + e.target.id);

        const removeItem = document.getElementById(e.target.id)
        removeItem.remove();

    }

    handleCreateWorkout(e){
        e.preventDefault();
        console.log("Creating Workout!");

        //check child divs id's
        //if none return error else add them to a list
        //send post to api

        let exercises = document.getElementsByClassName('wmp-workout-opened-container')[0].getElementsByClassName('wmp-exercise-added-item');
        console.log(exercises);
        var exercises_list=[]
        if(exercises.length > 0){
            console.log("Exercises exist");
            for(var i=0;i<exercises.length;i++){
                console.log(exercises[i].value)
                exercises_list.push(exercises[i].value)
            }
            console.log(exercises_list);    
            this.SaveWorkout(exercises_list);

        }
        else{
            console.log("Exercises missing");
            alert("No exercises added yet")
        }

    }

    SaveWorkout(exercises_list){
        
        let workoutName = this.state.workoutName;
        console.log("***")
        console.log(typeof exercises_list)
        const requestOptions={
            method: 'POST',
            headers: {'Content-Type' : 'application/json'},
            body: JSON.stringify({
                workoutName,
                exercises_list,
            }),
        };

        fetch("/api/update-workout", requestOptions)
        .then((response) => {
            if (!response.ok){
                console.log("Failed save workout!");
            }
            else{
                console.log("Success save workout!");
                this.setState({ workoutSaved: true });
                setTimeout(() => {
                    this.setState({ workoutSaved: false });
                  }, 100);

            }
        }).then(

        )
    }

    DeleteWorkout(workoutName){
        
        const requestOptions={
            method: 'POST',
            headers: {'Content-Type' : 'application/json'},
            body: JSON.stringify({
                workoutName,
            }),
        };

        fetch("/api/delete-workout", requestOptions)
        .then((response) => {
            if (!response.ok){
                console.log("Failed to delete workout!");
            }
            else{
                console.log("Success deleteing workout!");
                this.setState({ workoutSaved: true });
                this.setState({ workoutSaved: false });
                window.location.reload();
            }
        })
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
                elemContainer.className = "wmp-dynamic-exercise-container";
                elemContainer.id = "wmp-dynamic-exercise-container";
                //const formTest = document.createElement('form');
                //formTest.onclick = this.handleDeleteWorkout
                //var unique_id
                for(var i = 0; i < data.length; i++) {
                    //unique_id = this.state.exerciseId;
                    //console.log(data[i].name);
                    var exerciseName = data[i].name.toString();
                    
                    var elemItem = document.createElement('div');
                    elemItem.className = "wmp-exercise-added-item";
                    elemItem.id = i;
                    elemItem.value = exerciseName;

                    var elemTextContainer = document.createElement('div');
                    elemTextContainer.className = "wmp-exercise-added-elemTextContainer"

                    var elemText = document.createTextNode(exerciseName);
                    elemText.value = exerciseName;

                    var elemMinus = document.createElement('Button');
                    elemMinus.className = "wmp-remove-exercise-btn";
                    elemMinus.innerHTML = "-";
                    elemMinus.value = exerciseName;
                    elemMinus.type = "submit";
                    elemMinus.id = i;
                    elemMinus.onclick = this.handleRemoveExercise;

                    elemContainer.appendChild(elemItem);
                    elemItem.appendChild(elemTextContainer);
                    elemItem.appendChild(elemMinus);
                    elemTextContainer.appendChild(elemText);
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

                    var elemMinus = document.createElement('Button');
                    elemMinus.className = "wmp-remove-workout-btn";
                    elemMinus.innerHTML = "-";
                    elemMinus.value = exerciseName;
                    elemMinus.type = "submit";
                    elemMinus.id = i;
                    elemMinus.onclick = this.handleDeleteWorkout

                    elemContainer.appendChild(elemItem);
                    elemItem.appendChild(elemTextContainer)
                    elemItem.appendChild(elemMinus);
                    elemTextContainer.appendChild(elemText);
                }
                console.log(elemContainer)
                //formTest.appendChild(elemContainer);

             
                
                let targetNode = document.getElementsByClassName("wmp-workout-container")[0].appendChild(elemContainer);

            });
    }

    RenderWorkoutFlow(){
        return(
            <div className="wmp-container">
                <div className="wmp-section wmp-box1">
                    <div className="wmp-box1-title">
                        Your Workouts
                    </div>
                    { this.state.workoutOpened? 
                    
                    <div className="wmp-workout-opened-container">
                        
                        
                     </div>
                    :
                    <div className="wmp-workout-container">
                        
                    </div>
                    }
                    { this.state.workoutOpened&& 
                        <div className="wmp-workout-btns-container">
                            <button onClick = {this.handleCreateWorkout } className="wmp-workout-exercies-save-btn">
                                Save Workout
                            </button>
                            <button onClick ={ this.handleReturn } className="wmp-workout-exercies-return-btn">
                                Return
                            </button>
                            <div className="wmp-alert-container">
                                <div className={`alert alert-success ${this.state.workoutSaved ? 'wmp-alert-shown' : 'wmp-alert-hidden'}`}>
                                    <Alert severity="success">Workout Saved!</Alert>
                                </div>
                            </div>
                        </div>
                    }
                </div>
                <div className="wmp-section wmp-box2">
                    <div className="wmp-exercise-container">
                            exercise list
                    </div>
                </div>
            </div>
        );
    }

    render(){
        return(
            this.RenderWorkoutFlow()
         );
    }

}


