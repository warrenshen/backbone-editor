import React from "react";

import Component from "app/templates/component";

import KeyConstants from "app/constants/key_constants";


class ModalInput extends Component {

  // --------------------------------------------------
  // Getters
  // --------------------------------------------------
  static get propTypes() {
    return {
      styleLink: React.PropTypes.func.isRequired,
    };
  }

  // --------------------------------------------------
  // Handlers
  // --------------------------------------------------
  handleKeyPress(event) {
    if (event.which === KeyConstants.enter) {
      var node = React.findDOMNode(this.refs.input);
      this.props.styleLink(node.value);
    }
  }

  // --------------------------------------------------
  // Lifecycle
  // --------------------------------------------------
  componentDidMount() {
    var node = React.findDOMNode(this.refs.input);
    node.addEventListener("keypress", this.handleKeyPress.bind(this));
    node.focus();
  }

  componentWillUnmount() {
    var node = React.findDOMNode(this.refs.input);
    node.removeEventListener("keypress", this.handleKeyPress);
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
          placeholder={"Enter a link here..."}>
        </input>
      </div>
    );
  }
}


module.exports = ModalInput;
