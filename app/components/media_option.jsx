import ClassNames from "classnames";
import React from "react";

import Component from "app/templates/component";


class MediaOption extends Component {

  // --------------------------------------------------
  // Handlers
  // --------------------------------------------------
  handleClick(event) {
    this.props.action();
  }

  handleMouseDown(event) {
    event.preventDefault();
    event.stopPropagation();
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
      { "media-modal-option-hidden": !this.props.active }
    );
    return (
      <span className={optionClass} ref={"option"}>
        <span className={"vertical-anchor"}></span>
        <i className={this.props.className}></i>
      </span>
    );
  }
}

MediaOption.propTypes = {
  action: React.PropTypes.func.isRequired,
  active: React.PropTypes.bool.isRequired,
  className: React.PropTypes.string.isRequired,
};

MediaOption.defaultProps = {
  action: null,
  active: false,
  className: "fa fa-image",
};


module.exports = MediaOption;