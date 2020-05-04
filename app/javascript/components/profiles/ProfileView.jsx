import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Typography, Divider, Grid, List, ListItem, ListItemText, Link,
  CardMedia } from '@material-ui/core';
import ToggleButton from '@material-ui/lab/ToggleButton';
import FavoriteIcon from '@material-ui/icons/Favorite';
import Box from '@material-ui/core/Box';
import Chart from "chart.js";

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
  graph: {
    background: theme.palette.primary.dark,
    maxHeight: '70%',
    minHeight: '45%',
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


class ProfileView extends React.Component {

  constructor( props) {
    super( props);
    this.state = {
    };
    this.symbol = this.props.match.params.symbol;
    this.chartAbsRef = React.createRef();
    this.chartVarRef = React.createRef();
  }

  async componentDidMount() {
    this.mounted = true;
    await this.fetchData();
    this.genData();
    this.prepareChart( "absolute");
    this.prepareChart( "variation");
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  async fetchData() {
    const url = `/api/v1/profiles/${this.symbol}`;
    await fetch( url)
      .then( response => {
        if (response.ok)
          return response.json();
        throw new Error( `Server returns code ${response.status}! =(`);
      })
      .then( response => {
        if (this.mounted)
          this.setState( { 
            profile: response.profile,
            stockData: response.stockData 
            });
      })
      .catch( console.log);

  }

  prepareChart( type) {
    const chartRef = type == "absolute" ? this.chartAbsRef.current.getContext( 
      "2d") : this.chartVarRef.current.getContext( "2d"); 
    new Chart( chartRef, {
      type: "line",
      data: {
        datasets: [
          {
            borderColor: "#606060",
            backgroundColor: "rgba( 32, 32, 32, .65)",
            data: this.graphData.map( elem => {
              return { x: elem.date, y: type == "absolute" ? elem.valAbs :
              elem.valVar }; 
            })
          }
        ]  
      },
      options: {
        scales: {
          xAxes: [{
            type: 'time',
            time: {
              displayFormats: {
                millisecond: 'll',
                second: 'll',
                minute: 'll',
                hour: 'll',
                day: 'll',
                week: 'll',
                month: 'll',
                quarter: 'll',
                year: 'll',
              },
              source: "data"
            },
            ticks: {
              stepsize: 21600,
            }
          }]
        },
        legend: {
            display: false,
        },
        title: {
            display: true,
            fontSize: 16,
            text: type == "absolute" ? "Stock Values" : "Relative Stock Change"
        }
      } 
    });
  }

  genData() {
    var lastData = { price: null, change_pct: null};
    this.graphData = this.state.stockData.map( data => {
      if (lastData.price == data.price && lastData.change_pct == data.change_pct)
        return null;
      lastData = data;
      return { date: new Date( Date.parse( data.stamp)), valAbs: Number( 
        data.price), valVar: Number( data.change_pct) }
    }).filter( data => data != null);
  }


  render() {
    if (! this.state.profile)
      return (<></>);
    const companyData = this.state.profile;
    const { classes } = this.props; 
    const filterNils = token => token == "" || ! token ? 
      "Not available" : token;
    return ( 
      <UserContext.Consumer>
        { ({authToken, userLikes, setUserLike}) => (
          <div className = { classes.root }>
            <Typography variant = "h3" align = "center">
              { companyData.companyName }
            </Typography> 
            <Box flexShrink = { 1 } display = "flex" p = { 1 } >   
              <CardMedia
                className = { classes.media }
                image = { companyData.image }
                component = "img"
                title = "Logo"
              />
            </Box> 
            <Typography variant = "h5" align = "center">
              { companyData.symbol }
            </Typography>
            <br/>
            <Grid container>
              <Grid item xs = { 12 } md = { 5 } >
                <List className = { classes.list } >
                  <Divider variant = "middle" component = "li" />
                  <ListItem>
                    <ListItemText primary = "Sector" secondary = { filterNils( 
                      companyData.sector) } />
                  </ListItem>
                  <Divider variant = "middle" component = "li" />
                  <ListItem>
                    <ListItemText primary = "Industry" secondary = { filterNils( 
                      companyData.industry) } />
                  </ListItem>
                  <Divider variant = "middle" component = "li" />
                  <ListItem>
                    <ListItemText primary = "Exchange" secondary = { 
                      filterNils( companyData.exchange) } />
                  </ListItem>
                  <Divider variant = "middle" component = "li" />
                  <ListItem>
                    <ListItemText primary = "CEO" secondary = { 
                      filterNils( companyData.ceo) } />
                  </ListItem>
                  <Divider variant = "middle" component = "li" />
                  <ListItem>
                    <ListItemText primary = { "Website" } secondary = 
                      { filterNils( companyData.website) == "Not available" ? 
                      "Not available" : <Link href = { companyData.website } color = "secondary" classes = 
                      { classes.alink }>{ companyData.website }</Link> } />
                  </ListItem>
                  <Divider variant = "middle" component = "li" />
                  <ListItem>
                    <ListItemText primary = { "Description" } secondary = { 
                      companyData.description } />
                  </ListItem>
                  <Divider variant = "middle" component = "li" />
                  <ListItem>
                  <ToggleButton aria-label = "add to favorites"
                    value = "like"
                    disabled = { ! authToken }
                    onChange = { () => setUserLike( { 
                      id: companyData.id, new: ! userLikes.some( like => 
                      like == companyData.id) }) }
                    selected = { userLikes.some( like => like ==
                      companyData.id) }
                  >
                    <FavoriteIcon />
                  </ToggleButton>
                  </ListItem>
                </List>
              </Grid>
              <Grid item xs = { 12 } md = { 7 } >
                <Box className = { classes.graph }>
                  <canvas
                    id = "absGraph"
                    ref = { this.chartAbsRef }
                  />
                </Box>
                <br/>
                <Box className = { classes.graph }>
                  <canvas
                    id = "varGraph"
                    ref = { this.chartVarRef }
                  />
                </Box>
              </Grid>
            </Grid>
          </div>
        ) }
      </UserContext.Consumer>
    );
  }
} 

export default withStyles( useStyles)( ProfileView);

