import React from "react";

import BlockExport from "app/templates/block_export";

import TypeConstants from "app/constants/type_constants";


class BlockHeading extends BlockExport {

  // --------------------------------------------------
  // Defaults
  // --------------------------------------------------
  displayName() {
    return "BlockHeading";
  }

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  renderClass() {
    switch (this.props.block.get("type")) {
      case TypeConstants.block.headingOne:
        return "block-heading-one";
      case TypeConstants.block.headingTwo:
        return "block-heading-two";
      case TypeConstants.block.headingThree:
        return "block-heading-three";
    }
  }

  renderTag() {
    switch (this.props.block.get("type")) {
      case TypeConstants.block.headingOne:
        return "h1";
      case TypeConstants.block.headingTwo:
        return "h2";
      case TypeConstants.block.headingThree:
        return "h3";
    }
  }
}


module.exports = BlockHeading;
