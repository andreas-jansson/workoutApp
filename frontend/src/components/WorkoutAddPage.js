import React, {Component, useEffect} from "react";
import { BrowserRouter as Router, Switch, Route, Link, Redirect} from "react-router-dom";
import ReactDOM from 'react-dom';
//import WorkoutCreateExercisePage from "./WorkoutCreateExercisePage"
import '../../static/css/workout-add.css';
import WorkoutCreateExercisePage from './WorkoutCreateExercisePage';

export default class WorkoutAddPage extends Component{

    static defaultProps = {
        createExerciseView: false,
        
    };

    constructor(props){
        super(props);

        this.state={
            sessionActive: false,
            workoutName: "",
            workoutDesc: "",
            step1complete: false, /* initial name + description, true if submitted */
            category: "None",
            exersizeList: "",
            exerciseId: 0,
            workoutSaved: false,
            createExerciseView: this.props.createExerciseView,
        };

        this.CreateWorkout = this.CreateWorkout.bind(this);
        this.CreateWorkoutInfo = this.CreateWorkoutInfo.bind(this);
        this.RenderWorkoutFlow = this.RenderWorkoutFlow.bind(this);
        this.ExcercisesAdded = this.ExcercisesAdded.bind(this);
        this.ExerciseCategories = this.ExerciseCategories.bind(this);
        this.NameChange = this.NameChange.bind(this);
        this.DescChange = this.DescChange.bind(this);
        this.handleExerciseGroup = this.handleExerciseGroup.bind(this);
        this.ExerciseCategory = this.ExerciseCategory.bind(this);
        this.handleAddExercise = this.handleAddExercise.bind(this);
        this.handleCreateWorkout = this.handleCreateWorkout.bind(this);
        this.SaveWorkout = this.SaveWorkout.bind(this);
        this.handleParentUpdate = this.handleParentUpdate.bind(this);
    }

    handleBtnContinue= (e) =>{
        e.preventDefault();
        this.setState({step1complete: true})
        console.log("step1: " + this.state.step1complete)
    }

    handleBtnReturn = () =>{
        this.setState({category: "None"})
    }

    NameChange(event) {
        this.setState({ workoutName: event.target.value });
    }
    
    DescChange(event) {
        this.setState({ workoutDesc: event.target.value });
    }
    
    handleAddExercise(e){
        e.preventDefault();
        var unique_id = this.state.exerciseId;

        console.log("add value: " + e.target.value);
        console.log("add id: " + unique_id);


        const formTest = document.createElement('form');
        formTest.onclick = this.handleRemoveExercise

        const elemAddedItem = document.createElement('div');
        elemAddedItem.className = "wap-dynamic-exercise-added-item";
        elemAddedItem.value = e.target.value;
        //elemAddedItem.innerHTML = e.target.value;
        elemAddedItem.id = unique_id;

        var elemTextContainer = document.createElement('div');
        elemTextContainer.className = "wap-exercise-added-elemTextContainer";
        var elemText = document.createTextNode(e.target.value);

        const elemMinus = document.createElement('Button');
        elemMinus.className = "wap-remove-exercise-btn";
        elemMinus.innerHTML = "-";
        elemMinus.value = unique_id;
        elemMinus.type = "submit";

        elemTextContainer.appendChild(elemText);
        elemAddedItem.appendChild(elemMinus);
        elemAddedItem.appendChild(elemTextContainer);
        formTest.appendChild(elemAddedItem);

        let targetNode = document.getElementsByClassName("wap-exercise-container")[0].appendChild(formTest)
        this.setState({exerciseId : this.state.exerciseId + 1});

    }

    handleRemoveExercise(e){
        e.preventDefault();
        console.log("removing value: " + e.target.value);
        console.log("removing id: " + e.target.id);

        const removeItem = document.getElementById(e.target.value)
        removeItem.remove();

    }

    handleCreateWorkout(e){
        e.preventDefault();
        console.log("Creating Workout!");

        //check child divs id's
        //if none return error else add them to a list
        //send post to api

        let exercises = document.getElementsByClassName('wap-exercise-container')[0].getElementsByClassName('wap-dynamic-exercise-added-item');
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
        let workoutDesc = this.state.workoutDesc;
        console.log("***")
        console.log(typeof exercises_list)
        const requestOptions={
            method: 'POST',
            headers: {'Content-Type' : 'application/json'},
            body: JSON.stringify({
                workoutName,
                workoutDesc,
                exercises_list,
            }),
        };

        fetch("/api/create-workout", requestOptions)
        .then((response) => {
            if (!response.ok){
                console.log("Failed save workout!");
            }
            else{
                console.log("Success save workout!");
                this.setState({ workoutSaved: true });

            }
        })
    }

    ExcercisesAdded(){
        return(
            <>
            <h2>{ this.state.workoutName }</h2>
            <p>{ this.state.workoutDesc }</p>
            <div className="wap-exercise-container">
                
            </div>
            <button onClick={ this.handleCreateWorkout } className="wap-create-workout-btn">
                Create Workout
            </button>
            </>
        );
    }

    handleExerciseGroup(e){
        this.setState({ category: e.target.value });
        const exercise = e.target.value;
        let exercise_list = [];
        /* fetches all exercies for selected group */

        fetch("/api/get-exercises?type=" + exercise)
        .then((response) => {
            if (!response.ok){
                console.log("Failed get exercises!");
            }
            return response.json()}
            ).then((data)=>{
                const elemContainer = document.createElement('div');
                elemContainer.className = "wap-dynamic-exercise-container"

                const formTest = document.createElement('form');
                formTest.onclick = this.handleAddExercise
                //var unique_id
                for(var i = 0; i < data.length; i++) {
                    //unique_id = this.state.exerciseId;
                    var exerciseName = data[i].name.toString();
                    
                    var elemItem = document.createElement('div');
                    elemItem.className = "wap-exercise-item";
                    elemItem.id = i;
                    elemItem.value = exerciseName;

                    var elemTextContainer = document.createElement('div');
                    elemTextContainer.className = "wap-exercise-elemTextContainer"
                    var elemText = document.createTextNode(exerciseName);
                    elemText.value = exerciseName

                    var elemPlus = document.createElement('Button');
                    elemPlus.className = "wap-add-exercise-btn";
                    elemPlus.innerHTML = "+";
                    elemPlus.value = exerciseName;
                    elemPlus.type = "submit";
                    elemPlus.id = i;

                    elemContainer.appendChild(elemItem);
                    elemItem.appendChild(elemTextContainer)
                    elemItem.appendChild(elemPlus);
                    elemTextContainer.appendChild(elemText);
                    //this.setState({exerciseId : this.state.exerciseId + 1});
                }
                console.log(elemContainer)
                formTest.appendChild(elemContainer);

                this.setState({
                    exersizeList: elemContainer,
                    
                });
                
                let targetNode = document.getElementsByClassName("wap-exercise-ec-container")[0].appendChild(formTest);

            });

    }

    handleParentUpdate(){
        console.log("Pressed!");
        this.setState({createExerciseView: false});
    }

    ExerciseCategories(){
        if( this.state.createExerciseView == false){
            return(
                <div className="wap-exercise-cat-container">
                    <div className="wap-exercise-cat-container-left">
                        <button className="wap-exercise-btn" value="Abs" onClick={this.handleExerciseGroup }>
                            Abs
                        </button>
                        <button className="wap-exercise-btn" value="Back" onClick={this.handleExerciseGroup }>
                            Back
                        </button>
                        <button className="wap-exercise-btn" value="Biceps" onClick={this.handleExerciseGroup }>
                            Biceps
                        </button>
                        <button className="wap-exercise-btn" value="Calves" onClick={this.handleExerciseGroup }>
                            Calves
                        </button>
                        <button className="wap-exercise-btn" value="Cardio" onClick={this.handleExerciseGroup }>
                            Cardio
                        </button>
                        <button className="wap-exercise-btn" value="Chest" onClick={this.handleExerciseGroup }>
                            Chest
                        </button>
                    </div>
                    <div className="wap-exercise-cat-container-right">
                        <button className="wap-exercise-btn" value="Forearms" onClick={this.handleExerciseGroup }>
                            Forearms
                        </button>
                        <button className="wap-exercise-btn" value="Glutes" onClick={this.handleExerciseGroup }>
                            Glutes
                        </button>
                        <button className="wap-exercise-btn" value="Legs" onClick={this.handleExerciseGroup }>
                            Legs
                        </button>
                        <button className="wap-exercise-btn" value="Shoulders" onClick={this.handleExerciseGroup }>
                            Shoulders
                        </button>
                        <button className="wap-exercise-btn" value="Triceps" onClick={this.handleExerciseGroup }>
                            Triceps
                        </button>
                        <button className="wap-exercise-btn" value="Other" onClick={this.handleExerciseGroup }>
                            Other
                        </button>
                    </div>
                    <button className="wap-exercise-btn-create" onClick={ () => { this.setState({ createExerciseView: true})} }>
                            Create Exercise
                    </button>
                </div>
            );
        }
        else{
            return(
                <WorkoutCreateExercisePage handleParentUpdate={ this.handleParentUpdate.bind(this)}/>
            )
        }

    }

    ExerciseCategory(){
        return(
                <>
                    <div className="wap-ec-container">
                        <button type="submit" className="wap-cwi-btn-return" onClick={this.handleBtnReturn}>Back</button>
                        <p>{ this.state.category }</p>
                     </div>
                <div className="wap-exercise-ec-container">
                        {/* Dynamic list fills this */}
                </div>
            </>
        );
    }

    /*
    CategorySelector(){
        if( this.state.category == "None"){
        }
        else if( this.state.category == "Abs"){
                        
        }
        else if( this.state.category == "Back"){
                        
        }
        else if( this.state.category == "Biceps"){
                        
        }
        else if( this.state.category == "Calves"){
                        
        }
        else if( this.state.category == "Cardio"){
                        
        }
        else if( this.state.category == "Chest"){
                        
        }
        else if( this.state.category == "Forearms"){
                        
        }
        else if( this.state.category == "Glutes"){
                        
        }
        else if( this.state.category == "Legs"){
                        
        }
        else if( this.state.category == "Shoulders"){
                        
        }
        else if( this.state.category == "Triceps"){
                        
        }
        else if( this.state.category == "Other"){
                        
        }
    }*/

    CreateWorkout(){
         if( this.state.category != "None"){
            return(
                <div className="wap-container">
                    <div className="wap-section wap-box1">
                    { this.ExcercisesAdded() }
                </div>
                <div className="wap-section wap-box2">
                    { this.ExerciseCategory() }
                </div>
                </div>
            );
         }
         else{
             return(
                <div className="wap-container">
                    <div className="wap-section wap-box1">
                    { this.ExcercisesAdded() }
                </div>
                <div className="wap-section wap-box2">
                    { this.ExerciseCategories() }
                </div>
                </div>
            );
        }
    }

    CreateWorkoutInfo(){
        return(
            <div className="wap-container">
                <div className="wap-cwi-box">
                    <h2>Create Workout</h2>
                   <form> 
                        Workout Name
                        <br/>
                        <input type="text" 
                        className="wap-cwi-textinput" 
                        required
                        workoutName={this.state.workoutName}
                        onChange={this.NameChange}/>
                        <br/>
                        Workout Description
                        <br/>
                        <input type="text" 
                        className="wap-cwi-textinput"
                        required
                        workoutDesc={this.state.workoutDesc}
                        onChange={this.DescChange}/>
                        <br/>
                        <button type="submit" className="wap-cwi-btn" onClick={this.handleBtnContinue}>Create</button>
                    </form>
                </div>
            </div>

        );
    }

    WorkoutSavedPromt(){
        return(
        <div className="wap-saved-prompt-container">
            <div className="wap-saved-prompt-box">
                <div className="wap-saved-prompt-message">
                    <p>Workout: { this.state.workoutName} saved!</p>
                </div>
            <button className="wap-saved-prompt-btn" onClick={ () => { window.location.href='/workout'}}>Return</button>
            </div>
        </div>
        );
    }

    RenderWorkoutFlow(){
        /*console.log("state: " + this.state.workoutDesc)
        console.log("step1: " + this.state.step1complete)
        console.log("value: " + this.state.category);
        console.log("List: " + this.state.exersizeList);*/

        if(this.state.step1complete == false){
            /*console.log("true")*/
            return(this.CreateWorkoutInfo())
        }
        else if(this.state.workoutSaved == true){
            return(this.WorkoutSavedPromt())
        }
        else{
            /*console.log("false")*/
            return( this.CreateWorkout() )
        }
    }

    render(){
        return(
            this.RenderWorkoutFlow()
         );
    }

}


