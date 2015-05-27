import React from "react";
import BlockComponent from "app/templates/block_component";

import Block from "app/models/block";

import TypeConstants from "app/constants/type_constants";


class BlockHeading extends BlockComponent {

  renderEditable() {
    return (
      <p
        className={"block-content"}
        contentEditable={this.props.shouldEnableEdits}
        ref={"content"}>
      </p>
    );
  }

  render() {
    var block = this.props.block;
    switch (block.get("type")) {
      case TypeConstants.block.headingOne:
        return (
          <h1
            className={"block-container"}
            data-index={block.get("index")}>
            {this.renderEditable()}
          </h1>
        );
    };
  }
}


module.exports = BlockHeading;
