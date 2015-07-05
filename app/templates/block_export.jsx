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
    if (block.get("content") && block.isEditable()) {
      return [
        <p className={"code indented-primary"} key={0}>
          <span className={"code"}>
            {"        "}
          </span>
          {this.renderContent()}
        </p>,
        <p className={"code code-rose"} key={1}>
          {"      </" + this.renderTag() + ">"}
        </p>,
      ];
    }
  }

  renderClass() {
    var block = this.props.block;
    return block.isCentered() ?
           "block-paragraph block-centered" :
           "block-paragraph";
  }

  renderContent() {
    return this.props.block.toCode();
  }

  renderHead() {
    var clause = [
      <span className={"code code-rose"} key={0}>
        {"      <" + this.renderTag()}
      </span>,
      <span className={"code code-green"} key={1}>
        {" class="}
      </span>,
      <span className={"code code-blue"} key={2}>
        {"\"block " + this.renderClass() + "\""}
      </span>,
      <span className={"code code-rose"} key={3}>
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


module.exports = BlockExport;
