import React, {Component, useEffect} from "react";
import { BrowserRouter as Router, Switch, Route, Link, Redirect} from "react-router-dom";
import '../../static/css/social-friend.css';
import CalendarFriendPage from "./CalendarFriendPage";
import SocialFriendWorkout from "./SocialFriendWorkout";

    

export default class SocialFriendPage extends Component{

    static defaultProps = {
    };

    constructor(props){
        super(props);

        this.state={
            sessionActive: false,
            friend:this.props.friend,
            display:"",
            friendFname:"",
            friendLname:"",
            friendEmail:"",

        };
        this.handleUpdateParent = this.handleUpdateParent.bind(this);
    }

    componentDidMount=()=>{
       // this.getFriendInfo();
    }

    componentDidUpdate(prevProps){
        //this.getFriendInfo();
        if(prevProps.friend !== this.props.friend) {
            this.setState({friend: this.props.friend});
          }
    }

    handleUpdateParent=()=>{
        console.log("handleUpdateParent")
        this.setState({
            display:"",
        })
    }

    handleViewCalendar=()=>{
        this.setState({display: "calendar"});
    }

    handleViewWorkouts=()=>{
        this.setState({display: "workouts"});
    }

    getFriendInfo =()=>{
        fetch("/api/get-friend-info?user=" + this.state.friend)
        .then((response) => {
            if (!response.ok){
                console.log("Failed get exercise!");
            }
            return response.json()}
            ).then((data)=>{
                this.setState({
                    friendFname: data.fname,
                    friendLname: data.lname,
                    friendEmail: data.email,
            });

        });
    }

   


    renderFriendFlow(){
        if(this.state.display == ""){
            return(
                <div className="sfp-container">
                      <div className="sfp-friend-info-box">
                          {this.getFriendInfo()}
                        friend: {this.state.friend}
                        <lable>Name: {this.state.friendFname}</lable>
                        <lable>Last Name: {this.state.friendLname}</lable>
                        <lable>Email: {this.state.friendEmail}</lable>
                         <button className="sfp-btn-remove" onClick={this.handleRemoveFriend}>
                            Remove Friend
                        </button>

                      </div>
                      <div className="sfp-option-box">
                        <button className="sfp-btn-calendar" onClick={this.handleViewCalendar}>
                            View Calendar
                        </button>
                        <button className="sfp-btn-workouts" onClick={this.handleViewWorkouts}>
                            View Workouts
                        </button>
                      </div>
    
    
                </div>
            );
        }
        else if(this.state.display == "calendar"){
            return(
                <CalendarFriendPage user={this.state.friend} handleUpdateParent={this.handleUpdateParent.bind(this)}/>

            );
        }
        else if(this.state.display == "workouts"){
            return(
                <SocialFriendWorkout friend={this.state.friend} handleUpdateParent={this.handleUpdateParent.bind(this)}/>
            );
        }

    }

    render(){
        return(
            this.renderFriendFlow()
         );
    }

}
