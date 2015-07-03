import React from "react";

import Component from "app/templates/component";


class StyleClass extends Component {

  // --------------------------------------------------
  // Defaults
  // --------------------------------------------------
  displayName() {
    return "StyleClass";
  }

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  render() {
    return (
      <code>
        <p className="code">
          <span className="code code-green">
            {".block"}
          </span>
          <span className="code code-rose">
            {" {"}
          </span>
        </p>
        <p className="code code-rose">
          {"}"}
        </p>
      </code>
    );
  }
}


module.exports = StyleClass;
