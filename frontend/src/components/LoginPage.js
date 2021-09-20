import React, {Component, useEffect} from "react";
import { BrowserRouter as Router, Switch, Route, Link, Redirect} from "react-router-dom";



export default class LoginPage extends Component{

    static defaultProps = {
    };

    constructor(props){
        super(props);

        this.state={
            sessionActive: false,
        };
    }

    LoginPage(){
        return(
            <div className="db-container">
                <h1>Login</h1>
            </div>
        );
    }
    


    render(){
        return(
             this.LoginPage()
         );
    }

}
