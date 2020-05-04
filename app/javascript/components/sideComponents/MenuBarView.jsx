import React from 'react';
import { withRouter } from 'react-router';
import PropTypes from "prop-types";
import { withStyles } from '@material-ui/core/styles';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';

import { VpnKey, ExitToApp, Home, Business, Search } from
  '@material-ui/icons';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';

import Popover from '@material-ui/core/Popover';

import { UserContext } from '../App';
import LoginView from './LoginView';
import SignUpView from './SignUpView';

const useStyles = theme => ({
  right: {
    marginLeft: 'auto',
    display: 'flex',
    flexDirection: 'row',
  },
  center: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
    textAlign: "center",
    alignItems: 'center',
  },
  popover: {
    pointerEvents: 'none',
  },
  paper: {
    padding: theme.spacing( 1),
  },
}); 



const LoginRef = React.forwardRef( (props, ref) => (
  <LoginView ref = { ref }/>
));
const SignUpRef = React.forwardRef( (props, ref) => (
  <SignUpView ref = { ref }/>
));

class MenuBarView extends React.Component {

  constructor( props) {
    super( props);
    this.state = {
      anchors: {
        loginBtn: null,
        signUpBtn: null,
        singOutBtn: null,
        searchBtn: null,
        homeBtn: null,
        profilesBtn: null
      }
    };
    this.loginRef = React.createRef();
    this.signUpRef = React.createRef();
  }

  static propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  };

  handlePopover = elem => event => {
    var anchors = this.state.anchors
    if (anchors[elem])
      anchors[elem] = null;
    else 
      anchors[elem] = event.currentTarget;
    this.setState( { anchors: anchors });
  };

  getViewName = () => {
    const routesName = {
      '/': 'Home',
      '/search': 'Search',
      '/profiles': 'Profiles'
    }
    return routesName[this.props.location.pathname];
  };


  render() {
    const { classes } = this.props;
    const mouseOverIcon = ( elemName, IconType, msg, action = () => {}) => (
      <IconButton 
        disableRipple = { true }
        edge = "start" 
        className = { classes.menuButton } 
        color = "inherit"
        aria-owns = { this.state.anchors[elemName] ? elemName : undefined }
        aria-haspopup = "true"
        onMouseEnter = { this.handlePopover( elemName) }
        onMouseLeave = { this.handlePopover( elemName) }
        onClick = { action }
      >
        <IconType />
        <Popover
          id = { elemName }
          className = { classes.popover }
          classes = {{
            paper: classes.paper,
          }}
          open = { this.state.anchors[elemName] != null }
          anchorEl = { this.state.anchors[elemName] }
          anchorOrigin = {{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin = {{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          <Typography>{ msg }</Typography>
        </Popover>
      </IconButton>
    );
    return (
      <UserContext.Consumer>
        { ({userName, authToken, setAuthToken}) => (
          <>
            <AppBar 
              position = "sticky" 
              color = "primary"
              className = { classes.bar } >
              <Toolbar variant = 'dense'>
                { mouseOverIcon( 'backBtn', ArrowBackIcon, 'Previous page',
                  () => { this.props.history.goBack() }) }
                <Typography variant = "h6" className = { classes.title }>
                  { this.getViewName() }
                </Typography>
                <div className = { classes.right }>
                  { mouseOverIcon( 'homeBtn', Home, 'Home',
                    () => { this.props.history.push( '/'); })}
                  { mouseOverIcon( 'searchBtn', Search, 
                    'Search for companies', 
                    () => { this.props.history.push( '/search'); })}
                  { mouseOverIcon( 'profilesBtn', Business, 
                    'Look for companies', 
                    () => { this.props.history.push( '/profiles') })} 
                </div>
                <div className = { classes.right }>
                  { authToken ? '' : mouseOverIcon( 'loginBtn', VpnKey, 
                    'Login', 
                    () => { this.loginRef.current.toggleDialog() }) }
                  { authToken ? '' : mouseOverIcon( 'signUpBtn',
                    AssignmentIndIcon, 'Sign up',
                    () => { this.signUpRef.current.toggleDialog() }) }
                  { authToken ? <Typography variant = "h6" className = { 
                    classes.title }>{ userName }</Typography> : '' }
                  { authToken ? mouseOverIcon( 'signOutBtn', ExitToApp, 
                    'Sign out', () => setAuthToken( null)) : '' }
                </div>
              </Toolbar>
            </AppBar>
            <LoginRef ref = { this.loginRef }/>
            <SignUpRef ref = { this.signUpRef }/>
          </>
        ) }
      </UserContext.Consumer>
    );
  };
};

export default withRouter( withStyles( useStyles)( MenuBarView));