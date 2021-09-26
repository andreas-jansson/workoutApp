import React, {Component, useEffect} from "react";
import { BrowserRouter as Router, Switch, Route, Link, Redirect} from "react-router-dom";
import '../../static/css/startpage.css';
    

export default class StartPage extends Component{

    static defaultProps = {
    };

    constructor(props){
        super(props);

        this.state={
            sessionActive: false,
        };
    }

    renderHeader(){
        return(
            <div className="header-container">
                <div className="header-btn-container">
                    <Link to="/login">
                        <div  className="header-btn-btn1">
                            Pricing
                        </div>
                    </Link>
                    <Link to="/login">
                        <div className="header-btn-btn2">
                            About
                        </div>
                    </Link>
                    <Link to="/login">
                        <div className="header-btn-btn3">
                            Login
                        </div>
                    </Link>
                </div>
            </div>
        );
    }

    StartPage(){
        return(
            <div className="sp-container">
            <div className="sp-section box-1">
                { this.renderHeader() }
                <div className="sp-box1-info">
                    <div className="title">
                        <p>WORKIT</p>
                    </div>
                    <div className="sp-text-info">
                    <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                    <br /> 
                    incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, 
                    <br /> 
                    quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
                    <br /> 
                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu 
                    <br /> 
                    fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                    <br /> 
                    sunt in culpa qui officia deserunt mollit anim id est laborum.
                    <br /> 
                    </p>
                    </div>
                    <div className="sp-container-btn-join">
                    <Link to="/signup">
                        <button type="button" className="sp-btn-join">
                            Join!
                        </button>
                    </Link>
                    </div>
                </div>
            </div>
            <div className="sp-section box-2">
                <div className="box-2-top">
                    <div className="box-2-img">
                    </div>
                    <div className="box-2-info">
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                        <br /> 
                        incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, 
                        <br /> 
                        quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
                        <br /> 
                        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu 
                        <br /> 
                        fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                        <br /> 
                        sunt in culpa qui officia deserunt mollit anim id est laborum.
                        <br /> 
                        </p>
                    </div>
                </div>
                <div className="box-2-bottom" />
            </div>
            <div className="sp-section box-3">
                boring info
            </div>
        </div>
        );
    }

    render(){
        return(
             this.StartPage()
         );
    }

}
