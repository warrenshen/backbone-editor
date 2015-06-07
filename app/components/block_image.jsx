import ClassNames from "classnames";
import React from "react";
import BlockComponent from "app/templates/block_component";

import EditorActor from "app/actors/editor_actor";

import Point from "app/helpers/point";

import KeyConstants from "app/constants/key_constants";


class BlockImage extends BlockComponent {

  getDefaultState() {
    return {
      shouldShowBorder: false,
      shouldShowPlaceholder: true,
    };
  }

  generatePoint() {
    return new Point(
      this.props.sectionIndex,
      this.props.block.get("index"),
      0
    );
  }

  handleBlurCaption(event) {
    if (!this.props.block.get("content")) {
      this.setState({ shouldShowPlaceholder: true });
    }
  }

  handleBlurImage(event) {
    if (this.state.shouldShowBorder) {
      this.setState({ shouldShowBorder: false });
    }
  }

  handleClick(event) {
    if (!this.state.shouldShowBorder) {
      React.findDOMNode(this.refs.invisible).focus();
    }
  }

  handleFocusCaption(event) {
    if (this.state.shouldShowPlaceholder) {
      this.setState({ shouldShowPlaceholder: false });
    }
  }

  handleFocusImage(event) {
    this.setState({ shouldShowBorder: true });
  }

  handleKeyDown(event) {
    console.log("ho");
    event.preventDefault();
    if (event.which === KeyConstants.backspace) {
      var point = this.generatePoint();
      EditorActor.removeBlock(point);
      this.props.updateStory();
    }
  }

  handleMouseDown(event) {
    event.preventDefault();
  }

  componentDidMount() {
    super.componentDidMount();
    var content = React.findDOMNode(this.refs.content);
    content.addEventListener("blur", this.handleBlurCaption.bind(this));
    content.addEventListener("focus", this.handleFocusCaption.bind(this));

    var image = React.findDOMNode(this.refs.image);
    image.addEventListener("click", this.handleClick.bind(this));
    image.addEventListener("mousedown", this.handleMouseDown.bind(this));

    var invisible = React.findDOMNode(this.refs.invisible);
    invisible.addEventListener("blur", this.handleBlurImage.bind(this));
    invisible.addEventListener("focus", this.handleFocusImage.bind(this));
    invisible.addEventListener("keydown", this.handleKeyDown.bind(this));
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    var content = React.findDOMNode(this.refs.content);
    content.removeEventListener("blur", this.handleBlurCaption);
    content.removeEventListener("focus", this.handleFocusCaption);

    var image = React.findDOMNode(this.refs.image);
    image.removeEventListener("click", this.handleClick);
    image.removeEventListener("mousedown", this.handleMouseDown);

    var invisible = React.findDOMNode(this.refs.invisible);
    invisible.removeEventListener("blur", this.handleBlurImage);
    invisible.removeEventListener("focus", this.handleFocusImage);
    invisible.removeEventListener("keydown", this.handleKeyDown);
  }

  render() {
    var block = this.props.block;
    var captionClass = ClassNames(
      { "block-image-caption": true },
      { "general-placeholder": this.state.shouldShowPlaceholder }
    );
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
        <p
          className={captionClass}
          contentEditable={this.props.shouldEnableEdits}
          placeholder={"Write a caption here..."}
          ref={"content"}>
        </p>
      </div>
    );
  }
}


module.exports = BlockImage;
