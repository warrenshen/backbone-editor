import React from "react";

import BlockComponent from "app/templates/block_component";


class BlockList extends BlockComponent {

  // --------------------------------------------------
  // Defaults
  // --------------------------------------------------
  displayName() {
    return "BlockList";
  }

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  render() {
    return (
      <div
        className={"block-container"}
        data-index={this.props.block.get("index")}>
        <li
          className={"block-content block-list"}
          ref={"content"}>
        </li>
      </div>
    );
  }
}


module.exports = BlockList;
