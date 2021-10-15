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
            workoutId: 0,
            schduleId: 0,
            workoutComplete: false,
            exerciseSelected: "",
            exerciseId: 0,
            currentSet: 0,
            weight: 0,
            rep: 1,
            time: 0,
        };

        this.loadActiveLogs = this.loadActiveLogs.bind(this);
    }

    componentDidMount =()=>{
        this.roleCheck();
        this.getScheduledWorkouts();
        this.getWorkouts();
    }

 
    roleCheck = () => {
    const requestOptions = {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    };

    fetch("/api/session-exist", requestOptions).then((response) => {
        return response.json()
    }).then((data) => {
        if(data.role_id > 2){
        window.location.replace("/dashboard")
        }
    })
    }

    handleLogSubmit = (e) =>{
        e.preventDefault();
        console.log(this.state.currentSet)
        console.log(this.state.rep)
        console.log(this.state.weight)
        console.log(this.state.time)

        var updatedSet = this.state.currentSet + 1
        //this.setState({currentSet: updatedSet})
        this.saveLog(updatedSet);

    }

    loadPreviousLogs=()=>{
        console.log("Loading previous logs!")
        console.log(this.state.schduleId)
        console.log(this.state.exerciseId)

        let targetNode = document.getElementsByClassName("awp-dynamic-previous-log-container")[0];

        if(targetNode != null){
            targetNode.remove();
        }
        console.log("after if")
   
        var exerciseId = this.state.exerciseId;
        const requestOptions={
            method: 'POST',
            headers: {'Content-Type' : 'application/json'},
            body: JSON.stringify({
                exerciseId,
            }),
        };

        fetch("/api/load-previous-log", requestOptions)
        .then((response) => {
            if (!response.ok){
                console.log("Failed get exercise!");
            }
            return response.json()}
            ).then((data)=>{
                console.log("data time")
                const elemContainer = document.createElement('div');
                elemContainer.className = "awp-dynamic-previous-log-container";
                elemContainer.id = "awp-dynamic-previous-log-container";
                //var currentSet = 0
                for(var i = 0; i < data.length; i++) {
                    console.log(data[i].id);
                    //currentSet = data[i].sets
                    var elemItem = document.createElement('div');
                    elemItem.className = "awp-previous-log-item";
                    elemItem.id = data[i].id;
                    elemItem.value = data[i].id;

                    var elemTextSetContainer = document.createElement('div');
                    elemTextSetContainer.className = "awp-previous-log-elemTextSetContainer"

                    var elemTextRepContainer = document.createElement('div');
                    elemTextRepContainer.className = "awp-previous-log-elemTextRepContainer"

                    var elemTextWeightContainer = document.createElement('div');
                    elemTextWeightContainer.className = "awp-previous-log-elemTextWeightContainer"

                    var elemTextTimeContainer = document.createElement('div');
                    elemTextTimeContainer.className = "awp-previous-log-elemTextTimeContainer"

                    var elemSet = document.createTextNode("set: " +data[i].sets);
                    var elemReps = document.createTextNode("reps: " +data[i].reps);
                    var elemWeight = document.createTextNode("weight: " +data[i].weight);
                    var elemTime = document.createTextNode("time: " +data[i].time);

                    elemContainer.appendChild(elemItem);
                    elemItem.appendChild(elemTextSetContainer);
                    elemItem.appendChild(elemTextRepContainer);
                    elemItem.appendChild(elemTextWeightContainer);
                    elemItem.appendChild(elemTextTimeContainer);

                    elemTextSetContainer.appendChild(elemSet);
                    elemTextRepContainer.appendChild(elemReps);
                    elemTextWeightContainer.appendChild(elemWeight);
                    elemTextTimeContainer.appendChild(elemTime);


                }
                console.log("done")
                //this.setState({currentSet: currentSet})
                const workoutList = document.getElementsByClassName("awp-dynamic-workout-container")[0];
                let workoutExerciseList = document.getElementsByClassName("awp-workout-logging-previous")[0].appendChild(elemContainer);
            });

    }

    handleRemoveLog=(e)=>{
        e.preventDefault();
        var id = e.target.id.split("-")[0];
        var set = e.target.id.split("-")[1];
        console.log(id)
        console.log(set)
        console.log(this.state.workoutId)


        this.RemoveLog(id, set);
    }

    RemoveLog=(id, set)=>{
        
        //call remove-log
        //decriment currentSet 
        //if there are sets with higher number, decriment all of those too
        //call loadActiveLogs()

        console.log(id)
        console.log(set)
        var setToDelete = set
        var currentSet = this.state.currentSet
        var workoutId = this.state.workoutId
        var exerciseId = this.state.exerciseId



        const requestOptions={
            method: 'POST',
            headers: {'Content-Type' : 'application/json'},
            body: JSON.stringify({
                setToDelete,
                currentSet,
                workoutId,
                exerciseId,
            }),
        }; 

        fetch("/api/delete-log", requestOptions)
        .then((response) => {
            if (!response.ok){
                console.log("Failed delete log!");
            }
            return response.json()}
            ).then((data)=>{

            this.loadActiveLogs()
    })

    }



    loadActiveLogs=()=>{
        console.log("Loading active logs!")
        console.log(this.state.schduleId)
        console.log(this.state.exerciseId)

        let targetNode = document.getElementsByClassName("awp-dynamic-active-log-container")[0];

        if(targetNode != null){
            targetNode.remove();
        }

        var schduleId = this.state.schduleId;
        var exerciseId = this.state.exerciseId;

        const requestOptions={
            method: 'POST',
            headers: {'Content-Type' : 'application/json'},
            body: JSON.stringify({
                schduleId,
                exerciseId,
            }),
        }; 

        fetch("/api/load-active-log", requestOptions)
        .then((response) => {
            if (!response.ok){
                console.log("Failed get exercise!");
            }
            return response.json()}
            ).then((data)=>{
                const elemContainer = document.createElement('div');
                elemContainer.className = "awp-dynamic-active-log-container";
                elemContainer.id = "awp-dynamic-active-log-container";
                var currentSet = 0
                for(var i = 0; i < data.length; i++) {
                    console.log(data[i].id);
                    currentSet = i+1
                    var elemItem = document.createElement('div');
                    elemItem.className = "awp-active-log-item";
                    elemItem.id =  this.state.schduleId +"-"+ data[i].sets;
                    elemItem.value = data[i].id;

                    var elemTextSetContainer = document.createElement('div');
                    elemTextSetContainer.className = "awp-active-log-elemTextSetContainer"

                    var elemTextRepContainer = document.createElement('div');
                    elemTextRepContainer.className = "awp-active-log-elemTextRepContainer"

                    var elemTextWeightContainer = document.createElement('div');
                    elemTextWeightContainer.className = "awp-active-log-elemTextWeightContainer"

                    var elemTextTimeContainer = document.createElement('div');
                    elemTextTimeContainer.className = "awp-active-log-elemTextTimeContainer"

                    var elemSet = document.createTextNode("set: " + data[i].sets);
                    var elemReps = document.createTextNode("reps: " + data[i].reps);
                    var elemWeight = document.createTextNode("weight: " + data[i].weight);
                    var elemTime = document.createTextNode("time: " +data[i].time);

                    var elemMinus = document.createElement('div');
                    elemMinus.className = "awp-active-log-elemMinus"
                    elemMinus.innerHTML = "-"
                    elemMinus.id = this.state.schduleId +"-"+ data[i].sets;
                    elemMinus.onclick = this.handleRemoveLog


                    elemContainer.appendChild(elemItem);
                    elemItem.appendChild(elemTextSetContainer);
                    elemItem.appendChild(elemTextRepContainer);
                    elemItem.appendChild(elemTextWeightContainer);
                    elemItem.appendChild(elemTextTimeContainer);
                    elemItem.appendChild(elemMinus);

                    elemTextSetContainer.appendChild(elemSet);
                    elemTextRepContainer.appendChild(elemReps);
                    elemTextWeightContainer.appendChild(elemWeight);
                    elemTextTimeContainer.appendChild(elemTime);

                }
                this.setState({currentSet: currentSet})
                const workoutList = document.getElementsByClassName("wmp-dynamic-workout-container")[0];
                let workoutExerciseList = document.getElementsByClassName("awp-workout-logging-today")[0].appendChild(elemContainer);
            });

    }

    handleSelectedScheduledWorkout = (e) =>{
        e.preventDefault();
        console.log(e.target.value)
        console.log("workoutId: " + e.target.id)
        this.setState({
            workoutSelected: e.target.value,
            schduleId: e.target.id,
            workoutId: e.target.id,
        })

        let targetNode = document.getElementsByClassName("awp-dynamic-workout-container")[0];
        let targetNode2 = document.getElementsByClassName("awp-workout-other-workouts")[0];

        if(targetNode != null){
            targetNode.remove();
        }
        if(targetNode2 != null){
            targetNode2.remove();
        }
        this.getExercises();
    }

    handleSelectedWorkout = (e) =>{
        e.preventDefault();
        console.log(e.target.value)
        console.log("workoutId: " + e.target.id)
        this.setState({
            workoutSelected: e.target.value,
            workoutId: e.target.id,
        })
       
        let targetNode = document.getElementsByClassName("awp-dynamic-workout-container")[0];
        let targetNode2 = document.getElementsByClassName("awp-workout-other-workouts")[0];

        if(targetNode != null){
            targetNode.remove();
        }
        if(targetNode2 != null){
            targetNode2.remove();
        }
        this.getExercises();

    }

    handleSelectedExercise =(e)=>{
        e.preventDefault();
        console.log(e.target.value)
        console.log(e.target.id)
        this.setState({
            exerciseSelected: e.target.value,
            exerciseId: e.target.id,
        })
        this.loadActiveLogs();
        this.loadPreviousLogs();
    }

    handleBackToWorkout=()=>{

        let targetNode = document.getElementsByClassName("awp-dynamic-exercise-added-container")[0];

        if(targetNode != null){
            targetNode.remove();
        }

        this.setState({
            workoutSelected: "",
            workoutId: 0,
            schduleId: 0,
            exerciseSelected: "",
            exerciseId: 0,
            currentSet: 0,
            weight: 0,
            rep: 1,
            time: 0,
            })
        this.getScheduledWorkouts();
        this.getWorkouts();
    }

    getScheduledWorkouts=()=>{
        fetch("/api/get-scheduled-workouts-today")
        .then((response) => {
            if (!response.ok){
                //console.log("Failed get workouts!");
            }
            return response.json()}
            ).then((data)=>{
                const elemContainer = document.createElement('div');
                elemContainer.className = "awp-dynamic-workout-container"

        
                for(var i = 0; i < data.length; i++) {
                    //unique_id = this.state.exerciseId;
                    //console.log(data[i].name);
                    var exerciseName = data[i].name.toString();
                    
                    var elemItem = document.createElement('div');
                    elemItem.className = "awp-workout-item";
                    elemItem.id = data[i].id;
                    elemItem.value = exerciseName;
                    elemItem.onclick = this.handleSelectedScheduledWorkout;

                    var elemTextContainer = document.createElement('div');
                    elemTextContainer.className = "awp-workout-elemTextContainer-btn"
                    elemTextContainer.value = exerciseName;
                    elemTextContainer.id = data[i].id;
                    var elemText = document.createTextNode(exerciseName);
                    elemText.value = exerciseName


                    elemContainer.appendChild(elemItem);
                    elemItem.appendChild(elemTextContainer)
                    elemTextContainer.appendChild(elemText);
                }
                //console.log(elemContainer)

                let targetNode = document.getElementsByClassName("awp-workout-scheduled-workouts")[0].appendChild(elemContainer);

            });
    }

    getWorkouts=()=>{
        fetch("/api/get-all-workouts")
        .then((response) => {
            if (!response.ok){
                //console.log("Failed get workouts!");
            }
            return response.json()}
            ).then((data)=>{
                const elemContainer = document.createElement('div');
                elemContainer.className = "awp-dynamic-workout-container"

        
                for(var i = 0; i < data.length; i++) {
                    //unique_id = this.state.exerciseId;
                    //console.log(data[i].name);
                    var exerciseName = data[i].name.toString();
                    
                    var elemItem = document.createElement('div');
                    elemItem.className = "awp-workout-item";
                    elemItem.id = data[i].id;
                    elemItem.value = exerciseName;
                    elemItem.onclick = this.handleSelectedWorkout;

                    var elemTextContainer = document.createElement('div');
                    elemTextContainer.className = "awp-workout-elemTextContainer-btn"
                    elemTextContainer.value = exerciseName;
                    elemTextContainer.id = data[i].id;

                    var elemText = document.createTextNode(exerciseName);
                    elemText.value = exerciseName


                    elemContainer.appendChild(elemItem);
                    elemItem.appendChild(elemTextContainer)
                    elemTextContainer.appendChild(elemText);
                }
                //console.log(elemContainer)

                let targetNode = document.getElementsByClassName("awp-workout-other-workouts")[0].appendChild(elemContainer);

            });
    }
 
    getExercises = () =>{
        //e.preventDefault();
        //console.log("value: " + e.target.innerHTML);

        fetch("/api/get-workout-exercises?name=" + this.state.workoutSelected)
        .then((response) => {
            if (!response.ok){
                console.log("Failed get exercise!");
            }
            return response.json()}
            ).then((data)=>{
                const elemContainer = document.createElement('div');
                elemContainer.className = "awp-dynamic-exercise-added-container";
                elemContainer.id = "awp-dynamic-exercise-added-container";

                for(var i = 0; i < data.length; i++) {
                    console.log(data[i].name);
                    console.log(data[i].id);

                    var exerciseName = data[i].name.toString();
                    
                    var elemItem = document.createElement('div');
                    elemItem.className = "awp-exercise-added-item";
                    elemItem.id = data[i].id;
                    elemItem.value = exerciseName;
                    elemItem.onclick = this.handleSelectedExercise;

                    var elemTextContainer = document.createElement('div');
                    elemTextContainer.className = "awp-exercise-added-elemTextContainer"
                    elemTextContainer.value = exerciseName;
                    elemTextContainer.id = data[i].id;

                    var elemText = document.createTextNode(exerciseName);
                    elemText.value = exerciseName;

                    elemContainer.appendChild(elemItem);
                    elemItem.appendChild(elemTextContainer);
                    elemTextContainer.appendChild(elemText);

                }
                const workoutList = document.getElementsByClassName("awp-dynamic-workout-container")[0];
                let workoutExerciseList = document.getElementsByClassName("awp-workout-selection-exercise")[0].appendChild(elemContainer);
            });
    }

    saveLog=(updatedSet)=>{
        console.log(this.state.selectValue)
        console.log(this.state.exerciseName)
    
        var set = updatedSet;
        var rep = this.state.rep;
        var weight = this.state.weight;
        var time = this.state.time;
        var workoutId = this.state.workoutId;
        var workoutSelected = this.state.workoutSelected;
        var schduleId = this.state.schduleId;
        var exerciseId = this.state.exerciseId;


        const requestOptions={
            method: 'POST',
            headers: {'Content-Type' : 'application/json'},
            body: JSON.stringify({
                set,
                rep,
                weight,
                time,
                workoutId,
                workoutSelected,
                schduleId,
                exerciseId,
            }),
        };
    
        fetch("/api/save-log", requestOptions)
        .then((response) => {
            if (!response.ok){
                console.log("Failed save log!");
            }
            else{
                console.log("Success save log!"); 


            }
         return response.json()}
         ).then((data)=>{
             console.log("sched-id:" + data.id)
             this.setState({
                 schduleId: data.id,
                 currentSet: set + 1
                })
            }).then(()=>{
                this.loadActiveLogs();
            })
        
    }

    getActiveLogs=()=>{

    }

    getPreviousLogs=()=>{
        
    }

    renderWorkoutComplete(){
        return(
            <div className="awp-container">
                Complete!
            </div>
        );
    }




    renderExerciseSelection(){
        if(this.state.exerciseSelected == ""){
            return(
                <div className="awp-container-exercise">
                    <div className="awp-workout-exercise-box">
                        { this.state.workoutSelected}
                        <div className="awp-workout-selection-exercise">
                        </div>
                        <button className="awp-back-btn" onClick={this.handleBackToWorkout}>
                            Back
                        </button>
                    </div>
        
                    <div className="awp-workout-logging-box">
                        Select an exercise first!
                    </div>        
                </div>
            );
        }
        else{
            return(
                <div className="awp-container-exercise">
                    <div className="awp-workout-exercise-box">
                        { this.state.workoutSelected}
                        <div className="awp-workout-selection-exercise">
                        </div>
                        <button className="awp-back-btn" onClick={this.handleBackToWorkout}>
                            Back
                        </button>
                    </div>
        
                    <div className="awp-workout-logging-box">
                        Previous Logs
                        <div className="awp-workout-logging-previous">
                        </div>
                        Current Logs
                        <div className="awp-workout-logging-today">
                        </div>
                        Create New Log
                        <div className="awp-workout-logging">
                        <div className="awp-input">Set: { this.state.currentSet +1}</div>
                        <input type="number" min="1"  className="awp-input-rep" placeholder="Reps" onChange={(e) => this.setState({rep: e.target.value }) } required/>
                        <input type="weight" min="0"  className="awp-input-weight" placeholder="Weight" onChange={(e) => this.setState({weight: e.target.value }) } required/>
                        <input type="time" className="awp-input-time" placeholder="Time"  onChange={(e) => this.setState({time: e.target.value }) }/>
                        <button type="submit" className="awp-input-btn" onClick={ this.handleLogSubmit }>
                            Add
                        </button>
                        </div>
                    </div>        
                </div>
            );
        }
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
                    Please Select a workout to continue
                </div>
            </div>
        );
    }
    


    renderActiveFlow(){
        if(this.state.workoutComplete == true){
            return(this.renderWorkoutComplete());
        }
        else if(this.state.workoutSelected == ""){
            return(this.renderWorkoutSelection());
        }
        else if(this.state.workoutSelected != ""){
            return(this.renderExerciseSelection());
        }
      

    }
    
    render(){
        return(
            this.renderActiveFlow()
         );
    }

}
