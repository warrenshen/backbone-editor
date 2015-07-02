import ClassNames from "classnames";
import React from "react";

import BlockEdit from "app/templates/block_edit";


class BlockQuote extends BlockEdit {

  // --------------------------------------------------
  // Defaults
  // --------------------------------------------------
  displayName() {
    return "BlockQuote";
  }

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  render() {
    var block = this.props.block;
    var contentClass = ClassNames(
      { "block-content": true },
      { "block-quote": true },
      { "block-centered": block.isCentered() }
    );
    return (
      <blockquote
        className={"block-container"}
        data-index={block.get("index")}>
        <p className={contentClass} ref={"content"}></p>
      </blockquote>
    );
  }
}


module.exports = BlockQuote;
