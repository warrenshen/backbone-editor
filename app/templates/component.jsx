// Imports
// - react + super component
// - components
// - models
// - stores
// - actions
// - helpers
// - constants

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

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  render() {
    return <div></div>;
  }
}


module.exports = Component;
