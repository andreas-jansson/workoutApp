import React, {Component, useEffect} from "react";
import { BrowserRouter as Router, Switch, Route, Link, Redirect} from "react-router-dom";
import '../../static/css/social-pending-requests.css';


    

export default class SocialPendingRequests extends Component{

    static defaultProps = {
    };

    constructor(props){
        super(props);

        this.state={
            sessionActive: false,
        };
    }

    componentDidMount=()=>{
        this.getPendingFriends();
    }

    handleAcceptFriend=(e)=>{
        e.preventDefault();
        this.acceptPendingRequest(e.target.id);

    }

    handleDenyFriend=(e)=>{
        e.preventDefault();
        this.denyPendingRequest(e.target.id);

    }

    acceptPendingRequest=(user)=>{

        fetch("/api/accept-pending-friend?user=" + user)
        .then((response) => {
            if (!response.ok){
                console.log("Failed get exercise!");
            }
            return response.json()}
            ).then((data)=>{
                console.log("accepted");
                this.getPendingFriends();
            });
    }

    denyPendingRequest=(user)=>{

        fetch("/api/deny-pending-friend?user=" + user)
        .then((response) => {
            if (!response.ok){
                console.log("Failed denying pending request!");
            }
            return response.json()}
            ).then((data)=>{
                console.log("deleted");
                this.getPendingFriends();
            });
    }




    getPendingFriends=()=>{

        let targetNode = document.getElementsByClassName("smf-dynamic-exercise-added-container")[0];

        if(targetNode != null){
            targetNode.remove();
        }

        fetch("/api/get-pending-friends")
        .then((response) => {
            if (!response.ok){
                console.log("Failed get exercise!");
            }
            return response.json()}
            ).then((data)=>{
                const elemContainer = document.createElement('div');
                elemContainer.className = "smf-dynamic-exercise-added-container";
                elemContainer.id = "smf-dynamic-exercise-added-container";

                for(var i = 0; i < data.length; i++) {
                    console.log(data[i].fname);
                    
                    var elemItem = document.createElement('div');
                    elemItem.className = "smf-exercise-added-item";
                    elemItem.id = data[i].id;
                    elemItem.value = data[i].id;

                    var elemTextContainer = document.createElement('div');
                    elemTextContainer.className = "smf-exercise-added-elemTextContainer"
                    elemTextContainer.id = data[i].id;

                    var elemTextFname = document.createElement('div');
                    elemTextFname.className = "smf-exercise-added-elemTextFname"
                    var elemTextLname = document.createElement('div');
                    elemTextLname.className = "smf-exercise-added-elemTextLname"
                    var elemTextEmail = document.createElement('div');
                    elemTextEmail.className = "smf-exercise-added-elemTextEmail"

                    var elemFname = document.createTextNode(data[i].fname);
                    var elemLname = document.createTextNode(data[i].lname);
                    var elemEmail = document.createTextNode(data[i].email);

                    var elemAcceptContainer = document.createElement('div');
                    elemAcceptContainer.className = "smf-dynamic-friend-open"
                    elemAcceptContainer.id = data[i].id;
                    elemAcceptContainer.innerHTML = "&#9989";
                    elemAcceptContainer.onclick = this.handleAcceptFriend;

                    var elemDenyContainer = document.createElement('div');
                    elemDenyContainer.className = "smf-dynamic-friend-open"
                    elemDenyContainer.id = data[i].id;
                    elemDenyContainer.innerHTML = "&#10060";
                    elemDenyContainer.onclick = this.handleDenyFriend;

                    elemContainer.appendChild(elemItem);
                    elemItem.appendChild(elemTextContainer);
                    elemTextContainer.appendChild(elemTextFname);
                    elemTextContainer.appendChild(elemTextLname);
                    elemTextContainer.appendChild(elemTextEmail);
                    elemTextContainer.appendChild(elemAcceptContainer);
                    elemTextContainer.appendChild(elemDenyContainer);



                    elemTextFname.appendChild(elemFname);
                    elemTextLname.appendChild(elemLname);
                    elemTextEmail.appendChild(elemEmail);

                }
                const workoutList = document.getElementsByClassName("smf-dynamic-workout-container")[0];
                let workoutExerciseList = document.getElementsByClassName("spr-pending-box")[0].appendChild(elemContainer);
            });
    }


    renderPendingFlow(){
        return(
        <div className="spr-container">
             <div className="spr-pending-box">
            
            </div>

        </div>
        );

    }

    render(){
        return(
            this.renderPendingFlow()
         );
    }

}
