import React from "react";
import Component from "app/templates/component";

import Block from "app/models/block";

import Formatter from "app/helpers/formatter";


class BlockComponent extends Component {

  render() {
    return (
      <div className={"block-container"}>
        <p
          className={"block-content"}
          contentEditable={true}
          ref={"content"}>
          {Formatter.format(this.props.block.get("content"))}
        </p>
      </div>
    );
  }
}

BlockComponent.propTypes = {
  block: React.PropTypes.object.isRequired,
}

BlockComponent.defaultProps = {
  block: new Block(),
}


module.exports = BlockComponent;
