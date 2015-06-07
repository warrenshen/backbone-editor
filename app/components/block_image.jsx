import React from "react";
import BlockComponent from "app/templates/block_component";


class BlockImage extends BlockComponent {

  render() {
    var block = this.props.block;
    return (
      <div
        className={"block-container"}
        data-index={block.get("index")}>
        <div className={"block-image-container"}>
          <img className={"block-image"} src={block.get("source")} />
          <p
            className={"general-invisible"}
            contentEditable={"true"}
            ref={"invisible"}>
          </p>
        </div>
        <p
          className={"block-image-caption"}
          contentEditable={this.props.shouldEnableEdits}
          ref={"content"}>
        </p>
      </div>
    );
  }
}


module.exports = BlockImage;
