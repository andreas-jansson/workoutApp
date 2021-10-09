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

    render(){
        return(
            <>SocialPendingRequests</>
         );
    }

}
