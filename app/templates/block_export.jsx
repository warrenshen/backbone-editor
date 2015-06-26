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
    var block = this.props.block;
    if (block.get("content") && block.isEditable()) {
      return [
        <p className={"code code-indented"} key={0}>
          {"      " + this.props.block.toString()}
        </p>,
        <p className={"code code-rose"} key={1}>
          {"    </" + this.renderTag() + ">"}
        </p>,
      ];
    }
  }

  renderClass() {
    return "block-paragraph";
  }

  renderHead() {
    var clause = [
      <span className={"code code-rose"}>
        {"    <" + this.renderTag()}
      </span>,
      <span className={"code code-green"}>
        {" class="}
      </span>,
      <span className={"code code-blue"}>
        {"\"block " + this.renderClass() + "\""}
      </span>,
      <span className={"code code-rose"}>
        {">"}
      </span>,
    ];
    if (this.props.block.get("content")) {
      return (
        <p className={"code"}>
          {clause}
        </p>
      );
    } else {
      return (
        <p className={"code"}>
          {clause}
          <span className={"code code-rose"}>
            {"</" + this.renderTag() + ">"}
          </span>
        </p>
      );
    }
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
