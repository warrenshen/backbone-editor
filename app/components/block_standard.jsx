import React from "react";
import BlockComponent from "app/templates/block_component";

import Block from "app/models/block";


class BlockStandard extends BlockComponent {

  render() {
    var block = this.props.block;
    return (
      <div
        className={"block-container"}
        data-index={block.get("index")}>
        <p
          className={"block-content"}
          contentEditable={this.props.shouldEnableEdits}
          ref={"content"}>
        </p>
      </div>
    );
  }
}


module.exports = BlockStandard;
