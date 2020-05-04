import React from "react";
import { withStyles } from '@material-ui/core/styles';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import MenuBarView from './sideComponents/MenuBarView';

import IndexView from './IndexView';
import SearchView from './search/SearchView';
import MainProfilesView from './profiles/MainProfilesView';
import ProfileView from './profiles/ProfileView';
import FooterView from './sideComponents/FooterView';

import "typeface-roboto"
import CssBaseline from "@material-ui/core/CssBaseline/CssBaseline";
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      light: '#6d6d6d',
      main: '#424242',
      dark: '#2b2b2b',
      contrastText: '#fff',
    },
    secondary: {
      light: '#8e8e8e',
      main: '#616161',
      dark: '#373737',
      contrastText: '#000',
    },
  },
  red : '#ff3232',
  green : '#5cb65c',
});

const useStyles = theme => ({
  main: {
    minHeight: 'calc( 100vh - 120px)',
  },
});

export const UserContext = React.createContext( {
  setAuthToken: (token) => {}, 
  setUserName: (name) => {},
  getUserLikes: () => {}, 
  setUserLike: (like) => {}
});

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      authToken: null,
      userName: null,
      userLikes: [],
      userLikesIsSet: false
    }
  }

  setAuthToken = async token => {
    if (token) {
      this.setState( { authToken: token });
      if (this.state.userLikesIsSet) return true;
      return await this.getUserLikes( this.state.authToken);
    }
    this.setState( { authToken: null, userName: null, userLikes: [] });
  }

  setUserName = name => {
    this.setState( { userName: name });
  }

  getUserLikes = async token => {
    const url = "/api/v1/user/likes"    
    const csrfToken = document.querySelector( "meta[name=csrf-token]").content;
    const request = {
      method: "GET",
      headers: { 
        "ContentType": "application/json",
        "X-CSRF-Token": csrfToken,
        "Auth-Token": this.state.authToken
      }
    };
    const response = await fetch( url, request);
    if (response.status > 400) {
      this.setState( { authToken: null })
      return false;
    }
    const data = await response.json();
    this.setState( { authToken: data.authToken });
    if (! response.ok)
      return false;
    this.setState( { userLikes: data.userLikes.map( like => like.name_id), 
      userLikesIsSet: true });
    return true;
  }

  setUserLike = async like => {
    const url = "/api/v1/user/likes"    
    const csrfToken = document.querySelector( "meta[name=csrf-token]").content;
    const request = {
      method: like.new ? "POST" : "DELETE",
      headers: { 
        "ContentType": "application/json",
        "X-CSRF-Token": csrfToken,
        "Auth-Token": this.state.authToken
      },
      body: JSON.stringify( { 
        name_id: like.id 
      })
    };
    const response = await fetch( url, request);
    const data = await response.json();
    if (response.status > 400) {
      this.setState( { authToken: null });
      return false;
    }
    this.setState( { authToken: data.authToken });
    if (! response.ok)
      return false;

    var updateUserLikes = this.state.userLikes;
    if (like.new)
      updateUserLikes.push( like.id);
    else 
      updateUserLikes = updateUserLikes.filter( userLike => userLike != like.id);
    this.setState( { userLikes: updateUserLikes });
    return true;
  }

  render () {
    const setAuthToken = this.setAuthToken;
    const getUserLikes = this.getUserLikes;
    const setUserLike = this.setUserLike;
    const setUserName = this.setUserName;
    const { classes } = this.props;
    return (
      <MuiThemeProvider theme = { theme }>
        <UserContext.Provider
          value = {{ ...this.state, setAuthToken, getUserLikes,
            setUserLike, setUserName }}
        >
          <CssBaseline/>
          <BrowserRouter>
            <MenuBarView/>
              <div className = { classes.main }>
                <Switch>
                  <Route exact path = "/" render = { props => 
                    <IndexView { ...props } /> } />
                  <Route exact path = "/profiles/" render = { props => 
                    <MainProfilesView { ...props } /> } />
                  <Route path = "/profiles/:symbol" render = { props => 
                    <ProfileView { ...props } /> } />
                  <Route exact path = "/search/" render = { () => 
                    <SearchView/> } />
                </Switch>
                <br/><br/>
              </div>
            <FooterView />
          </BrowserRouter>
        </UserContext.Provider>
      </MuiThemeProvider>
    );
  }
}

export default withStyles( useStyles)( App);
