import ClassNames from "classnames";
import React from "react";

import BlockComponent from "app/templates/block_component";


class BlockQuote extends BlockComponent {

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
      { "block-centered": block.get("is_centered") },
      { "block-last": block.isLast() }
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
