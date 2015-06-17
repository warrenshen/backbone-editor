import React from "react";

import Component from "app/templates/component";


class TemplatePage extends Component {

  // --------------------------------------------------
  // Defaults
  // --------------------------------------------------
  displayName() {
    return "TemplatePage";
  }

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  render() {
    return (
      <div className={"general-page"} ref={"page"}>

      </div>
    );
  }
}


module.exports = TemplatePage;
