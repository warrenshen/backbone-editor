import React from "react";

import BlockExport from "app/templates/block_export";


class BlockList extends BlockExport {

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  renderClass() {
    return "block-list";
  }

  renderTag() {
    return "li";
  }
}


module.exports = BlockList;
