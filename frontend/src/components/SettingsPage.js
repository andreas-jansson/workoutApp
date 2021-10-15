import React, { Component } from "react";
import Switch from '@material-ui/core/Switch';
import { alpha, styled } from '@material-ui/core/styles';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core'
import { createTheme } from "@material-ui/core/styles";
import { MuiThemeProvider } from "@material-ui/core";
import { green, red } from '@material-ui/core/colors'
import '../../static/css/settings.css';

const label = { inputProps: { 'aria-label': 'Switch demo' } };
const my_theme = createTheme({
  palette: {
    primary: {
      main: "#e66a04"
    }, secondary: {
      light: '#0066ff',
      main: '#0044ff',
    }
  },
  overrides: {
    MuiFilledInput: {
      root: {
        backgroundColor: "rgb(232, 241, 250)",
        "&:hover": {
          backgroundColor: "rgb(250, 232, 241)",
          "@media (hover: none)": {
            backgroundColor: "rgb(232, 241, 250)"
          }
        },
        "&.Mui-focused": {
          backgroundColor: "rgb(250, 241, 232)"
        }
      }
    }
  }
})
const dialog_theme = createTheme({ palette: { primary: green, secondary: red, orange: "#e66a04" } })

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
      isLoaded: false,
      open: false,
    }
  }

  handleChange = () => {
    this.setState({
      isVisible: !this.state.isVisible
    },
      () => {
        var isVisible = this.state.isVisible;
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            isVisible,
          }),
        };
        console.log(requestOptions.body);
        fetch("/api/change-user-visibility", requestOptions).then((response) => {
          if (response.ok) {
            console.log("sendDetailsToServer() successful")
          } else {
            console.log("sendDetailsToServer() not OK")
          }
        })
      });
  }

  loadState() {
    fetch('/api/get-user-visibility')
      .then(res => res.json())
      .then(result => {
        this.setState({
          isLoaded: true,
          isVisible: result.isVisible,
        });
      });
  }

  componentDidMount() {
    this.loadState();
  }

  handleClickOpen = () => {
    this.setState({ open: true })
  };

  handleClose = () => {
    this.setState({ open: false })
  };

  deleteUser = () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
      })
    }
    fetch("/api/settings-user-delete", requestOptions).then((response) => {
      if (response.ok) {
        console.log("Woho!!");
        window.location.href = "/";
      } else {
        console.log("Failed!");
      }
    });
  };

  render() {
    const mystyle = {
      color: "white",
      paddingLeft: "10px",
      fontFamily: "Arial"
    };
    if (!this.state.isLoaded) {
      return <div>Loading ... </div>;
    } else {
      return (
        <div id='settings-wrapper'>
          <div>
            <p style={mystyle}>
              Push switch below in order
              <br />
              to make yourself searchable
              <br />
              to other gym members.
            </p>
          </div>
          <div>
            <OrangeSwitch onChange={() => { this.handleChange(); }} {...label} checked={this.state.isVisible} />
          </div>
          <MuiThemeProvider theme={my_theme}>
          <br />
          <Button onClick={this.handleClickOpen} 
          color='primary' 
          backgroundColor='primary'
          variant='contained' 
          size = 'large'
          margin='normal'>Delete Account</Button></MuiThemeProvider>
          <Dialog
              open={this.state.open}
              onClose={this.handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
              PaperProps={{
                style: {
                  backgroundColor: '#292727',
                  color: '#e66a04',
                },
              }}
            >
              <DialogTitle id="alert-dialog-title" >
                {"Attention!"}
              </DialogTitle>
              <DialogContent>
              <MuiThemeProvider theme={dialog_theme}><DialogContentText color="orange" id="alert-dialog-description">
                  Are you sure you want to delete your account?
                </DialogContentText></MuiThemeProvider>
              </DialogContent>
              <DialogActions>
                <MuiThemeProvider theme={dialog_theme}><Button color="primary" onClick={this.handleClose}>Take me back!</Button></MuiThemeProvider>
                <MuiThemeProvider theme={dialog_theme}><Button color="secondary" onClick={this.deleteUser} autoFocus>
                  Delete :/
                </Button></MuiThemeProvider>
              </DialogActions>
            </Dialog>
        </div>
      );
    };
  }
}
