import React, {Component, useEffect} from "react";
import { BrowserRouter as Router, Switch, Route, Link, Redirect} from "react-router-dom";



export default class RegisterPage extends Component{

    static defaultProps = {
    };

    constructor(props){
        super(props);

        this.state={
            sessionActive: false,
        };
    }

    RegisterPage(){
        return(
            <div className="db-container">
                <h1>Register</h1>
            </div>
        );
    }
    


    render(){
        return(
             this.RegisterPage()
         );
    }

}
