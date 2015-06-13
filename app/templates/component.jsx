// Imports
// - react
// - templates
// - components
// - models
// - stores
// - actions
// - helpers
// - constants
// - directories

import _ from "lodash";
import React from "react";


class Component extends React.Component {

  // --------------------------------------------------
  // Setup
  // --------------------------------------------------
  constructor(props) {
    super(props);
    this.state = this.getDefaultState();
  }

  // --------------------------------------------------
  // State
  // --------------------------------------------------
  getDefaultState() {
    return {};
  }

  getStoreState() {
    return {};
  }

  setState(nextState) {
    console.log(this.displayName());
    _.merge(nextState, this.getStoreState());
    super.setState(nextState);
  }

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  render() {
    return <div></div>;
  }
}


module.exports = Component;
