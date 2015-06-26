import React from "react";

import BlockExport from "app/templates/block_export";

import Block from "app/models/block";


class BlockDivider extends BlockExport {

  // --------------------------------------------------
  // Defaults
  // --------------------------------------------------
  displayName() {
    return "BlockDivider";
  }

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  renderClass() {
    return "block-divider";
  }

  renderTag() {
    return "hr";
  }
}


module.exports = BlockDivider;
