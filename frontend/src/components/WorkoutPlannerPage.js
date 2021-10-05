import React, { Component, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";
import '../../static/css/workout-planner.css';
import WorkoutPlannerManagePage from "./WorkoutPlannerManagePage";


export default class WorkoutPlannerPage extends Component {
  static defaultProps = {};

  constructor(props) {
    super(props);

    this.state = {
      selectValue: 0,
      textValue: "",
      roleType:0,
    };
  }


  componentDidMount = () =>{
    this.sessionExist();
    this.handleGetUserSelect();
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
          //console.log("***")
          console.log(data.fname)
          this.setState({ 
              roleType: data.role_id,
          });
          if(data.role_id >2){
            this.handleGetUserSelect();

          }
          
      })
    }


    handleGetUserSelect=()=>{
      console.log("A")
      if(this.state.roleType > 2){
        console.log("B")
        fetch("/api/get-user")
        .then((response) => {
            if (!response.ok){
                console.log("Failed save exercise!");
            }
            else{
                console.log("Success save exercise!");
            }
            return response.json()
            })
            .then((data)=>{
    
                for(var i = 0; i < data.length; i++) {
                    console.log(data[i].fname)
                    const elemSelect = document.createElement('option');
                    elemSelect.text = data[i].id +". " +data[i].fname +" "+ data[i].lname;
                    //elemSelect.value = data[i].id +". " +data[i].fname +" "+ data[i].lname;
                    elemSelect.value = data[i].id;
                    let targetNode = document.getElementsByClassName("wpp-select-type")[0].appendChild(elemSelect);
    
                }
            })
        }
  
      }


  handleMainOption = (e) =>{
    if(e.target.value == "manage"){
      this.props.history.push('/workout-planner-manage', {userId: 0, textValue: ""}); 

    }
    else{
      this.props.history.push('/workout-planner-view', {userId: 0, textValue: ""}); 

    }
}

handleClientSelected = (e) =>{
  e.preventDefault();
  console.log("redirecting!");

  this.props.history.push('/workout-planner-manage', {userId: this.state.selectValue, textValue: this.state.textValue}); 

  //return(<Redirect to={{ pathname: '/workout-planner-manage', state: { userid: this.state.selectValue }}}/>)
  //<Redirect to={{ pathname: '/workout-planner-manage' }}/>


}


renderPlannerFlow(){
    if(this.state.roleType >2){
      return(
      <div className="wpmp-container">
          <div className="wpp-coach-selection-prompt">
            Select a client to proceed
            <select className="wpp-select-type" 
              defaultValue={this.state.selectValue} 
              onChange={(e)=>{ this.setState({ selectValue : e.target.value, textValue: e.target.options[e.target.selectedIndex].text })}}
            >
              {/* auto fills in clients for the coach in question*/}
            </select>    
            <button className="wpp-coach-continue-btn" onClick={this.handleClientSelected}> 
              Continue
            </button>            
          </div>
      </div>
      );
  }
  else{
    return(
      <div className="wpp-container">
        <button className="wpp-navigation nav-box1" value="manage" onClick={ this.handleMainOption }>
          Manage Schedule
          <div className="wpp-lineStyle" />
        </button>
        <button className="wpp-navigation nav-box2" value="view" onClick={ this.handleMainOption }>
          View Schedule
          <div className="wpp-lineStyle" />
        </button>
      </div>
    );
  }
}


//id scheduledDate user_id workout_id
  render() {
    return(this.renderPlannerFlow());
  }
}
