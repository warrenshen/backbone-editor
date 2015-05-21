import React from "react";
import BlockComponent from "app/templates/block_component";


class BlockStandard extends BlockComponent {

  render() {
    return (
      <div className={"block-container"}>
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
