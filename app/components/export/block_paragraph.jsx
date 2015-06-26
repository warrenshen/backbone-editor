import React from "react";

import BlockExport from "app/templates/block_export";

import Block from "app/models/block";


class BlockParagraph extends BlockExport {

  // --------------------------------------------------
  // Defaults
  // --------------------------------------------------
  displayName() {
    return "BlockParagraph";
  }
}


module.exports = BlockParagraph;
