import ClassNames from "classnames";
import React from "react";
import Component from "app/templates/component";

import BlockCaption from "app/components/block_caption";

import Block from "app/models/block";

import EditorActor from "app/actors/editor_actor";

import Point from "app/helpers/point";

import KeyConstants from "app/constants/key_constants";


class BlockImage extends Component {

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
    if (this.state.shouldShowBorder) {
      this.setState({ shouldShowBorder: false });
    }
  }

  handleClick(event) {
    if (!this.state.shouldShowBorder) {
      React.findDOMNode(this.refs.invisible).focus();
    }
  }

  handleFocus(event) {
    this.setState({ shouldShowBorder: true });
  }

  handleKeyDown(event) {
    event.preventDefault();
    if (event.which === KeyConstants.backspace) {
      var point = new Point(
        this.props.sectionIndex,
        this.props.block.get("index"),
        0
      );
      EditorActor.removeBlock(point);
      this.props.updateStory();
    }
  }

  handleMouseDown(event) {
    event.preventDefault();
  }

  // --------------------------------------------------
  // Lifecycle
  // --------------------------------------------------
  componentDidMount() {
    var image = React.findDOMNode(this.refs.image);
    image.addEventListener("click", this.handleClick.bind(this));
    image.addEventListener("mousedown", this.handleMouseDown.bind(this));

    var invisible = React.findDOMNode(this.refs.invisible);
    invisible.addEventListener("blur", this.handleBlur.bind(this));
    invisible.addEventListener("focus", this.handleFocus.bind(this));
    invisible.addEventListener("keydown", this.handleKeyDown.bind(this));
  }

  componentWillUnmount() {
    var image = React.findDOMNode(this.refs.image);
    image.removeEventListener("click", this.handleClick);
    image.removeEventListener("mousedown", this.handleMouseDown);

    var invisible = React.findDOMNode(this.refs.invisible);
    invisible.removeEventListener("blur", this.handleBlurImage);
    invisible.removeEventListener("focus", this.handleFocusImage);
    invisible.removeEventListener("keydown", this.handleKeyDown);
  }

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  render() {
    var block = this.props.block;
    var imageClass = ClassNames(
      { "block-image": true },
      { "block-image-bordered": this.state.shouldShowBorder }
    );
    return (
      <div
        className={"block-container"}
        data-index={block.get("index")}>
        <div className={"block-image-container"}>
          <img
            className={imageClass}
            ref={"image"}
            src={block.get("source")} />
          <p
            className={"general-invisible"}
            contentEditable={"true"}
            ref={"invisible"}>
          </p>
        </div>
        <BlockCaption
          block={this.props.block}
          sectionIndex={this.props.sectionIndex}
          shouldEnableEdits={this.props.shouldEnableEdits}
          updateStory={this.props.updateStory} />
      </div>
    );
  }
}

BlockImage.propTypes = {
  block: React.PropTypes.instanceOf(Block).isRequired,
  sectionIndex: React.PropTypes.number.isRequired,
  shouldEnableEdits: React.PropTypes.bool.isRequired,
  updateStory: React.PropTypes.func,
};

BlockImage.defaultProps = {
  block: new Block(),
  sectionIndex: 0,
  shouldEnableEdits: true,
};


module.exports = BlockImage;
