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
      var block = this.props.block;
      var point = new Point(block.get("section_index"), block.get("index"), 0);

      EditorActor.removeBlock(point);
      this.props.updateStoryEditable();
    }
  }

  handleMouseDown(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  handleMouseUp(event) {
    event.stopPropagation();
  }

  // --------------------------------------------------
  // Lifecycle
  // --------------------------------------------------
  componentDidMount() {
    var image = React.findDOMNode(this.refs.image);
    image.addEventListener("click", this.handleClick.bind(this));
    image.addEventListener("mousedown", this.handleMouseDown.bind(this));
    image.addEventListener("mouseup", this.handleMouseUp.bind(this));

    var invisible = React.findDOMNode(this.refs.invisible);
    invisible.addEventListener("blur", this.handleBlur.bind(this));
    invisible.addEventListener("focus", this.handleFocus.bind(this));
    invisible.addEventListener("keydown", this.handleKeyDown.bind(this));
  }

  componentWillUnmount() {
    var image = React.findDOMNode(this.refs.image);
    image.removeEventListener("click", this.handleClick);
    image.removeEventListener("mousedown", this.handleMouseDown);
    image.removeEventListener("mouseup", this.handleMouseUp);

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
          isEditable={this.props.isEditable}
          updateStoryEditable={this.props.updateStoryEditable} />
      </div>
    );
  }
}

BlockImage.propTypes = {
  block: React.PropTypes.instanceOf(Block).isRequired,
  isEditable: React.PropTypes.bool.isRequired,
  updateStoryEditable: React.PropTypes.func.isRequired,
};

BlockImage.defaultProps = {
  block: new Block(),
  isEditable: true,
  updateStoryEditable: null,
};


module.exports = BlockImage;
