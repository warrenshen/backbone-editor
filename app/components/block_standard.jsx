import React from "react";
import BlockComponent from "app/templates/block_component";


class BlockStandard extends BlockComponent {

  render() {
    var block = this.props.block;
    return (
      <div
        className={"block-container"}
        data-index={block.get("index")}>
        <p
          className={"block-content"}
          contentEditable={true}
          ref={"content"}>
        </p>
      </div>
    );
  }
}


module.exports = BlockStandard;
