import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { UserContext } from '../App';

import { withStyles } from '@material-ui/core/styles';

const useStyles = theme => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: 250,
    },
  },
});

const Transition = React.forwardRef( function Transition( props, ref) {
  return <Slide direction = "down" ref = { ref } { ...props } />;
});

const Alert = props => (<MuiAlert elevation = { 6 } variant = "filled" { ...props } />);

class LoginView extends React.Component {

  constructor( props) {
    super( props);
    this.state = {
      open: false,
      fields: {
        content: {}
      },
      alert: {
        open: false,
        status: null,
        message: null
      }
    };
  }

  toggleDialog = () => {
    this.setState( { open: ! this.state.open });
  }; 
  
  closeAlert = () => {
    this.setState( { alert: { 
      open: false,
      message: this.state.alert.message,
      status: this.state.alert.status 
    } });
  };

  onChange = elem => event => {
    const fields = this.state.fields;
    fields.content[elem] = event.target.value;
    this.setState( { fields: fields });
  };

  showAlert( message, type) {
    this.setState( { alert: { 
      open: true,
      message: message,
      status: type
    }});
  }

  onSubmit = (setUserName, setAuthToken) => {
    const { content } = this.state.fields
    const csrfToken = document.querySelector( "meta[name=csrf-token]").content;
    const url = "/api/v1/auth/login";
    const request = {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken
      },
      body: JSON.stringify( {
        user: {
          id: content.id,
          password: content.password
        }
      })
    };
    fetch( url, request)
      .then( response => {
        if (response.status == 201 || response.status == 401)
          return response.json();
        throw new Error( `Server returns code ${response.status}! =(`);
      })
      .then( response => {
        if (response.code == 401)
          return this.showAlert( "Unauthorized. Please, check your data. =(", 
            "error");
        console.log( "User logged in!");
        this.showAlert( `Welcome, ${response.user.name}! =)`, "success");
        setUserName( response.user.name);
        setAuthToken( response.authToken);
        this.toggleDialog();
      })
      .catch( console.log);
  };

  render() {
    const { classes } = this.props;
    return (
      <UserContext.Consumer>
        { ({setUserName, setAuthToken}) => (
          <>
            <Dialog 
              disableBackdropClick 
              open = { this.state.open } 
              onClose = { this.toggleDialog } 
              TransitionComponent = { Transition } >
              <DialogTitle>Login</DialogTitle>
              <DialogContent>  
                <form className = { classes.root } noValidate>
                  <div>
                    <TextField
                      autoFocus
                      error = { this.state.alert.status == 'error' }
                      margin = 'none'
                      id = 'email'
                      label = 'Email Address or Username'
                      type = 'email'
                      variant = 'filled'
                      onChange = { this.onChange( 'id')}
                    />
                  </div>
                  <div>
                    <TextField
                      error = { this.state.alert.status == 'error' }
                      margin = 'none'
                      id = 'password'
                      label = 'Password'
                      type = 'password'
                      variant = 'filled'
                      onChange = { this.onChange( 'password') }
                    />
                  </div>
                </form>
              </DialogContent>
              <DialogActions>
                <Button onClick = { this.toggleDialog }>
                  Cancel
                </Button>
                <Button onClick= { () => this.onSubmit( setUserName,
                  setAuthToken) }>
                  Submit
                </Button>
              </DialogActions>
            </Dialog>
            <Snackbar open = { this.state.alert.open } autoHideDuration = {
              6000 } onClose = { this.closeAlert }>
              <Alert onClose = { this.closeAlert } severity = { 
                this.state.alert.status }>
                { this.state.alert.message }
              </Alert>
            </Snackbar>
          </>
        ) }
      </UserContext.Consumer>
    )
  }
}

export default withStyles( useStyles)( LoginView);