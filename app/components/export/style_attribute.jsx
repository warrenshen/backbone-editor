import React from "react";

import Component from "app/templates/component";


class StyleAttribute extends Component {

  // --------------------------------------------------
  // Defaults
  // --------------------------------------------------
  displayName() {
    return "StyleAttribute";
  }

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  render() {
    return (
      <p className="code">
        <span className="code code-blue">
          {"  position"}
        </span>
        <span className="code">
          {": "}
        </span>
        <span className="code code-green">
          {"relative"}
        </span>
        <span className="code">
          {";"}
        </span>
      </p>
    );
  }
}


module.exports = StyleAttribute;
