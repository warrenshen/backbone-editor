import ClassNames from "classnames";
import React from "react";

import Component from "app/templates/component";

import OptionMedia from "app/components/edit/option_media";

import Block from "app/models/block";

import EditorStore from "app/stores/editor_store";

import EditorActor from "app/actors/editor_actor";

import Point from "app/helpers/point";

import TypeConstants from "app/constants/type_constants";


class ModalMedia extends Component {

  // --------------------------------------------------
  // Defaults
  // --------------------------------------------------
  displayName() {
    return "ModalMedia";
  }

  // --------------------------------------------------
  // State
  // --------------------------------------------------
  getDefaultState() {
    return { shouldShowOptions: false };
  }

  // --------------------------------------------------
  // Helpers
  // --------------------------------------------------
  generatePoint() {
    var block = this.props.block;

    return new Point(block.get("section_index"), block.get("index"), 0);
  }

  // --------------------------------------------------
  // Handlers
  // --------------------------------------------------
  handleBlur(event) {
    this.setState({ shouldShowOptions: false });
  }

  handleChange(event) {
    var files = event.target.files;

    if (files && files[0]) {
      var block = new Block({ type: TypeConstants.block.image });
      var callback = this.props.updateStoryEditable;
      var point = this.generatePoint();

      var reader = new FileReader();
      reader.onloadend = function(file) {
        var source = file.target.result;
        block.set("source", source);
        EditorActor.addBlock(block, point);
        callback();
      };

      reader.readAsDataURL(files[0]);
    }
  }

  handleClick(event) {
    React.findDOMNode(this.refs.input).focus();

    if (!this.state.shouldShowOptions) {
      this.setState({ shouldShowOptions: true });
    } else {
      this.setState({ shouldShowOptions: false });
      this.props.updateStoryEditable();
    }
  }

  handleMouseDown(event) {
    event.preventDefault();
  }

  handleMouseUp(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  // --------------------------------------------------
  // Actions
  // --------------------------------------------------
  styleCode(event) {
    console.log("Create code!");
  }

  styleDivider(event) {
    var block = new Block({ type: TypeConstants.block.divider });
    var point = this.generatePoint();

    EditorActor.addBlock(block, point);
    this.props.updateStoryEditable();
  }

  styleImage(event) {
    React.findDOMNode(this.refs.uploader).click();
    React.findDOMNode(this.refs.input).blur();
  }

  // --------------------------------------------------
  // Lifecycle
  // --------------------------------------------------
  componentDidMount() {
    var node = React.findDOMNode(this.refs.input);
    node.addEventListener("blur", this.handleBlur.bind(this));

    node = React.findDOMNode(this.refs.prompt);
    node.addEventListener("click", this.handleClick.bind(this));
    node.addEventListener("mouseup", this.handleMouseUp.bind(this));
    node.addEventListener("mousedown", this.handleMouseDown.bind(this));

    node = React.findDOMNode(this.refs.uploader);
    node.addEventListener("change", this.handleChange.bind(this));
  }

  componentWillUnmount() {
    var node = React.findDOMNode(this.refs.input);
    node.removeEventListener("blur", this.handleBlur);

    node = React.findDOMNode(this.refs.prompt);
    node.removeEventListener("click", this.handleClick);
    node.removeEventListener("mouseup", this.handleMouseUp);
    node.removeEventListener("mousedown", this.handleMouseDown);

    node = React.findDOMNode(this.refs.uploader);
    node.removeEventListener("change", this.handleChange);
  }

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  renderOption(props, index) {
    return (
      <OptionMedia
        key={index}
        isActive={this.state.shouldShowOptions}
        {...props} />
    );
  }

  renderOptions() {
    return [
      {
        action: this.styleImage.bind(this),
        className: "fa fa-image",
      },
      {
        action: this.styleDivider.bind(this),
        className: "fa fa-minus",
      },
      {
        action: this.styleCode.bind(this),
        className: "fa fa-code",
      },
    ].map(this.renderOption, this);
  }

  render() {
    var modalClass = ClassNames(
      { "media-modal": true },
      { "media-modal-open": this.state.shouldShowOptions },
      { "general-hidden": false }
    );
    var promptClass = ClassNames(
      { "media-modal-prompt": true },
      { "media-modal-prompt-open": this.state.shouldShowOptions }
    );

    return (
      <div
        className={modalClass}
        contentEditable={"false"}>
        <span className={promptClass} ref={"prompt"}>
          <span className={"vertical-anchor"}></span>
          <i className={"fa fa-plus"}></i>
        </span>
        {this.renderOptions()}
        <input
          className={"general-invisible"}
          ref={"uploader"}
          type={"file"}
          accept={"image/*"}>
        </input>
        <input
          className={"general-invisible"}
          ref={"input"}>
        </input>
      </div>
    );
  }
}

ModalMedia.propTypes = {
  block: React.PropTypes.instanceOf(Block).isRequired,
  updateStoryEditable: React.PropTypes.func.isRequired,
};

ModalMedia.defaultProps = {
  block: new Block(),
  updateStoryEditable: null,
};


module.exports = ModalMedia;
