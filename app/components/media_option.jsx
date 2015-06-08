import React from "react";
import Component from "app/templates/component";


class MediaOption extends Component {

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
      { "media-modal-option-hidden": !this.state.shouldShowOptions }
    );
    return (
      <span className={optionClass} ref={"option"}>
        <span className={"vertical-anchor"}></span>
        <i className={"fa fa-plus"}></i>
      </span>
    );
  }
}


module.exports = MediaOption;
