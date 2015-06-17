import React from "react";

import Component from "app/templates/component";

import RouterDirectory from "app/directories/router_directory";


class Clickable extends Component {

  // --------------------------------------------------
  // Defaults
  // --------------------------------------------------
  displayName() {
    return "Clickable";
  }

  // --------------------------------------------------
  // Handlers
  // --------------------------------------------------
  handleClick() {
    this.props.action();
  }

  // --------------------------------------------------
  // Lifecycle
  // --------------------------------------------------
  componentDidMount() {
    var clickable = React.findDOMNode(this.refs.clickable);
    clickable.addEventListener("click", this.handleClick.bind(this));
  }

  componentWillUnmount() {
    var clickable = React.findDOMNode(this.refs.clickable);
    clickable.removeEventListener("click", this.handleClick);
  }

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  render() {
    return (
      <span className={this.props.className} ref={"clickable"}>
        {this.props.content}
      </span>
    );
  }
}

Clickable.propTypes = {
  action: React.PropTypes.func.isRequired,
  className: React.PropTypes.string.isRequired,
  content: React.PropTypes.string.isRequired,
};

Clickable.defaultProps = {
  action:  null,
  className: "general-button",
  content: "",
};


module.exports = Clickable;
