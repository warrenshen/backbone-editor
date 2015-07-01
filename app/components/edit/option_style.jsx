import ClassNames from "classnames";
import React from "react";

import Component from "app/templates/component";


class OptionStyle extends Component {

  // --------------------------------------------------
  // Defaults
  // --------------------------------------------------
  displayName() {
    return "OptionStyle";
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
      { "style-option-active": this.props.isActive }
    );
    return (
      <span className={optionClass} ref="option">
        <i className={this.props.className}></i>
      </span>
    );
  }
}

OptionStyle.propTypes = {
  action: React.PropTypes.func.isRequired,
  className: React.PropTypes.string.isRequired,
  isActive: React.PropTypes.bool.isRequired,
};

OptionStyle.defaultProps = {
  action: null,
  className: "fa fa-header",
  isActive: false,
};


module.exports = OptionStyle;
