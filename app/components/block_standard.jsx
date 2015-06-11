import ClassNames from "classnames";
import React from "react";

import BlockComponent from "app/templates/block_component";

import EditorStore from "app/stores/editor_store";


class BlockStandard extends BlockComponent {

  // --------------------------------------------------
  // State
  // --------------------------------------------------
  getDefaultState() {
    return { hasFocus: true };
  }

  // --------------------------------------------------
  // Handlers
  // --------------------------------------------------
  handleBlur(event) {
    if (this.state.hasFocus) {
      this.setState({ hasFocus: false });
    }
  }

  handleFocus(event) {
    if (!this.state.hasFocus) {
      this.setState({ hasFocus: true });
    }
  }

  // --------------------------------------------------
  // Lifecycle
  // --------------------------------------------------
  componentDidMount() {
    super.componentDidMount();
    var content = React.findDOMNode(this.refs.content);
    content.addEventListener("blur", this.handleBlur.bind(this));
    content.addEventListener("focus", this.handleFocus.bind(this));
  }

  componentWillUnmount() {
    super.componentDidMount();
    var content = React.findDOMNode(this.refs.content);
    content.removeEventListener("blur", this.handleBlur);
    content.removeEventListener("focus", this.handleFocus);
  }

  // --------------------------------------------------
  // Helpers
  // --------------------------------------------------
  shouldShowPlaceholder() {
    var block = this.props.block;
    return block.get("section_index") == 0 &&
           block.get("index") === 0 &&
           !this.state.hasFocus;
  }

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  render() {
    var block = this.props.block;
    var contentClass = ClassNames(
      { "block-content": true },
      { "block-centered": block.get("centered") },
      { "block-empty": !block.get("content") },
      { "general-placeholder": this.shouldShowPlaceholder() }
    );
    return (
      <div
        className={"block-container"}
        data-index={block.get("index")}>
        <p
          className={contentClass}
          contentEditable={this.props.shouldEnableEdits}
          placeholder={"Write anything here..."}
          ref={"content"}>
        </p>
        {this.renderModal()}
      </div>
    );
  }
}


module.exports = BlockStandard;
