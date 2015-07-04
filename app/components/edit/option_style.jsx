import ClassNames from "classnames";
import React from "react";

import Component from "app/templates/component";


class OptionStyle extends Component {

  // --------------------------------------------------
  // Getters
  // --------------------------------------------------
  static get propTypes() {
    return {
      action: React.PropTypes.func.isRequired,
      className: React.PropTypes.string.isRequired,
      isActive: React.PropTypes.bool.isRequired,
      isHidden: React.PropTypes.bool.isRequired,
    };
  }

  // --------------------------------------------------
  // Lifecycle
  // --------------------------------------------------
  componentDidMount() {
    var node = React.findDOMNode(this.refs.option);
    node.addEventListener("click", this.props.action);
  }

  componentWillUnmount() {
    var node = React.findDOMNode(this.refs.option);
    node.removeEventListener("click", this.props.action);
  }

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  render() {
    var optionClass = ClassNames(
      { "style-option": true },
      { "style-option-active": this.props.isActive },
      { "general-hidden": this.props.isHidden }
    );
    return (
      <span className={optionClass} ref="option">
        <i className={this.props.className}></i>
      </span>
    );
  }
}


module.exports = OptionStyle;
