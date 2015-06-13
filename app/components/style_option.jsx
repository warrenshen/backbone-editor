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
      { "style-option-active": this.props.active }
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
  active: React.PropTypes.bool.isRequired,
  className: React.PropTypes.string.isRequired,
};

StyleOption.defaultProps = {
  action: null,
  active: false,
  className: "fa fa-header",
};


module.exports = StyleOption;
