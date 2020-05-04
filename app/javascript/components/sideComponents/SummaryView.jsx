import React, { Suspense } from 'react';
import Ticker from 'react-ticker';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { Popover, Typography, Button } from '@material-ui/core';

const useStyles = theme => ({
  root: {
    width: '100%',
    padding: 0,
    overflow: 'hidden',
    display: 'flex',
    scrollbehavior: 'smooth',
  },
  popover: {
    pointerEvents: 'none',
  },
  child: {
    width: '100px',
  },
  text: {
    align: 'center',
  },
  red : {
    color: theme.palette.error.main,
    textAlign: 'center',
  },
  green : {
    color: theme.palette.success.main,
    textAlign: 'center',
  },
}); 

class SummaryView extends React.Component {
 
  constructor( props) {
    super( props);
    this.state = {
      summary: [],
      anchors: {}
    };
  }

  handlePopover = elem => event => {
    var anchors = this.state.anchors
    anchors[elem] = anchors[elem] ? null : event.currentTarget;
    this.setState( { anchors: anchors });
  };

  componentDidMount() {
    const url = "/api/v1/summary/index";
    fetch( url)
      .then( response => {
        if (response.ok)
          return response.json();
        throw new Error( `Server returns code ${response.status}! =(`);
      })
      .then( response => this.setState( { summary: response }))
      .catch( console.log);
  }

  render() {
    const props = this.props;
    const { classes } = props; 
    const summary = this.state.summary;

    const allSummary = summary.map( ( stockToken, idx) => (
      <div key = { idx }>
          <ListItem alignItems = "flex-start"
            className = { classes.child }>
            <ListItemText 
              classes = { {secondary: stockToken.change_pct < 0 ? 
                classes.red : classes.green} }
              primary = { 
                <Button
                  onClick = { null }
                >
                  { stockToken.symbol }
                </Button> }
              secondary = { `${stockToken.change_pct  > 0 ? '+' : ''}${
              stockToken.change_pct }%` } />
          </ListItem>
      </div>
    ));
  
    return (
      <Suspense>
        <Ticker>
          { () => (
            <List ref = { this.summaryRef }
              style = { props } 
              disablePadding = { true }
              className = { classes.root }>
              { allSummary }
            </List>
          ) }
        </Ticker>
      </Suspense>
    );
  }
}

export default withStyles( useStyles)( SummaryView);