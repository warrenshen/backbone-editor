import React from "react";

import BlockEdit from "app/templates/block_edit";


class BlockList extends BlockEdit {

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
