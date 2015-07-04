import React from "react";

import Component from "app/templates/component";


class BlockDivider extends Component {

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  render() {
    return (
      <div
        className={"block-container"}
        contentEditable={"false"}
        data-index={this.props.block.get("index")}>
        <hr className={"block-divider"} />
      </div>
    );
  }
}


module.exports = BlockDivider;
