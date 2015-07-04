import ClassNames from "classnames";
import React from "react";

import Component from "app/templates/component";

import BlockCaption from "app/components/edit/block_caption";
import OptionImage from "app/components/edit/option_image";

import Block from "app/models/block";

import EditorActor from "app/actors/editor_actor";

import Point from "app/helpers/point";

import KeyConstants from "app/constants/key_constants";


class BlockImage extends Component {

  // --------------------------------------------------
  // Getters
  // --------------------------------------------------
  static get propTypes() {
    return {
      block: React.PropTypes.instanceOf(Block).isRequired,
      updateStoryStyle: React.PropTypes.func.isRequired,
      updateStoryEditable: React.PropTypes.func.isRequired,
    };
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
  handleChange(event) {
    var files = event.target.files;
    if (files && files[0]) {
      var reader = new FileReader();
      reader.onloadend = function(file) {
        var source = file.target.result;
        this.props.block.set("source", source);
        this.props.updateStoryEditable();
        EditorActor.resetCookies();
      }.bind(this);
      reader.readAsDataURL(files[0]);
    }
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

  handleRemove(event) {
    var block = this.props.block;
    var point = new Point(
      block.get("section_index"),
      block.get("index"),
      0
    );
    EditorActor.removeBlock(point);
    this.props.updateStoryEditable();
  }

  handleUpload(event) {
    React.findDOMNode(this.refs.uploader).click();
  }

  // --------------------------------------------------
  // Lifecycle
  // --------------------------------------------------
  componentDidMount() {
    var node = React.findDOMNode(this.refs.container);
    node.addEventListener("mouseenter", this.handleMouseEnter.bind(this));
    node.addEventListener("mouseleave", this.handleMouseLeave.bind(this));
    node = React.findDOMNode(this.refs.uploader);
  }

  componentDidUpdate() {
    var node = React.findDOMNode(this.refs.uploader);
    if (node) {
      node.addEventListener("change", this.handleChange.bind(this));
    }
  }

  componentWillUnmount() {
    var node = React.findDOMNode(this.refs.container);
    node.removeEventListener("mouseenter", this.handleMouseEnter);
    node.removeEventListener("mouseleave", this.handleMouseLeave);
    node = React.findDOMNode(this.refs.uploader);
    if (node) {
      node.removeEventListener("change", this.handleChange);
    }
  }

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  renderOption(props, index) {
    return (
      <OptionImage
        key={index}
        {...props} />
    );
  }

  renderOptions() {
    return [
      {
        action: this.handleUpload.bind(this),
        className: "fa fa-image",
      },
      {
        action: this.handleRemove.bind(this),
        className: "fa fa-close",
      },
    ].map(this.renderOption, this);
  }

  renderOverlay() {
    if (this.state.shouldShowOptions) {
      return (
        <div className={"block-image-overlay"}>
          <span className={"vertical-anchor"}></span>
          {this.renderOptions()}
          <input
            className={"general-invisible"}
            ref={"uploader"}
            type={"file"}
            accept={"image/*"}>
          </input>
        </div>
      );
    }
  }

  render() {
    var block = this.props.block;
    var imageClass = ClassNames(
      { "block-image": true },
      { "block-image-placeholder": !block.get("source") }
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
          {this.renderOverlay()}
        </div>
        <BlockCaption {...this.props} />
      </div>
    );
  }
}


module.exports = BlockImage;
