import ClassNames from "classnames";
import React from "react";

import Component from "app/templates/component";

import OptionMedia from "app/components/edit/option_media";

import Block from "app/models/block";

import EditorActor from "app/actors/editor_actor";

import Point from "app/helpers/point";

import TypeConstants from "app/constants/type_constants";


class ModalMedia extends Component {

  // --------------------------------------------------
  // Getters
  // --------------------------------------------------
  static get propTypes() {
    return {
      block: React.PropTypes.instanceOf(Block).isRequired,
      updateStoryEdit: React.PropTypes.func.isRequired,
    };
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
    return new Point(block.get("section_index"), block.get("index"));
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
      var reader = new FileReader();
      reader.onloadend = function(file) {
        var point = this.generatePoint();
        EditorActor.changeBlock(
          point,
          { source: file.target.result, type: TypeConstants.block.image }
        );
        this.props.updateStoryEdit();
      }.bind(this);
      reader.readAsDataURL(files[0]);
    }
  }

  handleClick(event) {
    if (!this.state.shouldShowOptions) {
      React.findDOMNode(this.refs.input).focus();
      this.setState({ shouldShowOptions: true });
    } else {
      this.setState({ shouldShowOptions: false });
    }
  }

  handleMouseDown(event) {
    event.preventDefault();
  }

  // --------------------------------------------------
  // Actions
  // --------------------------------------------------
  styleDivider(event) {
    var point = this.generatePoint();
    EditorActor.changeBlock(point, { type: TypeConstants.block.divider });
    React.findDOMNode(this.refs.input).blur();
    this.props.updateStoryEdit();
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
    node = React.findDOMNode(this.refs.modal);
    node.addEventListener("mousedown", this.handleMouseDown.bind(this));
    node = React.findDOMNode(this.refs.uploader);
    node.addEventListener("change", this.handleChange.bind(this));
  }

  componentWillUnmount() {
    var node = React.findDOMNode(this.refs.input);
    node.removeEventListener("blur", this.handleBlur);
    node = React.findDOMNode(this.refs.prompt);
    node.removeEventListener("click", this.handleClick);
    node = React.findDOMNode(this.refs.modal);
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
        isActive={this.state.shouldShowOptions}
        key={index}
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
    ].map(this.renderOption, this);
  }

  render() {
    var modalClass = ClassNames(
      { "modal-media": true },
      { "modal-media-open": this.state.shouldShowOptions }
    );
    var promptClass = ClassNames(
      { "modal-media-prompt": true },
      { "modal-media-rotated": this.state.shouldShowOptions }
    );
    return (
      <div
        className={modalClass}
        contentEditable={"false"}
        ref={"modal"}>
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


module.exports = ModalMedia;
