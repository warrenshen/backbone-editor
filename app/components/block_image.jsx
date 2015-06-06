import React from "react";
import Component from "app/templates/component";


class BlockImage extends Component {

  render() {
    var block = this.props.block;
    return (
      <div className={"block-container"}>
        <div className={"block-frame"}>
          <img className={"block-image"} src={block.get("source")} />
          <p
            className={"general-invisible"}
            contentEditable={"true"}
            ref={"invisible"}>
          </p>
        </div>
      </div>
    );
  }
}


module.exports = BlockImage;
