import React, {Component, useEffect} from "react";
import { BrowserRouter as Router, Switch, Route, Link, Redirect} from "react-router-dom";



export default class WorkoutManagePage extends Component{

    static defaultProps = {
    };

    constructor(props){
        super(props);

        this.state={
            sessionActive: false,
            mainSelector: 0, /* 0: default 1: add workout,2: manage workouts,3: standardworkouts.*/

        };

    

    }
  
    
    WorkoutManagePage() {
        return (
          /* main container*/
            <div className="wmp-containerr">
                <div className="wmp-container2">
                    <div className="wmp-workout">
                        <h1>workout</h1>
                    </div>
                    <div className="wmp-overview">
                        <h1>overview</h1>
                    </div>
                </div>
            </div>
        );    
    }    

  
   
 
   
    render() {
        return this.WorkoutManagePage();
    }

}
