import React, {Component, useEffect} from "react";
import { BrowserRouter as Router, Switch, Route, Link, Redirect} from "react-router-dom";
import '../../static/css/social.css';
import SocialFindFriendsPage from "./SocialFindFriendsPage";
import SocialMyFriends from "./SocialMyFriends";
import SocialPendingRequests from "./SocialPendingRequests";
import SocialFriendPage from "./SocialFriendPage";



export default class SocialPage extends Component{

    static defaultProps = {
    };

    constructor(props){
        super(props);

        this.state={
            sessionActive: false,
            selectedPage: "my_friends",
            selectedFriend: 0,
            friendView: "off",
        };

        this.handleViewFriend = this.handleViewFriend.bind(this);
    }

    handleViewFriend=(e)=>{
        e.preventDefault();
        console.log("todo: view friend: " + e.target.id)
        this.setState({
            selectedFriend: e.target.id, 
            friendView: "on",
        })

    }

    handleParentFriendDeleted=()=>{
        this.setState({friendView: "off"})
    }

    renderSocialFlow(){
        //<SocialFindFriendsPage/>
        //<SocialMyFriends/>
        //<SocialPendingRequests/>

        var renderViewsLeft = { 
            "default": <div></div>,
            "find_friends": <SocialFindFriendsPage/>,
            "my_friends": <SocialMyFriends handleViewFriend={ this.handleViewFriend.bind(this)}/>,
            "pending_requests": <SocialPendingRequests/>,
        };

        var renderViewsRight = { 
            "off": <div>Select a friend to view their info</div>,
            "on": <SocialFriendPage friend={this.state.selectedFriend} handleParentFriendDeleted={ this.handleParentFriendDeleted.bind(this)} />,
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
                         {renderViewsLeft[this.state.selectedPage]}
                     </div>
                </div>
                <div className="social-section2">
                    {renderViewsRight[this.state.friendView]}
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
