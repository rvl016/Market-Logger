import React from 'react';
import { withRouter } from 'react-router';
import PropTypes from "prop-types";
import { withStyles } from '@material-ui/core/styles';

import { Typography, Divider, Grid } from '@material-ui/core';
import { CompanyCard } from '../../templates/templates';
import Pagination from '@material-ui/lab/Pagination';

import { UserContext } from '../App';

const useStyles = theme => ({
  root: {
    marginTop: theme.spacing( 2),
    flexGrow: 1,
    marginLeft: "6%",
    marginRight: "6%",
    marginTop: '2%',
    marginBotton: '2%',
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    width: "100%",
    marginTop: '2%',
    marginBotton: '2%',
  },
  media: {    
    marginLeft: 'auto',
    marginRight: 'auto',
    maxHeight: '100%',
    objectFit: 'scale-down',
    height: 100,
  },
  expand: {
    transform: 'rotate( 0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create( 'transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate( 180deg)',
  },
  cardContent: {
    textAlign: 'left',
  },
  popover: {
    pointerEvents: 'none',
  },
  red : {
    color: theme.palette.error.main,
  },
  green : {
    color: theme.palette.success.main,
  },
}); 

const CARDS_PER_PAGE = 12;

class MainProfilesView extends React.Component {

  constructor() {
    super();
    this.state = {
      page: 1,
      profiles: null,
      expanded: {}
    };
    this.pagesNum = null;
    this.CompanyCard = CompanyCard.bind( this);
  }

  static propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  };
  
  componentDidMount() {
    this.mounted = true;
    const url = "/api/v1/profiles/index";
    fetch( url)
      .then( response => {
        if (response.ok)
          return response.json();
        throw new Error( `Server returns code ${response.status}! =(`);
      })
      .then( response => {
        if (! this.mounted) return;
        this.pagesNum = Math.ceil( response.length / CARDS_PER_PAGE)
        this.setState( { profiles: response })
      })
      .catch( console.log);
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  changePage = (event, page) => {
    this.setState( { page: page });
  };

  handleExpandClick = elem => () => {
    var expanded = this.state.expanded;
    expanded[elem] = expanded[elem] ? false : true;
    this.setState( { ...this.state, expanded: expanded });
  }

  render() {
    const { classes } = this.props; 

    const genCard = (authToken, userLikes, setUserLike) => ( card, idx) => (
      <Grid item xs = { 12 } sm = { 6 } md = { 4 } lg = { 3 } 
        key = { idx }>
        { this.CompanyCard( { ...card }, classes, authToken, userLikes, 
          setUserLike) }
      </Grid>
    );

    const genCardPage = (page, authToken, userLikes, setUserLike) => {
      const startIdx = (page - 1) * CARDS_PER_PAGE;
      const profiles = this.state.profiles.slice( startIdx, 
        startIdx + CARDS_PER_PAGE);
      return profiles.map( genCard( authToken, userLikes, setUserLike));
    }

    return (
      <UserContext.Consumer>
        { ({authToken, userLikes, setUserLike}) => (
          <div className = { classes.root }>
            <Typography variant = "h2" align = "center">
              Profiles
            </Typography> 
            <Pagination disabled = { this.pagesNum == null } 
              count = { this.pagesNum } 
              page = { this.state.page } shape = "rounded" align = "center" 
              onChange = { this.changePage } siblingCount = { 5 } className = 
              { classes.pagination }/>
              <br/>
              <Grid container spacing = { 2 } className = { classes.grid }>
                { this.state.profiles ? genCardPage( this.state.page, 
                  authToken, userLikes, setUserLike) : null }
              </Grid>
            <Pagination disabled = { this.pagesNum == null } 
              count = { this.pagesNum } 
              page = { this.state.page } shape = "rounded" align = "center" 
              onChange = { this.changePage } siblingCount = { 5 } className = 
              { classes.pagination }/>
          </div>
        ) }
      </UserContext.Consumer>
    );
  }
}

export default withRouter( withStyles( useStyles)( MainProfilesView));