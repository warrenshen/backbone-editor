import ClassNames from "classnames";
import React from "react";

import BlockComponent from "app/templates/block_component";

import TypeConstants from "app/constants/type_constants";


class BlockHeading extends BlockComponent {

  // --------------------------------------------------
  // Defaults
  // --------------------------------------------------
  displayName() {
    return "BlockHeading";
  }

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  render() {
    var block = this.props.block;
    var type = block.get("type");
    var contentClass = ClassNames(
      { "block-content": true },
      { "block-centered": block.get("is_centered") },
      { "block-heading-one": type === TypeConstants.block.headingOne },
      { "block-heading-two": type === TypeConstants.block.headingTwo },
      { "block-heading-three": type === TypeConstants.block.headingThree },
      { "block-last": block.isLast() }
    );

    switch (block.get("type")) {
      case TypeConstants.block.headingOne:
        return (
          <h1
            className={"block-container"}
            data-index={block.get("index")}>
            {this.renderEditable(contentClass)}
          </h1>
        );
      case TypeConstants.block.headingTwo:
        return (
          <h2
            className={"block-container"}
            data-index={block.get("index")}>
            {this.renderEditable(contentClass)}
          </h2>
        );
      case TypeConstants.block.headingThree:
        return (
          <h3
            className={"block-container"}
            data-index={block.get("index")}>
            {this.renderEditable(contentClass)}
          </h3>
        );
    }
  }
}


module.exports = BlockHeading;
