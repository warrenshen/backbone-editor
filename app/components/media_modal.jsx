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

  handleClickCode(event) {

  }

  handleClickDivider(event) {

  }

  handleClickImage(event) {

  }

  handleClickPrompt(event) {
    React.findDOMNode(this.refs.invisible).focus();
    this.setState({ shouldShowOptions: !this.state.shouldShowOptions });
  }

  handleMouseDown(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  componentDidMount() {
    var code = React.findDOMNode(this.refs.code);
    code.addEventListener("click", this.handleClickCode.bind(this));

    var divider = React.findDOMNode(this.refs.divider);
    divider.addEventListener("click", this.handleClickDivider.bind(this));

    var image = React.findDOMNode(this.refs.image);
    image.addEventListener("click", this.handleClickImage.bind(this));

    var invisible = React.findDOMNode(this.refs.invisible);
    invisible.addEventListener("blur", this.handleBlur.bind(this));

    var prompt = React.findDOMNode(this.refs.prompt);
    prompt.addEventListener("click", this.handleClickPrompt.bind(this));
    prompt.addEventListener("mousedown", this.handleMouseDown.bind(this));
  }

  componentWillUnmount() {
    var code = React.findDOMNode(this.refs.code);
    code.removeEventListener("click", this.handleClickCode);

    var divider = React.findDOMNode(this.refs.divider);
    divider.removeEventListener("click", this.handleClickDivider);

    var image = React.findDOMNode(this.refs.image);
    image.removeEventListener("click", this.handleClickImage);

    var invisible = React.findDOMNode(this.refs.invisible);
    invisible.removeEventListener("blur", this.handleBlur);

    var prompt = React.findDOMNode(this.refs.prompt);
    prompt.removeEventListener("click", this.handleClickPrompt);
    prompt.removeEventListener("mousedown", this.handleMouseDown);
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
          ref={"invisible"}>
        </p>
        <span className={"media-modal-prompt"} ref={"prompt"}>
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
      </div>
    );
  }
}


module.exports = MediaModal;
