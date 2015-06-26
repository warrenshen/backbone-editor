import React from "react";

import Component from "app/templates/component";


class BlockImage extends Component {

  // --------------------------------------------------
  // Defaults
  // --------------------------------------------------
  displayName() {
    return "BlockImage";
  }

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  render() {
    return (
      <code>
        <p className={"code"}>
          <span className={"code code-rose"}>
            {"    <img"}
          </span>
          <span className={"code code-green"}>
            {" class="}
          </span>
          <span className={"code code-blue"}>
            {"\"block block-image\""}
          </span>
          <span className={"code code-rose"}>
            {">"}
          </span>
        </p>
      </code>
    );
  }
}


module.exports = BlockImage;
