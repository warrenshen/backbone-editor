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
    return (
      <span className={"style-option"} ref="option">
        <i className={this.props.className}></i>
      </span>
    );
  }
}

StyleOption.propTypes = {
  action: React.PropTypes.func.isRequired,
  className: React.PropTypes.string.isRequired,
};

StyleOption.defaultProps = {
  action: null,
  className: "fa fa-header",
};


module.exports = StyleOption;
