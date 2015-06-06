import ClassNames from "classnames";
import React from "react";
import Component from "app/templates/component";


class MediaModal extends Component {

  getDefaultState() {
    return { shouldShowOptions: false };
  }

  handleBlur(event) {
    this.setState({ shouldShowOptions: false });
  }

  handleMouseDown(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  handlePromptClick(event) {
    React.findDOMNode(this.refs.invisible).focus();
    this.setState({ shouldShowOptions: !this.state.shouldShowOptions });
  }

  componentDidMount() {
    var prompt = React.findDOMNode(this.refs.prompt);
    prompt.addEventListener("mousedown", this.handleMouseDown.bind(this));
  }

  render() {
    var modalClass = ClassNames(
      { "media-modal": true },
      { "media-modal-open": this.state.shouldShowOptions },
      { "general-hidden": false }
    );
    var optionClass = ClassNames(
      { "media-modal-option": true },
      { "media-modal-option-hidden": !this.state.shouldShowOptions }
    );
    return (
      <div className={modalClass}>
        <p
          className={"general-invisible"}
          contentEditable={"true"}
          onBlur={this.handleBlur.bind(this)}
          ref={"invisible"}>
        </p>
        <span
          className={"media-modal-prompt"}
          onClick={this.handlePromptClick.bind(this)}
          ref={"prompt"}>
          <span className={"vertical-anchor"}></span>
          <i className={"fa fa-plus"}></i>
        </span>
        <span className={optionClass}>
          <span className={"vertical-anchor"}></span>
          <i className={"fa fa-image"}></i>
        </span>
        <span className={optionClass}>
          <span className={"vertical-anchor"}></span>
          <i className={"fa fa-minus"}></i>
        </span>
        <span className={optionClass}>
          <span className={"vertical-anchor"}></span>
          <i className={"fa fa-code"}></i>
        </span>
      </div>
    );
  }
}


module.exports = MediaModal;
