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
  handleClick(event) {
    this.props.action();
  }

  handleMouseDown(event) {
    event.preventDefault();
  }

  // --------------------------------------------------
  // Lifecycle
  // --------------------------------------------------
  componentDidMount() {
    var option = React.findDOMNode(this.refs.option);
    option.addEventListener("click", this.handleClick.bind(this));
    option.addEventListener("mousedown", this.handleMouseDown.bind(this));
  }

  componentWillUnmount() {
    var option = React.findDOMNode(this.refs.option);
    option.removeEventListener("click", this.handleClick);
    option.removeEventListener("mousedown", this.handleMouseDown);
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
