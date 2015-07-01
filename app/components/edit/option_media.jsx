import ClassNames from "classnames";
import React from "react";

import Component from "app/templates/component";


class OptionMedia extends Component {

  // --------------------------------------------------
  // Defaults
  // --------------------------------------------------
  displayName() {
    return "OptionMedia";
  }

  // --------------------------------------------------
  // Handlers
  // --------------------------------------------------
  handleMouseDown(event) {
    event.preventDefault();
  }

  // --------------------------------------------------
  // Lifecycle
  // --------------------------------------------------
  componentDidMount() {
    var node = React.findDOMNode(this.refs.option);
    node.addEventListener("click", this.props.action);
    node.addEventListener("mousedown", this.handleMouseDown);
  }

  componentWillUnmount() {
    var node = React.findDOMNode(this.refs.option);
    node.removeEventListener("click", this.props.action);
    node.removeEventListener("mousedown", this.handleMouseDown);
  }

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  render() {
    var optionClass = ClassNames(
      { "media-modal-option": true },
      { "media-modal-option-hidden": !this.props.isActive }
    );
    return (
      <span className={optionClass} ref={"option"}>
        <span className={"vertical-anchor"}></span>
        <i className={this.props.className}></i>
      </span>
    );
  }
}

OptionMedia.propTypes = {
  action: React.PropTypes.func.isRequired,
  className: React.PropTypes.string.isRequired,
  isActive: React.PropTypes.bool.isRequired,
};

OptionMedia.defaultProps = {
  action: null,
  className: "fa fa-image",
  isActive: false,
};


module.exports = OptionMedia;
