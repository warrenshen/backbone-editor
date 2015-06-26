import React from "react";

import BlockExport from "app/templates/block_export";


class BlockQuote extends BlockExport {

  // --------------------------------------------------
  // Defaults
  // --------------------------------------------------
  displayName() {
    return "BlockQuote";
  }

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  renderClass() {
    return "block-quote";
  }

  renderTag() {
    return "blockquote";
  }
}


module.exports = BlockQuote;
