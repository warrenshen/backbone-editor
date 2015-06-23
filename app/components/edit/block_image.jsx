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
    return { shouldShowBorder: false };
  }

  // --------------------------------------------------
  // Handlers
  // --------------------------------------------------
  handleBlur(event) {
    var node = React.findDOMNode(this.refs.input);
    if (node && this.state.shouldShowBorder) {
      this.setState({ shouldShowBorder: false });
    }
  }

  handleClick(event) {
    if (!this.state.shouldShowBorder) {
      React.findDOMNode(this.refs.input).focus();
    }
  }

  handleFocus(event) {
    this.setState({ shouldShowBorder: true });
  }

  handleKeyDown(event) {
    event.preventDefault();
    if (event.which === KeyConstants.backspace) {
      var block = this.props.block;
      var point = new Point(
        block.get("section_index"),
        block.get("index"),
        0
      );
      EditorActor.removeBlock(point);
      this.props.updateStoryEditable();
    }
  }

  handleMouseDown(event) {
    event.preventDefault();
  }

  handleMouseUp(event) {
    event.stopPropagation();
  }

  // --------------------------------------------------
  // Lifecycle
  // --------------------------------------------------
  componentDidMount() {
    var node = React.findDOMNode(this.refs.image);
    node.addEventListener("click", this.handleClick.bind(this));
    node.addEventListener("mousedown", this.handleMouseDown.bind(this));
    node.addEventListener("mouseup", this.handleMouseUp.bind(this));
    node = React.findDOMNode(this.refs.input);
    node.addEventListener("blur", this.handleBlur.bind(this));
    node.addEventListener("focus", this.handleFocus.bind(this));
    node.addEventListener("keydown", this.handleKeyDown.bind(this));
  }

  componentWillUnmount() {
    var node = React.findDOMNode(this.refs.image);
    node.removeEventListener("click", this.handleClick);
    node.removeEventListener("mousedown", this.handleMouseDown);
    node.removeEventListener("mouseup", this.handleMouseUp);
    node = React.findDOMNode(this.refs.input);
    node.removeEventListener("blur", this.handleBlur);
    node.removeEventListener("focus", this.handleFocus);
    node.removeEventListener("keydown", this.handleKeyDown);
  }

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  renderImage() {
    var imageClass = ClassNames(
      { "block-image": true },
      { "block-image-bordered": this.state.shouldShowBorder }
    );
    return (
      <div className={"block-image-container"}>
        <img
          className={imageClass}
          ref={"image"}
          src={this.props.block.get("source")} />
        <input
          className={"general-invisible"}
          ref={"input"}>
        </input>
      </div>
    );
  }

  render() {
    return (
      <div
        className={"block-container"}
        contentEditable={"false"}
        data-index={this.props.block.get("index")}>
        {this.renderImage()}
        <BlockCaption {...this.props} />
      </div>
    );
  }
}

BlockImage.propTypes = {
  block: React.PropTypes.instanceOf(Block).isRequired,
  updateStoryEditable: React.PropTypes.func.isRequired,
};

BlockImage.defaultProps = {
  block: new Block(),
  updateStoryEditable: null,
};


module.exports = BlockImage;
