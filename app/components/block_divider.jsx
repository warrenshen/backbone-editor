import React from "react";

import Component from "app/templates/component";


class BlockDivider extends Component {

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  render() {
    var block = this.props.block;
    return (
      <div className={"block-container"}>
        <hr className={"block-divider"}/>
      </div>
    );
  }
}


module.exports = BlockDivider;
