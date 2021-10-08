import React, { Component } from "react";
import Switch from '@material-ui/core/Switch';
import { alpha, styled } from '@material-ui/core/styles';

const label = { inputProps: { 'aria-label': 'Switch demo' } };

/*Switch in order to make yourself searchable or not searchable for other clients within the social media system*/

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
         /*Write state stuff here please yes*/   
        }
    }

render() {
    return (
        <div>
            <OrangeSwitch {...label}/>
      </div>
    );
  };
}