import React, {Component, useEffect} from "react";
import { BrowserRouter as Router, Switch, Route, Link, Redirect} from "react-router-dom";



export default class DashboardPage extends Component{

    static defaultProps = {
    };

    constructor(props){
        super(props);

        this.state={
            sessionActive: false,
        };
    }

    DashboardPage(){
        return(
            <div className="db-container">
                <h1>Dashboard</h1>
            </div>
        );
    }
    


    render(){
        return(
             this.DashboardPage()
         );
    }

}
