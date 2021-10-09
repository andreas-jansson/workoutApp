import React, {Component, useEffect} from "react";
import { BrowserRouter as Router, Switch, Route, Link, Redirect} from "react-router-dom";
import '../../static/css/social-my-friends.css';


    

export default class SocialMyFriends extends Component{

    static defaultProps = {
    };

    constructor(props){
        super(props);

        this.state={
            sessionActive: false,
            selectedFriend: 0,
        };
    }

    componentDidMount=()=>{
        this.getFriends();
    }

    getFriends=()=>{

        let targetNode = document.getElementsByClassName("awp-dynamic-exercise-added-container")[0];

        if(targetNode != null){
            targetNode.remove();
        }

        fetch("/api/get-friends")
        .then((response) => {
            if (!response.ok){
                console.log("Failed get exercise!");
            }
            return response.json()}
            ).then((data)=>{
                const elemContainer = document.createElement('div');
                elemContainer.className = "smf-dynamic-exercise-added-container";
                elemContainer.id = "smf-dynamic-exercise-added-container";

                // fname
                // lname
                // email
                // remove
                // view

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

                    var elemViewContainer = document.createElement('div');
                    elemViewContainer.className = "smf-dynamic-friend-open"
                    elemViewContainer.id = data[i].id;
                    elemViewContainer.innerHTML = "&#128064"
                    elemViewContainer.onclick = this.props.handleViewFriend

                    elemContainer.appendChild(elemItem);
                    elemItem.appendChild(elemTextContainer);
                    elemTextContainer.appendChild(elemTextFname);
                    elemTextContainer.appendChild(elemTextLname);
                    elemTextContainer.appendChild(elemTextEmail);
                    elemTextContainer.appendChild(elemViewContainer);


                    elemTextFname.appendChild(elemFname);
                    elemTextLname.appendChild(elemLname);
                    elemTextEmail.appendChild(elemEmail);

                }
                const workoutList = document.getElementsByClassName("smf-dynamic-workout-container")[0];
                let workoutExerciseList = document.getElementsByClassName("smf-friend-list-container")[0].appendChild(elemContainer);
            });
    }



    handleRemoveFriend=(e)=>{
        e.preventDefault();
        console.log("todo: remove friend: " + e.target.id)
        //call view to delete friend entry

    }

    renderMyFriends(){
        return(
            <div className="smf-container">
                   <div className="smf-friend-list-container">

                    </div>
            </div>
        );
    }

    render(){
        return(
            this.renderMyFriends()
         );
    }

}
