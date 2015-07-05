import React from "react";

import BlockExport from "app/templates/block_export";

import TypeConstants from "app/constants/type_constants";


class BlockHeading extends BlockExport {

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  renderClass() {
    var block = this.props.block;
    var centered = block.isCentered() ? " block-centered" : "";
    switch (this.props.block.get("type")) {
      case TypeConstants.block.headingOne:
        return "block-heading-one" + centered;
      case TypeConstants.block.headingTwo:
        return "block-heading-two" + centered;
      case TypeConstants.block.headingThree:
        return "block-heading-three" + centered;
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
