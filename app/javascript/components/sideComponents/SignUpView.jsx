import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';

import { withStyles } from '@material-ui/core/styles';
import { UserContext } from '../App';

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

class SignUpView extends React.Component {

  constructor( props) {
    super( props);
    this.state = {
      open: false,
      fields: {
        status: {},
        message: {},
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
  }

  onSubmit = (setUserName, setAuthToken) => {
    const { content } = this.state.fields
    const csrfToken = document.querySelector( "meta[name=csrf-token]").content;
    const url = "/api/v1/auth/signup";
    const request = {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken
      },
      body: JSON.stringify( {
        user: {
          username: content.username,
          name: content.name,
          email: content.email,
          password: content.password,
          password_confirmation: content.password_confirmation
        }
      })
    };
    fetch( url, request)
      .then( response => {
        if (response.status == 201 || response.status == 406)
          return response.json();
        throw new Error( `Server returns code ${response.status}! =(`);
      })
      .then( response => {
        if (response.code == 406) {
          this.showAlert( "Please, check fields requirements.", 
            "error");
          return this.showErrors( response.errors);
        }
        setUserName( response.user.name);
        setAuthToken( response.authToken);
        this.showAlert( `You are in, ${response.user.name}! =)`, "success");
        this.toggleDialog();
      })
      .catch( console.log);
  };

  showErrors( errors) {
    const fields = this.state.fields; 
    const keys = ["username", "name", "email", "password",
      "password_confirmation"];
    const message = {};
    const status = {};
    keys.forEach( key => {
      if (errors[key]) {
        message[key] = errors[key][0];
        status[key] = true;
      }
    });
    fields.message = message;
    fields.status = status;
    this.setState( { fields: fields });
  }

  onChange = elem => event => {
    const fields = this.state.fields;
    fields.content[elem] = event.target.value;
    this.setState( { fields: fields });
  };

  closeAlert = () => {
    this.setState( { alert: { 
      open: false,
      message: this.state.alert.message,
      status: this.state.alert.status 
    } });
  };

  showAlert( message, type) {
    this.setState( { alert: { 
      open: true,
      message: message,
      status: type
    }});
  }

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
              <DialogTitle>Sign Up</DialogTitle> 
              <DialogContent>
                <form className = { classes.root } noValidate>
                  <div>
                    <TextField
                      error = { this.state.fields.status.name }
                      margin = 'none'
                      id = 'name'
                      label = 'Fullname'
                      type = 'name'
                      variant = 'filled'
                      onChange = { this.onChange( 'name') }
                      helperText = { this.state.fields.message.name }
                    />
                  </div>
                  <div>
                    <TextField
                      error = { this.state.fields.status.username }
                      margin = 'none'
                      id = 'username'
                      label = 'Username'
                      type = 'username'
                      variant = 'filled'
                      onChange = { this.onChange( 'username') }
                      helperText = { this.state.fields.message.username }
                    />
                  </div>
                  <div>
                    <TextField
                      error = { this.state.fields.status.email }
                      margin = 'none'
                      id = 'email'
                      label = 'Email Address'
                      type = 'email'
                      variant = 'filled'
                      onChange = { this.onChange( 'email') }
                      helperText = { this.state.fields.message.email }
                    />
                  </div>
                  <div>
                    <TextField
                      error = { this.state.fields.status.password }
                      margin = 'none'
                      id = 'passwd'
                      label = 'New Password'
                      type = 'password'
                      variant = 'filled'
                      onChange = { this.onChange( 'password') }
                      helperText = { this.state.fields.message.password }
                    />
                  </div>
                  <div>
                    <TextField
                      error = { this.state.fields.status.password_confirmation }
                      margin = 'none'
                      id = 'passwdConf'
                      label = 'Confirm Password'
                      type = 'password'
                      variant = 'filled'
                      onChange = { this.onChange( 'password_confirmation') }
                      helperText = { 
                        this.state.fields.message.password_confirmation }
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
               6000 } 
              onClose = { this.closeAlert }>
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

export default withStyles( useStyles)( SignUpView);