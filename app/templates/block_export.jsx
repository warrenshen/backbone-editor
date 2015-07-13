import React from "react";

import Component from "app/templates/component";

import Block from "app/models/block";


class BlockExport extends Component {

  // --------------------------------------------------
  // Getters
  // --------------------------------------------------
  static get propTypes() {
    return {
      block: React.PropTypes.instanceOf(Block).isRequired,
    };
  }

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  renderBody() {
    var block = this.props.block;
    if (block.length && block.isEditable()) {
      return [
        <p className={"code indented-primary"} key={0}>
          <span className={"code"}>
            {"        "}
          </span>
          {this.renderContent()}
        </p>,
        <p className={"code code-red"} key={1}>
          {"      </" + this.renderTag() + ">"}
        </p>,
      ];
    }
  }

  renderClass() {
    return this.props.block.isCentered() ? " block-centered" : "";
  }

  renderContent() {
    return this.props.block.toCode();
  }

  renderHead() {
    var clause = [
      <span className={"code code-red"} key={0}>
        {"      <" + this.renderTag()}
      </span>,
      <span className={"code code-green"} key={1}>
        {" class="}
      </span>,
      <span className={"code code-blue"} key={2}>
        {"\"block" + this.renderClass() + "\""}
      </span>,
      <span className={"code code-red"} key={3}>
        {">"}
      </span>,
    ];
    if (this.props.block.length) {
      return (
        <p className={"code"}>
          {clause}
        </p>
      );
    } else {
      return (
        <p className={"code"}>
          {clause}
          <span className={"code code-red"}>
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


module.exports = BlockExport;
