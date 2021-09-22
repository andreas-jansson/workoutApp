import React, {Component, useEffect} from "react";
import { BrowserRouter as Router, Switch, Route, Link, Redirect} from "react-router-dom";
import ReactDOM from 'react-dom';



export default class WorkoutAddPage extends Component{

    static defaultProps = {
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
        this.handleAddExercise = this.handleAddExercise.bind(this)
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
        e.preventDefault;
        console.log("Btn: " + e.target.value)
    }

    ExcercisesAdded(){
        return(
            <>
            <h2>{ this.state.workoutName }</h2>
            <p>{ this.state.workoutDesc }</p>
            <div className="wap-exercise-container">

            </div>
            </>
        );
    }

    handleExerciseGroup(e){
        this.setState({ category: e.target.value });
        const exercise = e.target.value;
        let exercise_list = []
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
                formTest.onsubmit = this.handleAddExercise

                for(var i = 0; i < data.length; i++) {
                    var exerciseName = data[i].name.toString();

                    var elemItem = document.createElement('div');
                    elemItem.className = "wap-exercise-item"
                    elemItem.id = i
                    elemItem.value = exerciseName

                    var elemText = document.createTextNode(exerciseName);

                    var elemPlus = document.createElement('Button');
                    elemPlus.className = "wap-add-exercise-btn"
                    elemPlus.innerHTML = "+"
                    elemPlus.value = exerciseName
                    elemPlus.type = "submit"
                    elemPlus.onCLick = this.handleAddExercise

                    elemContainer.appendChild(elemItem);
                    elemItem.appendChild(elemText);
                    elemItem.appendChild(elemPlus);
                }
                console.log(elemContainer)
                formTest.appendChild(elemContainer);

                this.setState({
                    exersizeList: elemContainer,
                });
                
                let targetNode = document.getElementsByClassName("wap-exercise-ec-container")[0].appendChild(formTest)

            });

    }

    ExerciseCategories(){
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
            </div>
        );
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
                        required="true" 
                        workoutName={this.state.workoutName}
                        onChange={this.NameChange}/>
                        <br/>
                        Workout Description
                        <br/>
                        <input type="text" 
                        className="wap-cwi-textinput"
                        workoutDesc={this.state.workoutDesc}
                        onChange={this.DescChange}/>
                        <br/>
                        <button type="submit" className="wap-cwi-btn" onClick={this.handleBtnContinue}>Create</button>
                    </form>
                </div>
            </div>

        );
    }

    RenderWorkoutFlow(){
        console.log("state: " + this.state.workoutDesc)
        console.log("step1: " + this.state.step1complete)
        console.log("value: " + this.state.category);
        console.log("List: " + this.state.exersizeList);

        if(this.state.step1complete == false){
            console.log("true")
            return(this.CreateWorkoutInfo())
        }
        else{
            console.log("false")
            return( this.CreateWorkout() )
        }
    }

    render(){
        return(
            this.RenderWorkoutFlow()
         );
    }

}


