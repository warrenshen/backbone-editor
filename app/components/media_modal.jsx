import ClassNames from "classnames";
import React from "react";
import Component from "app/templates/component";


class MediaModal extends Component {

  getDefaultState() {
    return { shouldShowOptions: false };
  }

  handleClick(event) {
    console.log("Prompt clicked!");
    this.setState({ shouldShowOptions: !this.state.shouldShowOptions });
  }

  componentDidMount() {
    var prompt = React.findDOMNode(this.refs.prompt);
    prompt.addEventListener("click", this.handleClick.bind(this));
  }

  componentWillUnmount() {
    var prompt = React.findDOMNode(this.refs.prompt);
    prompt.removeEventListener("click", this.handleClick);
  }

  render() {
    var modalClass = ClassNames(
      { "media-modal": true },
      { "general-hidden": false }
    );
    var optionClass = ClassNames(
      { "media-modal-option": true },
      { "media-modal-option-hidden": !this.state.shouldShowOptions }
    );
    return (
      <div className={modalClass} ref="modal">
        <span className={"vertical-anchor"}></span>
        <span className={"media-modal-prompt"} ref="prompt">
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
        <span className={optionClass} ref={"divider"}>
          <span className={"vertical-anchor"}></span>
          <i className={"fa fa-code"}></i>
        </span>
      </div>
    );
  }
}


module.exports = MediaModal;
