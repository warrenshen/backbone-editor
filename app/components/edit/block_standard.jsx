import ClassNames from "classnames";
import React from "react";

import BlockComponent from "app/templates/block_component";

import ModalMedia from "app/components/edit/modal_media";

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
  renderModal() {
    var block = this.props.block;
    var point = EditorStore.point;
    if (!block.get("content") &&
        point &&
        point.matchesValues(
          block.get("section_index"),
          block.get("index")
        )) {
      return (
        <ModalMedia block={this.props.block} />
      );
    }
  }

  render() {
    var block = this.props.block;
    var contentClass = ClassNames(
      { "block-content": true },
      { "block-centered": block.get("is_centered") },
      { "block-last": block.isLast() }
    );

    return (
      <div className={"block-container"} data-index={block.get("index")}>
        <p className={contentClass} ref={"content"}></p>
        {this.renderModal()}
      </div>
    );
  }
}


module.exports = BlockStandard;
