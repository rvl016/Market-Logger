import React from 'react';
import { withRouter } from 'react-router';
import PropTypes from "prop-types";
import { withStyles } from '@material-ui/core/styles';

import { Typography, Divider, Grid } from '@material-ui/core';
import { CompanyCard } from '../../templates/templates';
import { UserContext } from '../App';

const useStyles = theme => ({
  root: {
    flexGrow: 1,
    marginLeft: "6%",
    marginRight: "6%",
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



class StandoutView extends React.Component {

  constructor( props) {
    super( props);
    this.state = {
      standouts: [],
      anchors: {},
      expanded: {}
    };
    this.CompanyCard = CompanyCard.bind( this);
  }

  static propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  };

  componentDidMount() {
    this.mounted = true;
    const url = "/api/v1/standouts/index";
    fetch( url)
      .then( response => {
        if (response.ok)
          return response.json();
        throw new Error( `Server returns code ${response.status}! =(`);
      })
      .then( response => {
        if (this.mounted)
          this.setState( { standouts: response }); 
      })
      .catch( console.log);
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  handlePopover = elem => event => {
    var anchors = this.state.anchors;
    anchors[elem] = anchors[elem] ? null : event.currentTarget;
    this.setState( { ...this.state, anchors: anchors });
  };

  handleExpandClick = elem => () => {
    var expanded = this.state.expanded;
    expanded[elem] = expanded[elem] ? false : true;
    this.setState( { ...this.state, expanded: expanded });
  }


  render() {
    const { classes } = this.props; 
    const { standouts } = this.state;
    const genCard = (offset, authToken, userLikes, setUserLike) => ( card, 
      idx) => {
      return (
        <Grid item xs = { 12 } sm = { 6 } md = { 4 } lg = { 3 } 
          key = { idx + offset }>
          { this.CompanyCard( { ...card }, classes, authToken, userLikes, 
            setUserLike) }
        </Grid>
      );
    };
    
    const posCards = (authToken, userLikes, setUserLike) => {
      return standouts.positive ? 
        standouts.positive.map( genCard( 0, authToken, userLikes, 
        setUserLike)) : null;
    }

    const negCards = (authToken, userLikes, setUserLike) => {
      return standouts.negative ?
        standouts.negative.map( genCard( standouts.positive.length, 
          authToken, userLikes, setUserLike)) : null;
    }

    return (
      <UserContext.Consumer>
        { ({ authToken, userLikes, setUserLike }) => (
          <div className = { classes.root }>
            <Typography variant = "h2" align = "center">
              The Best Bet Today
            </Typography>  
            <Typography variant = "subtitle1" align = "center" gutterBottom>
              Top 12 best relative variation
            </Typography>
            <Grid container spacing = { 2 } className = { classes.grid }>
              { posCards( authToken, userLikes, setUserLike) }
            </Grid>
            <br></br>
            <Divider variant = "middle" component = "hr" />
            <br></br>
            <Typography variant = "h2" align = "center">
              The Worst Bet Today
            </Typography>  
            <Typography variant = "subtitle1" align = "center" gutterBottom>
              Top 12 worst relative variation
            </Typography>
            <Grid container spacing = { 2 } className = { classes.grid }>
              { negCards( authToken, userLikes, setUserLike) }
            </Grid>
          </div>
        ) }
      </UserContext.Consumer>
    );
  }
}

export default withRouter( withStyles( useStyles)( StandoutView));

