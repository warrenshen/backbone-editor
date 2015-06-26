import React from "react";

import Component from "app/templates/component";

import Block from "app/models/block";


class BlockExport extends Component {

  // --------------------------------------------------
  // Defaults
  // --------------------------------------------------
  displayName() {
    return "BlockExport";
  }

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  renderBody() {
    if (this.props.block.isEditable()) {
      return [
        <p className={"code code-indented"}>
          {"      " + this.props.block.toString()}
        </p>,
        <p className={"code code-rose"}>
          {"    </" + this.renderTag() + ">"}
        </p>,
      ];
    }
  }

  renderClass() {
    return "block-paragraph";
  }

  renderHead() {
    return (
      <p className={"code"}>
        <span className={"code code-rose"}>
          {"    <" + this.renderTag()}
        </span>
        <span className={"code code-green"}>
          {" class="}
        </span>
        <span className={"code code-blue"}>
          {"\"block " + this.renderClass() + "\""}
        </span>
        <span className={"code code-rose"}>
          {">"}
        </span>
      </p>
    );
  }

  renderTag() {
    return "p";
  }

  render() {
    return (
      <code>
        {this.renderHead()}
        {this.renderBody()}
      </code>
    );
  }
}

BlockExport.propTypes = {
  block: React.PropTypes.instanceOf(Block).isRequired,
};

BlockExport.defaultProps = {
  block: new Block(),
};


module.exports = BlockExport;
