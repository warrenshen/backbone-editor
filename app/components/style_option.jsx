import ClassNames from "classnames";
import React from "react";

import Component from "app/templates/component";


class StyleOption extends Component {

  // --------------------------------------------------
  // Defaults
  // --------------------------------------------------
  displayName() {
    return "StyleOption";
  }

  // --------------------------------------------------
  // Lifecycle
  // --------------------------------------------------
  componentDidMount() {
    var option = React.findDOMNode(this.refs.option);
    option.addEventListener("click", this.props.action);
  }

  componentWillUnmount() {
    var option = React.findDOMNode(this.refs.option);
    option.removeEventListener("click", this.props.action);
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

StyleOption.propTypes = {
  action: React.PropTypes.func.isRequired,
  className: React.PropTypes.string.isRequired,
  isActive: React.PropTypes.bool.isRequired,
};

StyleOption.defaultProps = {
  action: null,
  className: "fa fa-header",
  isActive: false,
};


module.exports = StyleOption;
