import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { createStructuredSelector } from 'reselect';

import SummaryView from "./sideComponents/SummaryView";
import StandoutView from "./index/StandoutView";



class IndexView extends React.Component {

  constructor( props) {
    super( props);
  }

  render () {
    return (
      <React.Fragment>
        <SummaryView/>
        <StandoutView/>
      </React.Fragment>
    );
  };
};


export default IndexView;
