import React from "react";

import Component from "app/templates/component";

import Block from "app/models/block";


class BlockParagraph extends Component {

  // --------------------------------------------------
  // Defaults
  // --------------------------------------------------
  displayName() {
    return "BlockParagraph";
  }

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  render() {
    return (
      <code>
        <p className={"code"}>
          <span className={"code code-rose"}>
            {"  <p"}
          </span>
          <span className={"code code-green"}>
            {" class="}
          </span>
          <span className={"code code-blue"}>
            {"\"block block-paragraph\""}
          </span>
          <span className={"code code-rose"}>
            {">"}
          </span>
        </p>
        <p className={"code code-indented"}>
          {"    " + this.props.block.toString()}
        </p>
        <p className={"code code-rose"}>
          {"  </p>"}
        </p>
      </code>
    );
  }
}

BlockParagraph.propTypes = {
  block: React.PropTypes.instanceOf(Block).isRequired,
};

BlockParagraph.defaultProps = {
  block: new Block(),
};


module.exports = BlockParagraph;
