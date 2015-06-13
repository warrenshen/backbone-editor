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
    event.preventDefault();
    event.stopPropagation();

    if (this.props.route !== "") {
      RouterDirectory.get("Router").navigate(this.props.route, true);
    } else if (this.props.action !== null) {
      this.props.action();
    }
  }

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  render() {
    if (this.props.source) {
      return (
        <img
          className={this.props.style}
          src={this.props.source}
          onClick={this.handleClick.bind(this)} />
      );
    } else {
      return (
        <a
          className={this.props.style}
          href={this.props.route}
          onClick={this.handleClick.bind(this)}>
          {this.props.content}
        </a>
      );
    }
  }
}

Clickable.propTypes = {
  action:  React.PropTypes.func,
  content: React.PropTypes.string.isRequired,
  route:   React.PropTypes.string,
  source:  React.PropTypes.string,
  style:   React.PropTypes.string.isRequired,
};

Clickable.defaultProps = {
  action:  null,
  route:   "",
  style:   "",
  content: "",
  source:  "",
};


module.exports = Clickable;
