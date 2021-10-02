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


export default class CalendarPage extends PureComponent {
  static defaultProps = {};

  constructor(props) {
    super(props);

    this.state = {
        editItem: false,
    };
  
  }

  handleRemoveCalendarItem = (e) =>{
      e.preventDefault();
      console.log(e.target.value);
      this.setState({editItem:true})
  }

  createCalendar=()=>{
       
    var monthLen = this.getDayInMonth();
    console.log("len: " + monthLen);


    fetch("/api/get-scheduled-workouts")
    .then((response) => {
        if (!response.ok){
            console.log("Failed get scheduled workouts!");
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
            var date = new Date();
            var fday = new Date(date.getFullYear(), date.getMonth(), 1);
            var first_day = fday.toString().slice(0,3)
            console.log(first_day)

            var dayDict = {
                "Mon": 0,
                "Tue": 1,
                "Wed": 3,
                "Thu": 4,
                "Fri": 5,
                "Sat": 6,
                "Sun": 7,
            }
            console.log("Dict!")
            console.log(dayDict[first_day])
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
                            //console.log("day: " + day_nr + " hit!" + " planned: " + day_scheduled)
                            //console.log(day_nr + " if")
                            
                            //day of month
                            var elemTextContainer = document.createElement('div');
                            elemTextContainer.className = "calendar-day-elemTextContainer";
                            elemTextContainer.id = workout_id;
                            elemTextContainer.value = workout_id;
                            
                            //add name of workout - todo
                            var elemText = document.createTextNode("M");
                            
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
                                console.log("breaking loop: " + data.length + " != " + j)
                                day_nr= day_nr-1;
                            }
                            
                        }
                        else{
                            //first workout on a scheduled day
                            //console.log("day: " + day_nr + " hit!" + " planned: " + day_scheduled)
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
                        }
                    }
                day_nr++;
                let targetNode = document.getElementsByClassName("calendar-container")[0].appendChild(elemContainer);
                }
            }
        });
  }

  getDayInMonth(){
    var date = new Date();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    var daysInMonth = new Date(year, month, 0).getDate();
    return daysInMonth;    
  }

  renderCalendar(){

    if(this.state.editItem == false){
      return(
          <>
            <div className="calendar-title">
                Scheduled Workouts
            </div>
            <div className="calendar-container">
                {this.createCalendar()}
            </div>
            <div className="calendar-nav">
                <button className="calendar-nav-prev-btn">
                    Prev
                </button>
                <div className="calendar-nav-month">
                    This Month
                </div>
                <button className="calendar-nav-next-btn">
                    Next
                </button>
            </div>
        </>
      );
    }
    else{
        return(
            <>
              <div className="calendar-edit-container">
                Edit
              </div>
          </>
        );
    }
  }

    render(){
        return(this.renderCalendar())
    }

}