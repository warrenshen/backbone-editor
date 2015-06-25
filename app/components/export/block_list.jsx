import React from "react";

import Component from "app/templates/component";

import Block from "app/models/block";


class BlockList extends Component {

  // --------------------------------------------------
  // Defaults
  // --------------------------------------------------
  displayName() {
    return "BlockList";
  }

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  render() {
    return (
      <code>
        <p className={"code"}>
          <span className={"code code-rose"}>
            {"  <li"}
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
          {"  </li>"}
        </p>
      </code>
    );
  }
}

BlockList.propTypes = {
  block: React.PropTypes.instanceOf(Block).isRequired,
};

BlockList.defaultProps = {
  block: new Block(),
};


module.exports = BlockList;
