import ClassNames from "classnames";
import React from "react";

import Component from "app/templates/component";

import MediaOption from "app/components/media_option";

import Block from "app/models/block";

import EditorStore from "app/stores/editor_store";

import EditorActor from "app/actors/editor_actor";

import Point from "app/helpers/point";

import TypeConstants from "app/constants/type_constants";


class MediaModal extends Component {

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

  handleClick(event) {
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
  // Actions
  // --------------------------------------------------
  styleCode(event) {
    console.log("Create code!");
  }

  styleDivider(event) {
    var block = new Block({ type: TypeConstants.block.divider });
    var point = this.generatePoint();

    EditorActor.addBlock(block, point);
    this.props.updateStory();
  }

  styleImage(event) {
    React.findDOMNode(this.refs.uploader).click();
    React.findDOMNode(this.refs.invisible).blur();
  }

  // --------------------------------------------------
  // Lifecycle
  // --------------------------------------------------
  componentDidMount() {
    var invisible = React.findDOMNode(this.refs.invisible);
    invisible.addEventListener("blur", this.handleBlur.bind(this));

    var prompt = React.findDOMNode(this.refs.prompt);
    prompt.addEventListener("click", this.handleClick.bind(this));
    prompt.addEventListener("mousedown", this.handleMouseDown.bind(this));

    var uploader = React.findDOMNode(this.refs.uploader);
    uploader.addEventListener("change", this.handleChange.bind(this));
  }

  componentWillUnmount() {
    var invisible = React.findDOMNode(this.refs.invisible);
    invisible.removeEventListener("blur", this.handleBlur);

    var prompt = React.findDOMNode(this.refs.prompt);
    prompt.removeEventListener("click", this.handleClick);
    prompt.removeEventListener("mousedown", this.handleMouseDown);

    var uploader = React.findDOMNode(this.refs.uploader);
    uploader.removeEventListener("change", this.handleChange);
  }

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  renderOption(props, index) {
    return (
      <MediaOption
        key={index}
        active={this.state.shouldShowOptions}
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
      <div className={modalClass}>
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
  block: React.PropTypes.instanceOf(Block).isRequired,
  updateStory: React.PropTypes.func.isRequired,
};

MediaModal.defaultProps = {
  block: new Block(),
  updateStory: null,
};


module.exports = MediaModal;
