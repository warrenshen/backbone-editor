import React from "react";

import Component from "app/templates/component";


class BlockImage extends Component {

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  renderCaption() {
    return [
      <p className={"code"}>
        <span className={"code code-rose"}>
          {"      <p"}
        </span>
        <span className={"code code-green"}>
          {" class="}
        </span>
        <span className={"code code-blue"}>
          {"\"block block-caption\""}
        </span>
        <span className={"code code-rose"}>
          {">"}
        </span>
      </p>,
      <p className={"code indented-secondary"}>
        {"        " + this.props.block.get("content")}
      </p>,
      <p className={"code code-rose"}>
        {"      </p>"}
      </p>,
    ];
  }

  renderImage() {
    return (
      <p className={"code"}>
        <span className={"code code-rose"}>
          {"      <image"}
        </span>
        <span className={"code code-green"}>
          {" class="}
        </span>
        <span className={"code code-blue"}>
          {"\"block block-image\""}
        </span>
        <span className={"code code-green"}>
          {" src="}
        </span>
        <span className={"code code-blue"}>
          {"\"insert image source\""}
        </span>
        <span className={"code code-rose"}>
          {">"}
        </span>
      </p>
    );
  }

  render() {
    return (
      <code>
        <p className={"code"}>
          <span className={"code code-rose"}>
            {"    <div"}
          </span>
          <span className={"code code-green"}>
            {" class="}
          </span>
          <span className={"code code-blue"}>
            {"\"container\""}
          </span>
          <span className={"code code-rose"}>
            {">"}
          </span>
        </p>
        {this.renderImage()}
        {this.renderCaption()}
        <p className={"code code-rose"}>
          {"    </div>"}
        </p>
      </code>
    );
  }
}


module.exports = BlockImage;
