import React from "react";

import Component from "app/templates/component";

import KeyConstants from "app/constants/key_constants";


class ModalInput extends Component {

  // --------------------------------------------------
  // Defaults
  // --------------------------------------------------
  displayName() {
    return "ModalInput";
  }

  // --------------------------------------------------
  // Handlers
  // --------------------------------------------------
  handleClick(event) {
    event.stopPropagation();
    React.findDOMNode(this.refs.input).focus();
  }

  handleKeyDown(event) {
    event.stopPropagation();
  }

  handleKeyPress(event) {
    event.stopPropagation();
    if (event.which === KeyConstants.enter) {
      var node = React.findDOMNode(this.refs.input);
      this.props.styleLink(node.value);
      node.blur();
    }
  }

  handleKeyUp(event) {
    event.stopPropagation();
  }

  // --------------------------------------------------
  // Lifecycle
  // --------------------------------------------------
  componentDidMount() {
    var node = React.findDOMNode(this.refs.input);
    node.addEventListener("blur", this.props.handleBlur);
    node.addEventListener("click", this.handleClick.bind(this));
    node.addEventListener("keydown", this.handleKeyDown.bind(this));
    node.addEventListener("keypress", this.handleKeyPress.bind(this));
    node.addEventListener("keyup", this.handleKeyUp.bind(this));
  }

  componentWillUnmount() {
    var node = React.findDOMNode(this.refs.input);
    node.removeEventListener("blur", this.props.handleBlur);
    node.removeEventListener("click", this.handleClick);
    node.removeEventListener("keydown", this.handleKeyDown);
    node.removeEventListener("keypress", this.handleKeyPress);
    node.removeEventListener("keyup", this.handleKeyUp);
  }

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  render() {
    return (
      <div className={"style-modal-overlay"}>
        <span className={"vertical-anchor"}></span>
        <input
          className={"style-modal-input"}
          ref={"input"}
          placeholder={"Enter or paste a link..."}>
        </input>
      </div>
    );
  }
}


module.exports = ModalInput;
