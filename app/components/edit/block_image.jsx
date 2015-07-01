import ClassNames from "classnames";
import React from "react";

import Component from "app/templates/component";

import BlockCaption from "app/components/edit/block_caption";

import Block from "app/models/block";

import EditorActor from "app/actors/editor_actor";

import Point from "app/helpers/point";

import KeyConstants from "app/constants/key_constants";


class BlockImage extends Component {

  // --------------------------------------------------
  // Defaults
  // --------------------------------------------------
  displayName() {
    return "BlockImage";
  }

  // --------------------------------------------------
  // State
  // --------------------------------------------------
  getDefaultState() {
    return { shouldShowOptions: false };
  }

  // --------------------------------------------------
  // Handlers
  // --------------------------------------------------
  handleClick(event) {
    console.log("click");
  }

  handleMouseEnter(event) {
    if (!this.state.shouldShowOptions) {
      this.setState({ shouldShowOptions: true });
    }
  }

  handleMouseLeave(event) {
    if (this.state.shouldShowOptions) {
      this.setState({ shouldShowOptions: false });
    }
  }

  // --------------------------------------------------
  // Lifecycle
  // --------------------------------------------------
  componentDidMount() {
    var node = React.findDOMNode(this.refs.container);
    node.addEventListener("click", this.handleClick.bind(this));
    node.addEventListener("mouseenter", this.handleMouseEnter.bind(this));
    node.addEventListener("mouseleave", this.handleMouseLeave.bind(this));
  }

  componentWillUnmount() {
    var node = React.findDOMNode(this.refs.container);
    node.removeEventListener("click", this.handleClick);
    node.removeEventListener("mouseenter", this.handleMouseEnter);
    node.removeEventListener("mouseleave", this.handleMouseLeave);
  }

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  renderOptions() {
    if (this.state.shouldShowOptions) {
      return (
        <div className={"block-image-overlay"}>
          <span className={"vertical-anchor"}></span>
        </div>
      );
    }
  }

  render() {
    var block = this.props.block;
    var imageClass = ClassNames(
      { "block-image": true },
      { "block-image-placeholder": block.get("source") === "placeholder" }
    );
    return (
      <div
        className={"block-container"}
        contentEditable={"false"}
        data-index={block.get("index")}
        ref={"container"}>
        <div className={"block-image-container"}>
          <img
            className={imageClass}
            src={block.get("source")} />
          {this.renderOptions()}
        </div>
        <BlockCaption {...this.props} />
      </div>
    );
  }
}

BlockImage.propTypes = {
  block: React.PropTypes.instanceOf(Block).isRequired,
  updateStoryStyle: React.PropTypes.func.isRequired,
  updateStoryEditable: React.PropTypes.func.isRequired,
};

BlockImage.defaultProps = {
  block: new Block(),
  updateStoryStyle: null,
  updateStoryEditable: null,
};


module.exports = BlockImage;
