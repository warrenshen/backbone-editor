import ClassNames from "classnames";
import React from "react";
import BlockComponent from "app/templates/block_component";

import Block from "app/models/block";


class BlockQuote extends BlockComponent {

  render() {
    var block = this.props.block;
    var contentClass = ClassNames(
      { "block-content": true },
      { "block-quote": true },
      { "block-centered": block.get("centered") }
    );
    return (
      <blockquote
        className={"block-container"}
        data-index={block.get("index")}>
        <p
          className={contentClass}
          contentEditable={this.props.shouldEnableEdits}
          ref={"content"}>
        </p>
      </blockquote>
    );
  }
}


module.exports = BlockQuote;
