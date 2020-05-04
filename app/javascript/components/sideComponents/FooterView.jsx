import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import LinkedInIcon from '@material-ui/icons/LinkedIn';
import GitHubIcon from '@material-ui/icons/GitHub';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import { Grid } from '@material-ui/core';
import { Container } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';

const useStyles = theme => ({
  root: {
    backgroundColor: theme.palette.primary.main,
    width: '100%',
    height: '120px',
    marginBotton: '0px',
  },
  container: {
    disply: 'flex',
    textAlign: "center",
    justifyContent: 'center',
    alignItems: 'center',
  },
  links: {
    display: 'flex',
    flex: 'row',
    textAlign: "center",
  },
  icon: {
    fontSize: 28,
    color: theme.palette.primary.contrastText,
  },
  title: {
    textAlign: "center",
  },
}); 

class FooterView extends React.Component {

  constructor( props) {
    super( props);
  }

  preventDefault = (event) => event.preventDefault();

  render() {
    const { classes } = this.props; 
    return (
      <div className = { classes.root }>
        <br/>
        <div className = { classes.container }>
          <Typography variant = "h6" className = { classes.title }>
            Made by Ravi do Valle Luz
          </Typography>
        </div>
        <div className = { classes.container }>
          <IconButton 
            disableRipple = { true }
            edge = "start" 
            className = { classes.LinkButton } 
            href = "https://github.com/rvl016" >
            <GitHubIcon className = { classes.icon } />
          </IconButton>
          <IconButton 
            disableRipple = { true }
            edge = "start" 
            className = { classes.LinkButton } 
            href = "https://www.linkedin.com/in/ravi-do-valle-luz-7ba779125/" >
            <LinkedInIcon className = { classes.icon } />
          </IconButton>
          <IconButton 
            disableRipple = { true }
            edge = "start" 
            className = { classes.LinkButton } 
            href = "mailto:ravi.luz@usp.br" >
            <MailOutlineIcon className = { classes.icon } />
          </IconButton>
        </div>
        <br/>
      </div>
    );
  }
};

export default withStyles( useStyles)( FooterView);