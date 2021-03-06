import React, { Component, useEffect, useMemo, history } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";
import '../../static/css/workout-planner-manage.css';
import Alert from "@material-ui/lab/Alert";
import CalendarPage from './CalendarPage'

export default class WorkoutPlannerManagePage extends Component {
  static defaultProps = {
      
  };

  constructor(props) {
    super(props);
    this.props = props;

    this.state = {
        selctedWorkout: "None",
        mon: false,
        tue: false,
        wed: false,
        thu: false,
        fri: false,
        sat: false,
        sun: false,
        dateStart: new Date().toLocaleDateString(),
        dateEnd: new Date().toLocaleDateString(),
        restWeek: 0,
        errorInput: false,
        errorMsg: "",
        updateCalendar: false,
        reRender:false,
        roleType: 1,
        userId: this.props.history.location.state.userId,
        userInfo: this.props.history.location.state.textValue,
    };
    console.log(typeof this.state.userId)
    console.log(this.state.userId)
    //console.log(this.props.history.location.state.userId);
  }

    componentDidMount = () =>{
        this.LoadAllWorkouts();
        this.sessionExist();
    }

    /* redirects if session exists */
    sessionExist = () => {
        const requestOptions = {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        };
    
        fetch("/api/session-exist", requestOptions).then((response) => {
          if (response.status == 202) {
            //console.log("session exists");
            this.setState({ sessionActive: true });
            return response.json()
          } else {
            //console.log("Session Missing");
          }
          return response.json()
        }).then((data)=>{
            if(this.state.userId != ""){
                this.setState({ 
                    roleType: data.role_id,
                });
            }
            else{
                //this.props.history.push("/workout-planner");
            }
            
            
        })
           
      }


    LoadAllWorkouts = () =>{
        //console.log("loading workouts")

        fetch("/api/get-workouts")
        .then((response) => {
            if (!response.ok){
                //console.log("Failed get workouts!");
            }
            return response.json()}
            ).then((data)=>{
                const elemContainer = document.createElement('div');
                elemContainer.className = "wpmp-dynamic-workout-container"

        
                for(var i = 0; i < data.length; i++) {
                    //unique_id = this.state.exerciseId;
                    //console.log(data[i].name);
                    var exerciseName = data[i].name.toString();
                    
                    var elemItem = document.createElement('div');
                    elemItem.className = "wpmp-workout-item";
                    elemItem.id = i+100;
                    elemItem.value = exerciseName;
                    elemItem.onclick = this.handleSelectWorkout;

                    var elemTextContainer = document.createElement('div');
                    elemTextContainer.className = "wpmp-workout-elemTextContainer-btn"
                    elemTextContainer.value = exerciseName;

                    var elemText = document.createTextNode(exerciseName);
                    //elemText.value = exerciseName


                    elemContainer.appendChild(elemItem);
                    elemItem.appendChild(elemTextContainer)
                    elemTextContainer.appendChild(elemText);
                }
                //console.log(elemContainer)

                let targetNode = document.getElementsByClassName("wpmp-workout-selection-container")[0].appendChild(elemContainer);

            });
    }

    handleSelectWorkout = (e) =>{
        e.preventDefault();
        this.setState({selctedWorkout: e.target.value});
        let targetNode = document.getElementsByClassName("wpmp-dynamic-workout-container")[0].remove();

    }

    handleAddCalendar=(e)=>{
        e.preventDefault();
        var mon = this.state.mon;
        var tue = this.state.tue;
        var wed = this.state.wed;
        var thu = this.state.thu;
        var fri = this.state.fri;
        var sat = this.state.sat;
        var sun = this.state.sun;

        var dateStart = this.state.dateStart;
        var dateEnd = this.state.dateEnd;
        var restWeek = this.state.restWeek;
        console.log(mon)
        console.log(tue)
        console.log(wed)
        console.log(thu)
        console.log(fri)
        console.log(sat)
        console.log(sun)
        console.log(dateStart)
        console.log(dateEnd)
        console.log(restWeek)


        if(restWeek == ''){
            this.setState({restWeek: 0})
        }

        //if no day selected - return error
        //if endate is before startdate - return error
        //if startdate < todays adte - return error
        // if restweek is <1 - return error
        var errorMessage = ""
        let today = new Date().toISOString().slice(0, 10)
        if(mon == false && tue == false && wed == false && thu == false && fri == false && sat == false && sun == false){
            console.log("No days selected")
            errorMessage = "No day selected"
        }
        else if(dateStart > dateEnd){
            console.log("End date is before start date")
            errorMessage = "End date cannot be earlier than the start date"
        }
        else if(today > dateStart){
            console.log("End date is before start date")
            errorMessage = "Start date cannot be a past date"
        }
        else if(restWeek < 0 || restWeek == 1){
            console.log("Bad restweek")
            errorMessage = "Rest week must be 0 or greater than 1"
        }

        console.log(errorMessage)



        if(errorMessage == ""){
            this.saveSchedule()
        }
        else{
            console.log("Bad input")
            this.setState({ 
                errorInput: true,
                errorMsg: errorMessage,
                });

            setTimeout(() => {
                this.setState({ errorInput: false });
                }, 100);

        }
        
    }

    saveSchedule =()=>{
        console.log("saving")
        var mon = this.state.mon;
        var tue = this.state.tue;
        var wed = this.state.wed;
        var thu = this.state.thu;
        var fri = this.state.fri;
        var sat = this.state.sat;
        var sun = this.state.sun;

        var dateStart = this.state.dateStart;
        var dateEnd = this.state.dateEnd;
        var restWeek = this.state.restWeek;
        var workoutName = this.state.selctedWorkout
        var user = this.state.userId
        console.log("user: " + user)
        /*
        this.setState({ 
            mon: false,
            tue: false,
            wed: false,
            thu: false,
            fri: false,
            sat: false,
            sun: false,
            })*/

        const requestOptions={
            method: 'POST',
            headers: {'Content-Type' : 'application/json'},
            body: JSON.stringify({
                workoutName,
                mon,
                tue,
                wed,
                thu,
                fri,
                sat,
                sun,
                dateStart,
                dateEnd,
                restWeek,
                user,
            }),
        };

        fetch("/api/create-planned-workout", requestOptions)
        .then((response) => {
            if (!response.ok){
                console.log("Failed save planned workout!");
            }
            else{
                console.log("Success save planned workout!");
            }
        }).then(       
            this.setState({ 
                mon: false,
                tue: false,
                wed: false,
                thu: false,
                fri: false,
                sat: false,
                sun: false,
                selctedWorkout: "Success",
                })
        )
    }


    renderViewWorkouts(){
    return(
        <div className="wpmp-workout-selection-container">
        </div>
    );
    }

    handleReturn =(e)=>{
        e.preventDefault();
        window.location.reload();
    }

    renderViewPlanner(){
    return(
        <div className="wpmp-planner-container">
            <div className="wpmp-planner-workout-name">
                {this.state.selctedWorkout}
            </div>
            <form onSubmit={ this.handleAddCalendar }>
            <div className="wpmp-day-picker">
                <span><p>mon</p>
                <input className="wpmp-checkbox" type="checkbox" onChange={ (e)=>{ this.setState({mon: !this.state.mon})}}/>
                </span>
                <span><p>tue</p>
                <input className="wpmp-checkbox" type="checkbox" onChange={ (e)=>{ this.setState({tue: !this.state.tue})}}/>
                </span>
                <span><p>wed</p>
                <input className="wpmp-checkbox" type="checkbox" onChange={ (e)=>{ this.setState({wed: !this.state.wed})}}/>
                </span>
                <span><p>thu</p>
                <input className="wpmp-checkbox" type="checkbox" onChange={ (e)=>{ this.setState({thu: !this.state.thu})}}/>
                </span>
                <span><p>fri</p>
                <input className="wpmp-checkbox" type="checkbox" onChange={ (e)=>{ this.setState({fri: !this.state.fri})}}/>
                </span>
                <span><p>sat</p>
                <input className="wpmp-checkbox" type="checkbox" onChange={ (e)=>{ this.setState({sat: !this.state.sat})}}/>
                </span>
                <span><p>sun</p>
                <input className="wpmp-checkbox" type="checkbox" onChange={ (e)=>{ this.setState({sun: !this.state.sun})}}/>
                </span>
            </div>
            <div className="wpmp-date-picker">
                <input type="date" className="wpmp-date"  required onChange={ (e)=>{ this.setState({dateStart: e.target.value})}}/> 
                -
                <input type="date" className="wpmp-date" required onChange={ (e)=>{ this.setState({dateEnd: e.target.value})}}/>
            </div>
            <div className="wpmp-restweek-picker">
                Enter a rest week every X weeks(optional) 
            <input type="number" min="0" onChange={ (e)=>{ this.setState({restWeek: e.target.value})}}/>
            <button type="submit">
                Add to calendar
            </button>
            </div>
            </form>
            <button className="wpmp-planner-return-btn" onClick={ this.handleReturn }>
                return
            </button>
            <div className="wpmp-alert-container">
                <div className={`alert alert-success ${this.state.errorInput? 'wpmp-alert-shown' : 'wpmp-alert-hidden'}`}>
                    <Alert severity="error">{ this.state.errorMsg }</Alert>
                </div>
            </div>
            
        </div>
    );
    }

    renderViewSuccess(){
        return(
            <div className="wpmp-created-message-container">
            <div className="wpmp-created-message-icon">
            </div>
            <div className="wpmp-created-message">
              <h2>{this.state.selctedWorkout}</h2>
              <br/>
              <h3>Schedule Updated!</h3>
            </div>
            <button type="submit" className="wpmp-created-message-return-btn" onClick={ this.handleReturn }>
              Return
            </button>
        </div>
        );

    }



    renderPlannerManage(){
        if(this.state.selctedWorkout == "None" ){
            return(
                <div className="wpmp-container">
                
                    <div className="wpmp-section wpmp-box1">
                        <div className="wpmp-planner-title">
                            <p>Workout Planner</p>
                            {this.state.userInfo != ""?  <p className="wpmp-planner-userinfo">Planning for user {this.state.userInfo }</p>: ""}
                        </div>
                            { this.renderViewWorkouts() }
                    </div>
                    <div className="wpmp-section wpmp-box2">
                    {<CalendarPage user={this.state.userId}/>}
                    </div>
                </div>
                );
        }
        else if (this.state.selctedWorkout == "Success" ){
            return(
            <div className="wpmp-container">
                <div className="wpmp-section wpmp-box1">
                <div className="wpmp-planner-title">
                </div>
                    { this.renderViewSuccess() }
                </div>
                <div className="wpmp-section wpmp-box2">
                    {<CalendarPage user={this.state.userId}/>}
                </div>
            </div>
            );

        }
        else{
            return(
                <div className="wpmp-container">
                    <div className="wpmp-section wpmp-box1">
                    <div className="wpmp-planner-title">
                        <p>Workout Planner</p>
                        {this.state.userInfo != ""?  <p className="wpmp-planner-userinfo">Planning for user {this.state.userInfo }</p>:""}
                    </div>
                        { this.renderViewPlanner() }
                    </div>
                    <div className="wpmp-section wpmp-box2">
                        {<CalendarPage user={this.state.userId}/>}
                    </div>
                </div>
                );
        }

    }



//id scheduledDate user_id workout_id
  render() {
    return(this.renderPlannerManage());
  }
}
