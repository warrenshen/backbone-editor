import React from "react";

import Component from "app/templates/component";


class ViewExport extends Component {

  // --------------------------------------------------
  // Defaults
  // --------------------------------------------------
  displayName() {
    return "ViewExport";
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


module.exports = ViewExport;
