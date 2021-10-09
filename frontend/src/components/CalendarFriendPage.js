import React, { PureComponent, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";
import '../../static/css/calendar.css';
import Alert from "@material-ui/lab/Alert";


export default class CalendarFriendPage extends PureComponent {
  static defaultProps = {};

  constructor(props) {
    super(props);

    this.state = {
        editItem: false,
        date: new Date().toLocaleDateString(), 
        month: "",
        month2: new Date().getMonth(),
        monthOffset: 0,
        editDate: "",
        user: this.props.friend,
    };
    console.log("xxxxx")
    console.log(this.props.user)
  
  }

  componentDidUpdate(prevProps){

    if(prevProps.friend !== this.props.friend) {
        this.setState({user: this.props.friend});
      }
}


  handleRemoveCalendarItem = (e) =>{
    e.preventDefault();
    this.setState({editItem:true, editDate: e.target.value})
    console.log(e.target.value);

  }

 

  DeleteWorkout=(workoutName)=>{

    var date = this.state.editDate;
    var user = this.props.user
    const requestOptions={
        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify({
            workoutName,
            date,
            user,
        }),
    };

    fetch("/api/delete-scheduled-workout", requestOptions)
    .then((response) => {
        if (!response.ok){
            console.log("Failed to delete workout!");
        }
        else{
            console.log("Success deleteing workout!");
            window.location.reload();
        }
    })
}

  createCalendar=(e)=>{
    e.preventDefault();

    var change_value = parseInt(e.target.value, 10);

    if(change_value == 1 || change_value == -1){
        var valueOffset = this.state.monthOffset + change_value;
        this.setState({monthOffset: this.state.monthOffset + change_value})
        //this.setState({monthOffset: value})
        console.log(valueOffset)
    }
    else{
        var valueOffset = this.state.monthOffset;
    }
 

    let targetNode = document.querySelector(".calendar-dynamic-container")
    if(targetNode != null){
        //console.log("Deleting")
        targetNode.remove();
    }

    var date = this.getMonth(valueOffset);
    console.log("month: " + date);
    var monthLen = this.getDayInMonth(date);
    console.log("len: " + monthLen);


    fetch("/api/get-scheduled-workouts?date=" + date.toLocaleDateString()+"&user="+ this.props.user)
    .then((response) => {
        if (!response.ok){
            console.log("Failed get scheduled workouts!");
              //Create main container and headers
              const elemContainer = document.createElement('div');
              elemContainer.className = "calendar-dynamic-container";
              const elemDayHeader = document.createElement('div');
              elemDayHeader.className = "calendar-dynamic-day-header";
  
              const elemDayMonday = document.createElement('div');
              elemDayMonday.innerHTML= "Monday";
              const elemDayTuesday = document.createElement('div');
              elemDayTuesday.innerHTML= "Tuesday";
              const elemDayWednesday = document.createElement('div');
              elemDayWednesday.innerHTML= "Wednesday";
              const elemDayThursday = document.createElement('div');
              elemDayThursday.innerHTML= "Thursday";
              const elemDayFriday = document.createElement('div');
              elemDayFriday.innerHTML= "Friday";
              const elemDaySaturday = document.createElement('div');
              elemDaySaturday.innerHTML= "Saturday";
              const elemDaySunday = document.createElement('div');
              elemDaySunday.innerHTML= "Sunday";
  
  
              elemDayHeader.className = "calendar-dynamic-day-header";
  
              elemContainer.appendChild(elemDayHeader);
              elemDayHeader.appendChild(elemDayMonday);
              elemDayHeader.appendChild(elemDayTuesday);
              elemDayHeader.appendChild(elemDayWednesday);
              elemDayHeader.appendChild(elemDayThursday);
              elemDayHeader.appendChild(elemDayFriday);
              elemDayHeader.appendChild(elemDaySaturday);
              elemDayHeader.appendChild(elemDaySunday);
  
  
              // find which day first day of current month is
              // if monday: insert 0 dead items, if tuesday: insert 1 etc
              //var date = new Date();
              var fday = new Date(date.getFullYear(), date.getMonth(), 1);
              var first_day = fday.toString().slice(0,3)
              console.log("first day: " + first_day)
  
              var dayDict = {
                  "Mon": 0,
                  "Tue": 2,
                  "Wed": 3,
                  "Thu": 4,
                  "Fri": 5,
                  "Sat": 6,
                  "Sun": 7,
              }
              //console.log("Dict!")
              console.log("dict first day: " + dayDict[first_day])
              for(var i=0;i<dayDict[first_day]-1;i++){
                  console.log("creating padding blocks")
                  var elemPadding = document.createElement('div');
                  elemPadding.className = "calendar-padding-item";
                  elemPadding.id = 0;
                  elemContainer.appendChild(elemPadding);
              }
  
              //itterate through the data and create items
              var saved_i = 0;
              var day_nr = 1;
              console.log("len: " + monthLen);
                for(var i = saved_i; i < monthLen; i++) {
                    //if day of month is scheduled
                    //console.log("day: " + day_nr + " no hit" + " planned: " + day_scheduled)
                    var empty = "empty"
                    var elemItem = document.createElement('div');
                    elemItem.className = "calendar-day-item";
                    elemItem.id = day_nr;
                    elemItem.value = empty;

                    var elemTextContainer = document.createElement('div');
                    elemTextContainer.className = "calendar-day-elemTextContainer"

                    var elemTextNumber = document.createTextNode(day_nr);

                    elemContainer.appendChild(elemItem);
                    elemItem.appendChild(elemTextContainer)
                    elemTextContainer.appendChild(elemTextNumber)
                    day_nr++;

                }
                let targetNode = document.getElementsByClassName("calendar-container")[0].appendChild(elemContainer);
                }
        return response.json()}
        ).then((data)=>{

            //Create main container and headers
            const elemContainer = document.createElement('div');
            elemContainer.className = "calendar-dynamic-container";
            const elemDayHeader = document.createElement('div');
            elemDayHeader.className = "calendar-dynamic-day-header";

            const elemDayMonday = document.createElement('div');
            elemDayMonday.innerHTML= "Monday";
            const elemDayTuesday = document.createElement('div');
            elemDayTuesday.innerHTML= "Tuesday";
            const elemDayWednesday = document.createElement('div');
            elemDayWednesday.innerHTML= "Wednesday";
            const elemDayThursday = document.createElement('div');
            elemDayThursday.innerHTML= "Thursday";
            const elemDayFriday = document.createElement('div');
            elemDayFriday.innerHTML= "Friday";
            const elemDaySaturday = document.createElement('div');
            elemDaySaturday.innerHTML= "Saturday";
            const elemDaySunday = document.createElement('div');
            elemDaySunday.innerHTML= "Sunday";


            elemDayHeader.className = "calendar-dynamic-day-header";

            elemContainer.appendChild(elemDayHeader);
            elemDayHeader.appendChild(elemDayMonday);
            elemDayHeader.appendChild(elemDayTuesday);
            elemDayHeader.appendChild(elemDayWednesday);
            elemDayHeader.appendChild(elemDayThursday);
            elemDayHeader.appendChild(elemDayFriday);
            elemDayHeader.appendChild(elemDaySaturday);
            elemDayHeader.appendChild(elemDaySunday);


            // find which day first day of current month is
            // if monday: insert 0 dead items, if tuesday: insert 1 etc
            //var date = new Date();
            var fday = new Date(date.getFullYear(), date.getMonth(), 1);
            var first_day = fday.toString().slice(0,3)
            console.log("first day: " + first_day)

            var dayDict = {
                "Mon": 0,
                "Tue": 2,
                "Wed": 3,
                "Thu": 4,
                "Fri": 5,
                "Sat": 6,
                "Sun": 7,
            }
            //console.log("Dict!")
            console.log("dict first day: " + dayDict[first_day])
            for(var i=0;i<dayDict[first_day]-1;i++){
                //console.log("creating padding blocks")
                var elemPadding = document.createElement('div');
                elemPadding.className = "calendar-padding-item";
                elemPadding.id = 0;
                elemContainer.appendChild(elemPadding);
            }

            //itterate through the data and create items
            var saved_i = 0;
            var day_nr = 1;
            var schedule_exist = [];

            for(var j = 0; j < data.length; j++) {
                var date_raw = data[j].scheduledDate.toString();
                var workout_id = data[j].workout;
                var whole_date = date_raw.slice(0, 10)

                var day_scheduled = new Date(date_raw).toISOString().slice(8, 10)

                for(var i = saved_i; i < monthLen; i++) {
                    //if day of month is scheduled
                    if(day_scheduled == day_nr){
                        //if day of month have an existing schedule
                        if(schedule_exist.includes(day_nr)==true){
                            console.log("day: " + day_nr + " hit!" + " planned: " + day_scheduled)
                            //console.log(day_nr + " if")
                            
                            //day of month
                            var elemTextContainer = document.createElement('div');
                            elemTextContainer.className = "calendar-day-elemTextContainer";
                            elemTextContainer.id = day_nr;
                            elemTextContainer.value = workout_id;
                            
                            //add name of workout - todo
                            var elemText = document.createTextNode("*");
                            
                            elemTextContainer.appendChild(elemText)

                            let targetNode = document.getElementById(day_nr).appendChild(elemTextContainer);

                            saved_i = i;
                            schedule_exist.push(day_nr);
                            if(data.length-1 != j ){
                                //console.log("breaking loop: " + data.length + " != " + j)
                                i = monthLen;
                            }

                            // 5 datum, 4. om j inte är 4 så skippa. Annars minska day_nr med 1  
                            if((data.length-1) != j){
                                //console.log("breaking loop: " + data.length + " != " + j)
                                day_nr= day_nr-1;
                            }
                            
                        }
                        else{
                            //first workout on a scheduled day
                            console.log("day: " + day_nr + " hit!" + " planned: " + day_scheduled)
                            //console.log(day_nr + " if")

                            //create calendar item
                            var elemItem = document.createElement('div');
                            elemItem.className = "calendar-day-item";
                            elemItem.id = day_nr;
                            elemItem.value = workout_id;

                            //day of month
                            var elemTextContainer = document.createElement('div');
                            elemTextContainer.className = "calendar-day-elemTextContainer";
                            elemTextContainer.id = day_nr;
                            elemTextContainer.value = workout_id;
                            
                            //add workout name - todo
                            var elemText = document.createTextNode(day_nr);
                            
                            //edit scheduled workouts
                            const elemMinus = document.createElement('Button');
                            elemMinus.className = "calendar-remove-schduled-workout-btn";
                            elemMinus.value = whole_date;
                            elemMinus.onclick = this.handleRemoveCalendarItem;
                    
                            elemContainer.appendChild(elemItem);
                            elemItem.appendChild(elemTextContainer)
                            elemItem.appendChild(elemMinus)
                            elemTextContainer.appendChild(elemText);

                            saved_i = i;
                            schedule_exist.push(day_nr)

                            if(data.length-1 != j ){
                                //console.log("breaking loop: " + data.length + " != " + j)
                                i = monthLen;
                            }

                            if((data.length-1) != j){
                                day_nr--;
                            }
                         
                        }
                    }
                    else{
                        if(schedule_exist.includes(day_nr)==true){
                      
                        }
                        else{

                        console.log("day: " + day_nr + " no hit" + " planned: " + day_scheduled)
                        var empty = "empty"
                        var elemItem = document.createElement('div');
                        elemItem.className = "calendar-day-item";
                        elemItem.id = day_nr;
                        elemItem.value = empty;
        
                        var elemTextContainer = document.createElement('div');
                        elemTextContainer.className = "calendar-day-elemTextContainer"
                        
                        var elemTextNumber = document.createTextNode(day_nr);

                        elemContainer.appendChild(elemItem);
                        elemItem.appendChild(elemTextContainer)
                        elemTextContainer.appendChild(elemTextNumber)
                        }
                    }
                day_nr++;
                let targetNode = document.getElementsByClassName("calendar-container")[0].appendChild(elemContainer);
                }
            }
        });
  }

  getDayInMonth(date){
    //var date = new Date();
    //var month = date.getMonth() + 1;
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    var daysInMonth = new Date(year, month, 0).getDate();
    return daysInMonth;    
  }

  getMonth=(valueOffset)=>{
    var current = new Date();
    var date = new Date(current.getFullYear(), current.getMonth()+ valueOffset, 1);
    var month = date.toString().slice(4,7)
    var year = date.toString().slice(11,15)
    console.log("///////")
    console.log("month(get):" + month)

    var monthDict = {
        "Jan": "January",
        "Feb": "Februari",
        "Mar": "March",
        "Apr": "April",
        "May": "May",
        "Jun": "June",
        "Jul": "July",
        "Aug": "August",
        "Sep": "September",
        "Oct": "October",
        "Nov": "November",
        "Dec": "December",
    }
    
    var monthDict2 = {
        "Jan": 1,
        "Feb": 2,
        "Mar": 3,
        "Apr": 4,
        "May": 5,
        "Jun": 6,
        "Jul": 7,
        "Aug": 8,
        "Sep": 9,
        "Oct": 10,
        "Nov": 11,
        "Dec": 12,
    }


    this.setState({
        month: monthDict[month],
        month2: monthDict2[month],
        year: year,
        date: date.toLocaleDateString(),
    })
  
    return date;    

  }

  handleViewWorkoutLogs=(e)=>{
      e.preventDefault();
      this.loadPreviousLogs(e.target.id);

    
  }

  loadPreviousLogs=(workoutName)=>{
    console.log("Loading previous logs!")

    let targetNode = document.getElementsByClassName("awp-dynamic-previous-log-container")[0];

    if(targetNode != null){
        targetNode.remove();
    }
    console.log("after if")

    var date = this.state.editDate;
    const requestOptions={
        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify({
            workoutName,
            date,
        }),
    };

    fetch("/api/load-specific-log", requestOptions)
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
                elemItem.onclick = this.handleSelectedExercise;

                var elemTextNameContainer = document.createElement('div');
                elemTextNameContainer.className = "awp-previous-log-elemTextNameContainer"

                var elemTextSetContainer = document.createElement('div');
                elemTextSetContainer.className = "awp-previous-log-elemTextSetContainer"

                var elemTextRepContainer = document.createElement('div');
                elemTextRepContainer.className = "awp-previous-log-elemTextRepContainer"

                var elemTextWeightContainer = document.createElement('div');
                elemTextWeightContainer.className = "awp-previous-log-elemTextWeightContainer"

                var elemTextTimeContainer = document.createElement('div');
                elemTextTimeContainer.className = "awp-previous-log-elemTextTimeContainer"

                var elemName = document.createTextNode(data[i].name);
                var elemSet = document.createTextNode("set: " +data[i].sets);
                var elemReps = document.createTextNode("reps: " +data[i].reps);
                var elemWeight = document.createTextNode("weight: " +data[i].weight);
                var elemTime = document.createTextNode("time: " +data[i].time);

                elemContainer.appendChild(elemItem);
                elemItem.appendChild(elemTextNameContainer);
                elemItem.appendChild(elemTextSetContainer);
                elemItem.appendChild(elemTextRepContainer);
                elemItem.appendChild(elemTextWeightContainer);
                elemItem.appendChild(elemTextTimeContainer);

                elemTextNameContainer.appendChild(elemName);
                elemTextSetContainer.appendChild(elemSet);
                elemTextRepContainer.appendChild(elemReps);
                elemTextWeightContainer.appendChild(elemWeight);
                elemTextTimeContainer.appendChild(elemTime);


            }
            console.log("done")
            //this.setState({currentSet: currentSet})
            const workoutList = document.getElementsByClassName("calendar-view-workout-container")[0];
            let workoutExerciseList = document.getElementsByClassName("calendar-view-workout-container")[0].appendChild(elemContainer);
        });

}

  LoadDailyWorkouts = () =>{
    //console.log("edit date: " + this.state.editDate)

    fetch("/api/get-workouts-daily?date=" + this.state.editDate +"&user="+ this.props.user)
    .then((response) => {
        if (!response.ok){
            //console.log("Failed get workouts!");
        }
        return response.json()}
        ).then((data)=>{
            const elemContainer = document.createElement('div');
            elemContainer.className = "calendar-dynamic-workout-container"

    
            for(var i = 0; i < data.length; i++) {
                //unique_id = this.state.exerciseId;
                //console.log(data[i].name);
                var exerciseName = data[i].name.toString();
                
                var elemItem = document.createElement('div');
                elemItem.className = "calendar-workout-item";
                elemItem.id = i+1000;
                elemItem.value = exerciseName;
                //elemItem.onclick = this.handleSelectWorkout;

                var elemTextContainer = document.createElement('div');
                elemTextContainer.className = "calendar-workout-elemTextContainer-btn"
                elemTextContainer.value = exerciseName;

                var elemText = document.createTextNode(exerciseName);
                //elemText.value = exerciseName



                var elemEye = document.createElement('Button');
                elemEye.className = "calendar-view-workout-btn";
                elemEye.innerHTML = "&#128064";
                elemEye.value = exerciseName;
                elemEye.type = "submit";
                elemEye.id = exerciseName;
                elemEye.onclick = this.handleViewWorkoutLogs;


                elemContainer.appendChild(elemItem);
                elemItem.appendChild(elemTextContainer);
                elemItem.appendChild(elemEye);
                elemTextContainer.appendChild(elemText);

            }
            //console.log(elemContainer)

            let targetNode = document.getElementsByClassName("calendar-edit-workout-container")[0].appendChild(elemContainer);

        });
}

  renderEditCalendar=()=>{

      return(
        <div className="calendar-edit-container">
            <p>These are the scheduled workouts for {this.state.editDate}</p>
            <div className="calendar-edit-workout-container">
                { this.LoadDailyWorkouts()}
            </div>
            <div className="calendar-view-workout-container">
                
            </div>
            <button className="calendar-edit-return-btn" onClick={ ()=>{this.setState({editItem: false})}}>Return</button>
        </div>
      );
  }

  handleCallParent=()=>{
      this.props.handleUpdateParent();

  }

  renderCalendar=()=>{

    if(this.state.editItem == false){
      return(
          <>
            <div className="calendar-title">
                Scheduled Workouts
                <br/>
                { this.state.month } { this.state.year }
            </div>
            <div className="calendar-container">

            </div>
            <div className="calendar-nav">
                <button className="calendar-nav-prev-btn" value="-1" onClick={ this.createCalendar }>
                    Prev
                </button>
                <button className="calendar-nav-next-btn" onClick={ this.createCalendar }>
                    Refresh
                </button>
                <button className="calendar-nav-next-btn" onClick={ this.handleCallParent }>
                    Return
                </button>
                <button className="calendar-nav-next-btn" value="1" onClick={ this.createCalendar }>
                    Next
                </button>
            </div>
        </>
      );
    }
    else{
        return(
             this.renderEditCalendar() 
        );  
    }
  }

    render(){

        return(this.renderCalendar())
    }

}