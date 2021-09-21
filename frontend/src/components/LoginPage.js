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
                <label>
                    AWOOOOOOOOOO
                </label>
                <Link to="/signup">
                        <div className="header-btn-btn3">
                            No accout? Click here!
                        </div>
                    </Link>
            </div>
        );
    }
    


    render(){
        return(
             this.LoginPage()
         );
    }

}
