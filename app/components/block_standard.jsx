import ClassNames from "classnames";
import React from "react";

import BlockComponent from "app/templates/block_component";

import EditorStore from "app/stores/editor_store";


class BlockStandard extends BlockComponent {

  // --------------------------------------------------
  // Defaults
  // --------------------------------------------------
  displayName() {
    return "BlockStandard";
  }

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  render() {
    var block = this.props.block;
    var contentClass = ClassNames(
      { "block-content": true },
      { "block-centered": block.get("is_centered") },
      { "block-last": block.isLast() }
    );

    console.log(block.toString());
    return (
      <div
        className={"block-container"}
        data-index={block.get("index")}>
        <p
          className={contentClass}
          contentEditable={this.props.isEditable}
          ref={"content"}>
        </p>
        {this.renderModal()}
      </div>
    );
  }
}


module.exports = BlockStandard;
