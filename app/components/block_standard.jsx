import React from "react";
import BlockComponent from "app/templates/block_component";

import Formatter from "app/helpers/formatter";


class BlockStandard extends BlockComponent {

  render() {
    return (
      <div className={"block-container"}>
        <p
          className={"block-content"}
          contentEditable={true}
          ref={"content"}>
          {Formatter.format(this.props.block)}
        </p>
      </div>
    );
  }
}


module.exports = BlockStandard;
