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
        this.getFriendInfo();
    }

    
    componentDidUpdate(prevProps, prevState){
        if(prevProps.friend !== this.props.friend) {
            this.setState({friend: this.props.friend});
            this.getFriendInfo();
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
        fetch("/api/get-friend-info?user=" + this.props.friend)
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

    handleRemoveFriend=()=>{
        console.log("deleting: " + this.state.friend)
        fetch("/api/delete-friend?user=" + this.state.friend)
        .then((response) => {
            if (!response.ok){
                console.log("Failed denying pending request!");
            }
            return response.json()}
            ).then((data)=>{
                console.log("deleted");
                this.props.handleParentFriendDeleted();
            });
    }

   


    renderFriendFlow(){
        if(this.state.display == ""){
            return(
                <div className="sfp-container">
                      <div className="sfp-friend-info-box">
                        <div className="sfp-text-container">
                            <div className="sfp-text">
                                <lable>Name:   </lable>
                                <lable>Last Name: </lable>
                                <lable>Email:   </lable>
                            </div>
                            <div className="sfp-text2">
                                <lable> {this.state.friendFname} </lable>
                                <lable> {this.state.friendLname} </lable>
                                <lable> {this.state.friendEmail} </lable>
                            </div>
                        </div>
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
