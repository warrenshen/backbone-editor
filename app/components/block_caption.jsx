import ClassNames from "classnames";
import React from "react";
import BlockComponent from "app/templates/block_component";

import KeyConstants from "app/constants/key_constants";


class BlockCaption extends BlockComponent {

  getDefaultState() {
    return { shouldShowPlaceholder: true };
  }

  handleBlur(event) {
    if (!this.props.block.get("content")) {
      this.setState({ shouldShowPlaceholder: true });
    }
  }

  handleFocus(event) {
    if (this.state.shouldShowPlaceholder) {
      this.setState({ shouldShowPlaceholder: false });
    }
  }

  componentDidMount() {
    super.componentDidMount();
    var content = React.findDOMNode(this.refs.content);
    content.addEventListener("blur", this.handleBlur.bind(this));
    content.addEventListener("focus", this.handleFocus.bind(this));
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    var content = React.findDOMNode(this.refs.content);
    content.removeEventListener("blur", this.handleBlur);
    content.removeEventListener("focus", this.handleFocus);
  }

  render() {
    var captionClass = ClassNames(
      { "block-image-caption": true },
      { "general-placeholder": this.state.shouldShowPlaceholder }
    );
    return (
      <p
        className={captionClass}
        contentEditable={this.props.shouldEnableEdits}
        placeholder={"Write a caption here..."}
        ref={"content"}>
      </p>
    );
  }
}


module.exports = BlockCaption;
