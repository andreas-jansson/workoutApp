import React, {Component, component} from "react";
import { BrowserRouter as Router, Switch, Route, Link, Redirect} from "react-router-dom";



export default class StartPage extends Component{

    static defaultProps = {
    };

    constructor(props){
        super(props);

    }

    StartPage(){
        return(
        <h1>Start Page</h1>
        );
    }


    render(){
        return(

        <Router>
        <Switch>
            <Route exact path='/'>
                { this.StartPage()}
            </Route>
        </Switch>
        </Router>
         );
    }

}
