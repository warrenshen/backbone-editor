import ClassNames from "classnames";
import React from "react";

import BlockComponent from "app/templates/block_component";

import EditorStore from "app/stores/editor_store";


class BlockStandard extends BlockComponent {

  // --------------------------------------------------
  // Defaults
  // --------------------------------------------------
  displayName() {
    return "BlockStandard";
  }

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
      console.log("handling blur");
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
    super.componentWillUnmount();

    var content = React.findDOMNode(this.refs.content);
    content.removeEventListener("blur", this.handleBlur);
    content.removeEventListener("focus", this.handleFocus);
  }

  // --------------------------------------------------
  // Helpers
  // --------------------------------------------------
  shouldShowPlaceholder() {
    return this.props.block.get("section_index") == 0 &&
           this.props.block.get("index") === 0 &&
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
