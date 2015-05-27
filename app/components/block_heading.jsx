import React from "react";
import BlockComponent from "app/templates/block_component";

import Block from "app/models/block";


class BlockHeading extends BlockComponent {

  render() {
    var block = this.props.block;
    return (
      <div
        className={"block-container"}
        data-index={block.get("index")}>
        <h1
          className={"block-content"}
          contentEditable={this.props.shouldEnableEdits}
          ref={"content"}>
        </h1>
      </div>
    );
  }
}


module.exports = BlockHeading;
