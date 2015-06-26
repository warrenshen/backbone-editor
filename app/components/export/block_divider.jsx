import React from "react";

import Component from "app/templates/component";

import Block from "app/models/block";


class BlockDivider extends Component {

  // --------------------------------------------------
  // Defaults
  // --------------------------------------------------
  displayName() {
    return "BlockDivider";
  }

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  render() {
    return (
      <code>
        <p className={"code"}>
          <span className={"code code-rose"}>
            {"    <hr"}
          </span>
          <span className={"code code-green"}>
            {" class="}
          </span>
          <span className={"code code-blue"}>
            {"\"block block-divider\""}
          </span>
          <span className={"code code-rose"}>
            {">"}
          </span>
        </p>
      </code>
    );
  }
}


module.exports = BlockDivider;
