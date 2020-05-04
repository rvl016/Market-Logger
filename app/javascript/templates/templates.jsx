import React from 'react';
import clsx from 'clsx';
import { Card, CardHeader, CardMedia, CardContent, CardActions, CardActionArea } 
from '@material-ui/core';
import Link from '@material-ui/core/Link';
import IconButton from '@material-ui/core/IconButton';
import ToggleButton from '@material-ui/lab/ToggleButton';

import { List, ListItem, ListItemText, Typography, 
Divider } from '@material-ui/core';
import Collapse from '@material-ui/core/Collapse';

import Button from '@material-ui/core/Button';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

function CompanyCard( props, classes, authToken, userLikes, setUserLike) {
  const filterNils = token => token == "" || ! token ? 
  "Not available" : token;
  const preventDefault = event => event.preventDefault();
  return (
    <Card>
      <CardActionArea
        onClick = { () => this.props.history.push( 
          `/profiles/${props.symbol}`) }
      >
        <CardHeader
          title = { props.companyName }
          subheader = { props.symbol }
        />
        <CardMedia
          className = { classes.media }
          image = { props.image }
          component = "img"
          title = "Logo"
        />
        <CardContent className = { classes.cardContent }>
          <List className = { classes.list } >
            <Divider variant = "middle" component = "li" />
            <ListItem>
              <ListItemText primary = "Sector" secondary = { filterNils( 
                props.sector) } />
            </ListItem>
            <Divider variant = "middle" component = "li" />
            <ListItem>
              <ListItemText primary = "Industry" secondary = { filterNils( 
                props.industry) } />
            </ListItem>
            <Divider variant = "middle" component = "li" />
            <ListItem>
              <ListItemText primary = "Exchange" secondary = { 
                filterNils( props.exchange) } />
            </ListItem>
            <Divider variant = "middle" component = "li" />
            <ListItem>
              <ListItemText 
                classes = { {secondary: props.change_pct < 0 ? 
                  classes.red : classes.green} }
                primary = "Stock variation" 
                secondary = { `${props.change_pct > 0 ? '+' : ''}${
                  props.change_pct}%` } />
            </ListItem>
            <Divider variant = "middle" component = "li" />
            <ListItem>
              <ListItemText primary = "CEO" secondary = { 
                filterNils( props.ceo) } />
            </ListItem>
            <Divider variant = "middle" component = "li" />
            <ListItem>
              <ListItemText primary = { "Website" } secondary = 
                { filterNils( props.website) == "Not available" ? 
                "Not available" : <Link href = { props.website } onClick = { 
                preventDefault } color = "secondary" classes = 
                { classes.alink }>{ props.website }</Link> } />
            </ListItem>
          </List>
        </CardContent>  
      </CardActionArea>
      <CardActions disableSpacing>
        <ToggleButton aria-label = "add to favorites"
          value = "like"
          disabled = { ! authToken }
          onChange = { () => setUserLike( { 
            id: props.id, new: ! userLikes.some( like => like == props.id) }) }
          selected = { userLikes.some( like => like ==
            props.id) }
        >
          <FavoriteIcon />
        </ToggleButton>
        <IconButton
          id = { props.symbol }
          className= { clsx( classes.expand, {
            [classes.expandOpen]: this.state.expanded[props.symbol],
          }) }
          disabled = { 
            filterNils( props.description) == "Not available" }
          onClick = { this.handleExpandClick( props.symbol) }
          aria-expanded = { this.state.expanded[props.symbol] }
          aria-label = "show more"
        >
          <ExpandMoreIcon />
        </IconButton>
      </CardActions>
      <Collapse in = { this.state.expanded[props.symbol] } 
        timeout = "auto" unmountOnExit >
        <CardContent>
          <Typography>{ props.description }</Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
}

function RedCompanyCard( props, classes) {
  const filter = token => token == "" || ! token ? 
    "Not available" : token.length > 200 ? token.slice( 0,200) + 
    ' ...' : token;
  return (
    <Card className = { classes.card }>
      <CardHeader
        title = { props.companyName }
        subheader = { props.symbol }
      />
      <CardMedia
        className = { classes.media }
        image = { props.image }
        component = "img"
        title = "Logo"
      />
      <CardContent className = { classes.cardContent }>
        <Typography>
          { filter( props.description) }
        </Typography>
      </CardContent>  
    </Card>
  );

}

export { CompanyCard, RedCompanyCard };
