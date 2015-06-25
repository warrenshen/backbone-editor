import React from "react";

import Component from "app/templates/component";

import Block from "app/models/block";


class BlockQuote extends Component {

  // --------------------------------------------------
  // Defaults
  // --------------------------------------------------
  displayName() {
    return "BlockQuote";
  }

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  render() {
    return (
      <code>
        <p className={"code"}>
          <span className={"code code-rose"}>
            {"    <blockquote"}
          </span>
          <span className={"code code-green"}>
            {" class="}
          </span>
          <span className={"code code-blue"}>
            {"\"block block-quote\""}
          </span>
          <span className={"code code-rose"}>
            {">"}
          </span>
        </p>
        <p className={"code code-indented"}>
          {"      " + this.props.block.toString()}
        </p>
        <p className={"code code-rose"}>
          {"    </blockquote>"}
        </p>
      </code>
    );
  }
}

BlockQuote.propTypes = {
  block: React.PropTypes.instanceOf(Block).isRequired,
};

BlockQuote.defaultProps = {
  block: new Block(),
};


module.exports = BlockQuote;
