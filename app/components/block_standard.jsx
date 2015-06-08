import ClassNames from "classnames";
import React from "react";
import BlockComponent from "app/templates/block_component";


class BlockStandard extends BlockComponent {

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  render() {
    var block = this.props.block;
    var contentClass = ClassNames(
      { "block-content": true },
      { "block-centered": block.get("centered") }
    );
    return (
      <div
        className={"block-container"}
        data-index={block.get("index")}>
        <p
          className={contentClass}
          contentEditable={this.props.shouldEnableEdits}
          ref={"content"}>
        </p>
        {this.renderModal()}
      </div>
    );
  }
}


module.exports = BlockStandard;
