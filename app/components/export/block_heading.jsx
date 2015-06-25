import React from "react";

import Component from "app/templates/component";

import Block from "app/models/block";

import TypeConstants from "app/constants/type_constants";


class BlockHeading extends Component {

  // --------------------------------------------------
  // Defaults
  // --------------------------------------------------
  displayName() {
    return "BlockHeading";
  }

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  renderClass() {
    switch (this.props.block.get("type")) {
      case TypeConstants.block.headingOne:
        return "block-heading-one";
      case TypeConstants.block.headingTwo:
        return "block-heading-two";
      case TypeConstants.block.headingThree:
        return "block-heading-three";
    }
  }

  renderTag() {
    switch (this.props.block.get("type")) {
      case TypeConstants.block.headingOne:
        return "h1";
      case TypeConstants.block.headingTwo:
        return "h2";
      case TypeConstants.block.headingThree:
        return "h3";
    }
  }

  render() {
    return (
      <div>
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
        <p className={"code code-indented"}>
          {"      " + this.props.block.toString()}
        </p>
        <p className={"code code-rose"}>
          {"    </" + this.renderTag() + ">"}
        </p>
      </div>
    );
  }
}


BlockHeading.propTypes = {
  block: React.PropTypes.instanceOf(Block).isRequired,
};

BlockHeading.defaultProps = {
  block: new Block(),
};


module.exports = BlockHeading;
