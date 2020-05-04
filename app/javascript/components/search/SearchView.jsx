import React from 'react';
import { withRouter } from 'react-router'
import PropTypes from "prop-types";
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { RedCompanyCard } from '../../templates/templates';
import Popover from '@material-ui/core/Popover';

const useStyles = theme => ({
  root: {
    marginLeft: "6%",
    marginRight: "6%",
    marginTop: '2%',
    marginBotton: '2%',
  },
  searchBar: {
    marginTop: '2%',
  },
  table: {
    marginBotton: '2%',
  },  
  media: {    
    marginLeft: 'auto',
    marginRight: 'auto',
    maxHeight: '100%',
    objectFit: 'scale-down',
    height: 100,
  },
  cardContent: {
    textAlign: 'left',
  },
  popover: {
    pointerEvents: 'none',
  },
  card: {
    width: '250px',
  },
});

class SearchView extends React.Component {

  constructor( props) {
    super( props);
    this.state = {
      searching: false,
      words: "",
      queryResults: null,
      anchors: {}
    };
    this.anchorsSet = {}
    this.searchToken = null;
  }

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  static propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  };

  query() {
    this.setState( { searching: true});
    const url = "/api/v1/query";
    const csrfToken = document.querySelector( "meta[name=csrf-token]").content;
    const request = {
      method: "POST",
      headers: { 
        "ContentType": "application/json",
        "X-CSRF-Token": csrfToken
      },
      body: JSON.stringify( {
        query: {
          words: this.state.words
        }
      })
    };
    fetch( url, request)
      .then( response => {
        if (response.ok)
          return response.json();
        throw new Error( `Server returns code ${response.status}! =(`);
      })
      .then( response => {
        if (this.mounted)
          this.setState( { 
            queryResults: response, 
            searching: false 
          });
      })
      .then( () => {
        if (this.searchToken)
          this.searchToken();
        this.searchToken = null;
      })
      .catch( console.log);
  }

  onChange = event => {
    this.setState( { words: event.target.value });
    if (! this.state.searching)
      this.query();
    else 
      this.searchToken = () => this.query();
  };

  handlePopover = (elem, show) => event => {
    if (show) {
      this.anchorsSet[elem] = true;
      const targetElement = event.currentTarget;
      setTimeout( () => {
        if (! this.anchorsSet[elem])
          return;
        var anchors = this.state.anchors
        anchors[elem] = targetElement;
        this.setState( { anchors: anchors });
      }, 1000);
      return;
    }
    this.anchorsSet[elem] = false;
    var anchors = this.state.anchors
    anchors[elem] = null;
    this.setState( { anchors: anchors });
  };

  filterNils = token => token == "" || ! token ? 
    "Not available" : token;

  table = ( queryResults, classes) => (
    <TableContainer component = { Paper }>
      <Table className = { classes.table } 
        stickyHeader 
        aria-label = "sticky table">
        <TableHead>
          <TableRow>
            <TableCell>Company</TableCell>
            <TableCell align = "right">Symbol</TableCell>
            <TableCell align = "right">Sector</TableCell>
            <TableCell align = "right">Industry</TableCell>
            <TableCell align = "right">Location</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          { queryResults.map( item => (
            <TableRow hover key = { item.symbol } 
              onClick = { () => { this.props.history.push( 
                `/profiles/${item.symbol}`); } }
            >
              <TableCell
                aria-owns = { this.state.anchors[item.symbol] ? item.symbol : 
                  undefined }
                aria-haspopup = "true"
                onMouseEnter = { this.handlePopover( item.symbol, true) }
                onMouseLeave = { this.handlePopover( item.symbol, false) }
                onClick = { () => this.setState( { redirect: item.symbol }) }
              >
                { item.companyName }
                <Popover
                  id = { item.symbol }
                  className = { classes.popover }
                  classes = {{
                    paper: classes.paper,
                  }}
                  open = { this.state.anchors[item.symbol] != null }
                  anchorEl = { this.state.anchors[item.symbol] }
                  anchorOrigin = {{
                    vertical: 'bottom',
                    horizontal: 'center',
                  }}
                  transformOrigin = {{
                    vertical: 'top',
                    horizontal: 'center',
                  }}
                >
                  { RedCompanyCard( item, classes) }
                </Popover>
              </TableCell>
              <TableCell align = "right">{ item.symbol }</TableCell>
              <TableCell align = "right">{ this.filterNils( item.sector) 
                }</TableCell>
              <TableCell align = "right">{ this.filterNils( item.industy) 
                }</TableCell>
              <TableCell align = "right">{ this.filterNils( item.location) 
                }</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  render() {
    const { classes } = this.props;
    const { queryResults } = this.state
    return (
      <div className = { classes.root }>
        <Typography variant = "h3" align = "center">
          Search
        </Typography> 
        <TextField className = { classes.searchBar }
          fullWidth
          label = "Search"
          type = "search"
          id = "searchBar"
          variant = "filled"
          onInput = { this.onChange }
        />
        { queryResults ? this.table( queryResults, classes) : ("Nothing") }
      </div>
    );
  }
}

export default withRouter( withStyles( useStyles)( SearchView));