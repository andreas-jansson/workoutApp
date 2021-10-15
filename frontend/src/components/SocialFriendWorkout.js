import React, {Component, useEffect} from "react";
import { BrowserRouter as Router, Switch, Route, Link, Redirect} from "react-router-dom";
import ReactDOM from 'react-dom';
//import WorkoutCreateExercisePage from "./WorkoutCreateExercisePage"
import '../../static/css/social-friend-workout.css';
import WorkoutCreateExercisePage from './WorkoutCreateExercisePage';
import Alert from "@material-ui/lab/Alert";

export default class SocialFriendWorkout extends Component{

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
            friend: this.props.friend,
        };


        this.handleViewWorkout = this.handleViewWorkout.bind(this);
        this.SaveWorkout = this.SaveWorkout.bind(this);
        this.handleCreateWorkout = this.handleCreateWorkout.bind(this);
        }

    componentDidMount = () =>{
        this.LoadAllWorkouts()
    }

    componentDidUpdate(prevProps){

        if(prevProps.friend !== this.props.friend) {
            this.setState({friend: this.props.friend});
          }
    }

    handleCallParent=()=>{
        this.props.handleUpdateParent();
  
    }

    handleReturn = (e) =>{
        e.preventDefault();
        console.log("Return!");
        this.setState({workoutOpened: false})
        //window.location.reload();
        let targetNode = document.getElementsByClassName("sfw-dynamic-exercise-added-container")[0];
        let targetNode2 = document.getElementsByClassName("sfw-dynamic-exercise-added-container")[0];

        if(targetNode != null){
            targetNode.remove();
        }
        this.LoadAllWorkouts();
    }


    handleCreateWorkout(e){
        e.preventDefault();
        console.log("Creating Workout!");

        //check child divs id's
        //if none return error else add them to a list
        //send post to api

        let exercises = document.getElementsByClassName('sfw-workout-opened-container')[0].getElementsByClassName('sfw-exercise-added-item');
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
        var user = this.state.friend
        console.log("***")
        console.log(typeof exercises_list)
        const requestOptions={
            method: 'POST',
            headers: {'Content-Type' : 'application/json'},
            body: JSON.stringify({
                workoutName,
                exercises_list,
                user,
            }),
        };

        fetch("/api/copy-friend-workouts", requestOptions)
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


 
    handleBtnReturn = () =>{
        this.setState({category: "None"})
        var element = document.getElementsByClassName("sfw-dynamic-exercise-container")[0].remove();
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
                elemContainer.className = "sfw-dynamic-exercise-added-container";
                elemContainer.id = "sfw-dynamic-exercise-added-container";
                //const formTest = document.createElement('form');
                //formTest.onclick = this.handleDeleteWorkout
                var unique_id
                for(var i = 0; i < data.length; i++) {
                    unique_id = this.state.exerciseId;
                    console.log(unique_id);
                    //console.log(data[i].name);
                    var exerciseName = data[i].name.toString();
                    
                    var elemItem = document.createElement('div');
                    elemItem.className = "sfw-exercise-added-item";
                    elemItem.id = unique_id;
                    elemItem.value = exerciseName;

                    var elemTextContainer = document.createElement('div');
                    elemTextContainer.className = "sfw-exercise-added-elemTextContainer"

                    var elemText = document.createTextNode(exerciseName);
                    elemText.value = exerciseName;

                    var elemMinus = document.createElement('Button');
                    elemMinus.className = "sfw-remove-exercise-btn";
                    //elemMinus.innerHTML = "-";
                    elemMinus.value = exerciseName;
                    elemMinus.type = "submit";
                    elemMinus.id = unique_id;

                    elemContainer.appendChild(elemItem);
                    elemItem.appendChild(elemTextContainer);
                    elemItem.appendChild(elemMinus);
                    elemTextContainer.appendChild(elemText);
                    this.setState({exerciseId : this.state.exerciseId + 1});

                }
                //console.log(elemContainer)
                //formTest.appendChild(elemContainer);
                const workoutList = document.getElementsByClassName("sfw-dynamic-workout-container")[0];
                workoutList.innerHTML='';
                let workoutExerciseList = document.getElementsByClassName("sfw-workout-opened-container")[0].appendChild(elemContainer);
            });
    }


    LoadAllWorkouts = () =>{
        console.log("loading workouts")
        let targetNode = document.getElementsByClassName("sfw-dynamic-workout-container")[0];

        if(targetNode != null){
            targetNode.remove();
        }

        fetch("/api/get-friend-workouts?user=" + this.state.friend)
        .then((response) => {
            if (!response.ok){
                console.log("Failed get workouts!");
            }
            return response.json()}
            ).then((data)=>{
                const elemContainer = document.createElement('div');
                elemContainer.className = "sfw-dynamic-workout-container"

                //const formTest = document.createElement('form');
                //formTest.onclick = this.handleDeleteWorkout
                //var unique_id
                for(var i = 0; i < data.length; i++) {
                    //unique_id = this.state.exerciseId;
                    console.log(data[i].name);
                    var exerciseName = data[i].name.toString();
                    
                    var elemItem = document.createElement('div');
                    elemItem.className = "sfw-workout-item";
                    elemItem.id = i;
                    elemItem.value = exerciseName;

                    var elemTextContainer = document.createElement('button');
                    elemTextContainer.className = "sfw-workout-elemTextContainer-btn"
                    elemTextContainer.onclick = this.handleViewWorkout;

                    var elemText = document.createTextNode(exerciseName);
                    elemText.value = exerciseName

                 

                    elemContainer.appendChild(elemItem);
                    elemItem.appendChild(elemTextContainer)
                    elemTextContainer.appendChild(elemText);
                }
                console.log(elemContainer)
                //formTest.appendChild(elemContainer);

                let targetNode = document.getElementsByClassName("sfw-workout-container")[0].appendChild(elemContainer);

            });
    }

    RenderWorkoutFlow(){
        if(this.state.workoutOpened == false){
            return(
                <div className="sfw-container">
                    <div className="sfw-section sfw-box1">
                        <div className="sfw-box1-title">
                            Your Workouts
                        </div>
                        <div className="sfw-workout-container">
                            
                        </div>
                        <div className="sfw-workout-btns-container">
                        
                        </div>
                        <button className="calendar-nav-next-btn" onClick={ this.handleCallParent }>
                             Return
                        </button>
                    </div>
                </div>
            )
            }
            else{
                return(
                    <div className="sfw-container">
                        <div className="sfw-section sfw-box1">
                            <div className="sfw-box1-title">
                                Your Workouts
                            </div>                        
                            <div className="sfw-workout-opened-container">
                                 
                            </div>
                                <div className="sfw-workout-btns-container">
                                    <button onClick = {this.handleCreateWorkout } className="sfw-workout-exercies-save-btn">
                                        Save Workout
                                    </button>
                                    <button onClick ={ this.handleReturn } className="sfw-workout-exercies-return-btn">
                                        Return
                                    </button>
                                    <div className="sfw-alert-container">
                                        <div className={`alert alert-success ${this.state.workoutSaved ? 'sfw-alert-shown' : 'sfw-alert-hidden'}`}>
                                            <Alert severity="success">Workout Saved!</Alert>
                                        </div>
                                    </div>
                                </div>
                        </div>
                    </div>
                );
            }
    }

    render(){
        return(
            this.RenderWorkoutFlow()
         );
    }

}


