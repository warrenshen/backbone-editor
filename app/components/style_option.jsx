import ClassNames from "classnames";
import React from "react";
import Component from "app/templates/component";


class StyleOption extends Component {

  componentDidMount() {
    super.componentDidMount();
    var node = React.findDOMNode(this.refs.option);
    node.addEventListener("click", this.props.action);
  }

  componentWillUnmount() {
    var node = React.findDOMNode(this.refs.option);
    node.removeEventListener("click", this.props.action);
  }

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
