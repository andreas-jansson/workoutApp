import React, {Component, useEffect} from "react";
import { BrowserRouter as Router, Switch, Route, Link, Redirect} from "react-router-dom";
import WorkoutAddPage from "./WorkoutAddPage";
import '../../static/css/workout.css';


export default class WorkoutPage extends Component{

    static defaultProps = {
    };

    constructor(props){
        super(props);

        this.state={
            sessionActive: false,
            mainSelector: 0, /* 0: default 1: add workout,2: manage workouts,3: standardworkouts.*/

        };

        this.handleSubmit1 = this.handleSubmit1.bind(this);
        this.handleSubmit2 = this.handleSubmit2.bind(this);
        this.handleSubmit3 = this.handleSubmit3.bind(this);
        this.WorkoutLanding = this.WorkoutLanding.bind(this);
        this.WorkoutManage = this.WorkoutManage.bind(this);
        this.WorkoutStandard = this.WorkoutStandard.bind(this);
        this.WorkoutRender = this.WorkoutRender.bind(this);

    }
    /* handles the 3 main buttons and sets the state variable */
    handleSubmit1 = () =>{
        this.setState({
            mainSelector: 1,
        });
        console.log("1");
        this.props.history.push("/workout-add");
    }

    handleSubmit2(){
        this.setState({
            mainSelector: 2,
        });
    }

    handleSubmit3(){
        this.setState({
            mainSelector: 3,
        });
    }

    /* Depending on state variable, renders different functions*/
    WorkoutRender(){

        console.log("Value: " + this.state.mainSelector.toString());

        if(this.state.mainSelector == 0){
            return(this.WorkoutLanding());
        }
        else if(this.state.mainSelector == 1){
            <Redirect push to="/workout-add" />
            return(<WorkoutAddPage/>);
        }
        else if(this.state.mainSelector == 2){
            return(this.WorkoutManage());
        }
        else if(this.state.mainSelector == 3){
            return(this.WorkoutStandard());
        }
        else{
            return(<p>Shit Borked</p>)
        }
    }

  
    /* starting page of workouts*/
    WorkoutLanding(){
        return(
            <div className="wp-container">
                <div className="wp-section wp-box1">
                    <form onSubmit={ this.handleSubmit1 }>
                        <button type="submit" className="wp-btn">
                            ADD WORKOUT +
                        </button>
                    </form>
                    <div className="wp-lineStyle" />
                </div>
                <div className="wp-section wp-box1">
                    <form onSubmit={ this.handleSubmit2 }>
                        <button type="submit" className="wp-btn">
                            MANAGE WORKOUTS +
                        </button>
                    </form>
                    <div className="wp-lineStyle" />
                </div>
                <div className="wp-section wp-box1">
                    <form onSubmit={ this.handleSubmit3 }>
                        <button type="submit" className="wp-btn">
                            STANDARD WORKOUTS +
                        </button>
                    </form>
                    <div className="wp-lineStyle" />
                </div>
            </div>
        );
        
    }


    WorkoutManage(){
        return(
            <p>Manage</p>
        );
    
    }

    WorkoutStandard(){

        return(
            <p>Standard</p>
        );
    
    }
    render(){
        return(
             this.WorkoutLanding()
         );
    }

}
