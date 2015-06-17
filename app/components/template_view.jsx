import React from "react";

import Component from "app/templates/component";


class TemplateView extends Component {

  // --------------------------------------------------
  // Defaults
  // --------------------------------------------------
  displayName() {
    return "TemplateView";
  }

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  render() {
    return (
      <div className={"general-view"} ref={"view"}>

      </div>
    );
  }
}


module.exports = TemplateView;
