import ClassNames from "classnames";
import React from "react";
import BlockComponent from "app/templates/block_component";

import Block from "app/models/block";

import TypeConstants from "app/constants/type_constants";


class BlockHeading extends BlockComponent {

  renderEditable() {
    var type = this.props.block.get("type");
    var contentClass = ClassNames(
      { "block-content": true },
      { "block-heading-one": type === TypeConstants.block.headingOne },
      { "block-heading-two": type === TypeConstants.block.headingTwo },
      { "block-heading-three": type === TypeConstants.block.headingThree }
    );
    return (
      <p
        className={contentClass}
        contentEditable={this.props.shouldEnableEdits}
        ref={"content"}>
      </p>
    );
  }

  render() {
    var block = this.props.block;
    switch (block.get("type")) {
      case TypeConstants.block.headingOne:
        return (
          <h1
            className={"block-container"}
            data-index={block.get("index")}>
            {this.renderEditable()}
          </h1>
        );
    };
  }
}


module.exports = BlockHeading;
