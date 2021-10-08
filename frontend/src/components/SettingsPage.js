import React, { Component } from "react";
import Switch from '@material-ui/core/Switch';
import { alpha, styled } from '@material-ui/core/styles';

const label = { inputProps: { 'aria-label': 'Switch demo' } };
/*Page to put all user settings*/
/*Switch in order to make yourself searchable or not searchable for other clients within the social media system*/


/*TODO: Fixa så att switchen är av eller på vid load baserat på om
isVisible for users är true eller false i databasen*/
const OrangeSwitch = styled(Switch)(({ theme }) => ({
    '& .MuiSwitch-switchBase.Mui-checked': {
        color: "#e66a04",
        '&:hover': {
            backgroundColor: alpha("#e66a04", theme.palette.action.hoverOpacity),
        },
    },
    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
        backgroundColor: "#e66a04",
    },
    '& .MuiSwitch-switchBase + .MuiSwitch-track': {
        backgroundColor: "white",
    },
    '& .MuiSwitch-switchBase': {
        color: "lightgrey"
    },
}));

export default class SettingsPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isVisible: false,
            sessionActive: false,
        }
    }

    sendDetailsToServer = () => {
        let isVisible = this.state.isVisible;
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            isVisible,
          }),
        };
        console.log(requestOptions.body);
        fetch("/api/change-user-visibilty", requestOptions).then((response) => {
          if (response.ok) {
            console.log("sendDetailsToServer() successful")
          } else {
            console.log("sendDetailsToServer() not OK")
          }
        });
      };


    handleChange = () => {
        this.setState({
         isVisible: !this.state.isVisible,
        })
        this.sendDetailsToServer();
      }

    render() {
        const mystyle = {
            color: "white",
            paddingLeft: "10px",
            fontFamily: "Arial"
          };
        return (
            <div>
                <div>
                <p style={mystyle}>
                    Push below button in order
                    <br/>
                    to make yourself searchable
                    <br/>
                    to other gym members.
                </p>
                </div>
                <div>
                    <OrangeSwitch onChange={() => {this.handleChange();}}{...label} />
                </div>
            </div>
        );
    };
}
