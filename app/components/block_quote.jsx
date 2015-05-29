import React from "react";
import BlockComponent from "app/templates/block_component";

import Block from "app/models/block";


class BlockQuote extends BlockComponent {

  render() {
    var block = this.props.block;
    return (
      <blockquote
        className={"block-container"}
        data-index={block.get("index")}>
        <p
          className={"block-content block-quote"}
          contentEditable={this.props.shouldEnableEdits}
          ref={"content"}>
        </p>
      </blockquote>
    );
  }
}


module.exports = BlockQuote;
