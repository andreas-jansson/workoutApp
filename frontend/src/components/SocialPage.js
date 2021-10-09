import React, {Component, useEffect} from "react";
import { BrowserRouter as Router, Switch, Route, Link, Redirect} from "react-router-dom";
import '../../static/css/social.css';
import SocialFindFriendsPage from "./SocialFindFriendsPage";
import SocialMyFriends from "./SocialMyFriends";
import SocialPendingRequests from "./SocialPendingRequests";



export default class SocialPage extends Component{

    static defaultProps = {
    };

    constructor(props){
        super(props);

        this.state={
            sessionActive: false,
            selectedPage: "my_friends"
        };
    }

    renderSocialFlow(){
        //<SocialFindFriendsPage/>
        //<SocialMyFriends/>
        //<SocialPendingRequests/>

        var myDict = { 
            "default": <div></div>,
            "find_friends": <SocialFindFriendsPage/>,
            "my_friends": <SocialMyFriends/>,
            "pending_requests": <SocialPendingRequests/>,
        };

        return(
            <div className="social-container">
                <div className="social-section1">
                    <div className="social-section1-btn-container">
                        <button className="social-btn social-btn-nav" onClick={()=>{this.setState({selectedPage: "my_friends"})}}>
                            Friends
                        </button>
                        <button className="social-btn social-btn-nav" onClick={()=>{this.setState({selectedPage: "find_friends"})}}>
                            Find Friends
                        </button>
                        <button className="social-btn social-btn-nav" onClick={()=>{this.setState({selectedPage: "pending_requests"})}}>
                            Pending Requests
                        </button>
                    </div>
                    <div className="social-section1-content">
                         {myDict[this.state.selectedPage]}
                     </div>
                </div>
                <div className="social-section2">
                    Workouts / Calendar will be shown here
                    
                </div>
            </div>
        );

    }

    render(){
        return(
             this.renderSocialFlow()
         );
    }

}