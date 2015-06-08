import ClassNames from "classnames";
import React from "react";
import Component from "app/templates/component";

import Block from "app/models/block";

import EditorStore from "app/stores/editor_store";

import EditorActor from "app/actors/editor_actor";

import Point from "app/helpers/point";

import TypeConstants from "app/constants/type_constants";


class MediaModal extends Component {

  // --------------------------------------------------
  // State
  // --------------------------------------------------
  get defaultState() {
    return { shouldShowOptions: false };
  }

  // --------------------------------------------------
  // Helpers
  // --------------------------------------------------
  generatePoint() {
    return new Point(
      this.props.sectionIndex,
      this.props.blockIndex,
      0
    );
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
      var callback = this.props.updateStory;
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

  handleClickCode(event) {
    console.log("Create code!");
  }

  handleClickDivider(event) {
    var block = new Block({ type: TypeConstants.block.divider });
    var point = this.generatePoint();
    EditorActor.addBlock(block, point);
    this.props.updateStory();
  }

  handleClickImage(event) {
    React.findDOMNode(this.refs.uploader).click();
    React.findDOMNode(this.refs.invisible).blur();
  }

  handleClickPrompt(event) {
    React.findDOMNode(this.refs.invisible).focus();
    if (!this.state.shouldShowOptions) {
      this.setState({ shouldShowOptions: true });
    } else {
      this.setState({ shouldShowOptions: false });
      this.props.updateStory();
    }
  }

  handleMouseDown(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  // --------------------------------------------------
  // Lifecycle
  // --------------------------------------------------
  componentDidMount() {
    var code = React.findDOMNode(this.refs.code);
    code.addEventListener("click", this.handleClickCode.bind(this));
    code.addEventListener("mousedown", this.handleMouseDown.bind(this));

    var divider = React.findDOMNode(this.refs.divider);
    divider.addEventListener("click", this.handleClickDivider.bind(this));
    divider.addEventListener("mousedown", this.handleMouseDown.bind(this));

    var image = React.findDOMNode(this.refs.image);
    image.addEventListener("click", this.handleClickImage.bind(this));
    image.addEventListener("mousedown", this.handleMouseDown.bind(this));

    var invisible = React.findDOMNode(this.refs.invisible);
    invisible.addEventListener("blur", this.handleBlur.bind(this));

    var prompt = React.findDOMNode(this.refs.prompt);
    prompt.addEventListener("click", this.handleClickPrompt.bind(this));
    prompt.addEventListener("mousedown", this.handleMouseDown.bind(this));

    var uploader = React.findDOMNode(this.refs.uploader);
    uploader.addEventListener("change", this.handleChange.bind(this));
  }

  componentWillUnmount() {
    var code = React.findDOMNode(this.refs.code);
    code.removeEventListener("click", this.handleClickCode);
    code.removeEventListener("mousedown", this.handleMouseDown);

    var divider = React.findDOMNode(this.refs.divider);
    divider.removeEventListener("click", this.handleClickDivider);
    divider.removeEventListener("mousedown", this.handleMouseDown);

    var image = React.findDOMNode(this.refs.image);
    image.removeEventListener("click", this.handleClickImage);
    image.removeEventListener("mousedown", this.handleMouseDown);

    var invisible = React.findDOMNode(this.refs.invisible);
    invisible.removeEventListener("blur", this.handleBlur);

    var prompt = React.findDOMNode(this.refs.prompt);
    prompt.removeEventListener("click", this.handleClickPrompt);
    prompt.removeEventListener("mousedown", this.handleMouseDown);

    var uploader = React.findDOMNode(this.refs.uploader);
    uploader.removeEventListener("change", this.handleChange);
  }

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
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
    var optionClass = ClassNames(
      { "media-modal-option": true },
      { "media-modal-option-hidden": !this.state.shouldShowOptions }
    );
    return (
      <div className={modalClass}>
        <span className={promptClass} ref={"prompt"}>
          <span className={"vertical-anchor"}></span>
          <i className={"fa fa-plus"}></i>
        </span>
        <span className={optionClass} ref={"image"}>
          <span className={"vertical-anchor"}></span>
          <i className={"fa fa-image"}></i>
        </span>
        <span className={optionClass} ref={"divider"}>
          <span className={"vertical-anchor"}></span>
          <i className={"fa fa-minus"}></i>
        </span>
        <span className={optionClass} ref={"code"}>
          <span className={"vertical-anchor"}></span>
          <i className={"fa fa-code"}></i>
        </span>
        <input
          className={"general-invisible"}
          ref={"uploader"}
          type={"file"}
          accept={"image/*"}>
        </input>
        <p
          className={"general-invisible"}
          contentEditable={"true"}
          ref={"invisible"}>
        </p>
      </div>
    );
  }
}

MediaModal.propTypes = {
  blockIndex: React.PropTypes.number.isRequired,
  sectionIndex: React.PropTypes.number.isRequired,
  updateStory: React.PropTypes.func,
};

MediaModal.defaultProps = {
  blockIndex: 0,
  sectionIndex: 0,
};


module.exports = MediaModal;
