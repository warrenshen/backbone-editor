import ClassNames from "classnames";
import React from "react";
import Component from "app/templates/component";

import Block from "app/models/block";

import EditorActor from "app/actors/editor_actor";

import Formatter from "app/helpers/formatter";
import Selector from "app/helpers/selector";

import KeyConstants from "app/constants/key_constants";


class BlockCaption extends Component {

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

  handleKeyDown(event) {
    var selection = window.getSelection();
    var point = Selector.generatePoint(selection);

    if (event.which === KeyConstants.backspace) {
      if (!point.prefixesBlock()) {
        var block = this.props.block;
        var caretOffset = point.caretOffset;
        block.removeFragment(caretOffset - 1, caretOffset);
      }
    } else if (event.which === KeyConstants.tab) {
      event.preventDefault();
      // handle tab
    }
  }

  handleKeyPress(event) {
    var selection = window.getSelection();
    var point = Selector.generatePoint(selection);

    if (event.which === KeyConstants.enter) {
      event.preventDefault();
    } else {
      var block = this.props.block;
      var content = block.get("content");
      var character = String.fromCharCode(event.which);
      block.addCharacter(point.caretOffset, character);
    }
  }

  componentDidMount() {
    var content = React.findDOMNode(this.refs.content);
    content.addEventListener("blur", this.handleBlur.bind(this));
    content.addEventListener("focus", this.handleFocus.bind(this));
    content.addEventListener("keydown", this.handleKeyDown.bind(this));
    content.addEventListener("keypress", this.handleKeyPress.bind(this));
    this.renderContent(content);
  }

  componentDidUpdate() {
    var content = React.findDOMNode(this.refs.content);
    this.renderContent(content);
  }

  componentWillUnmount() {
    var content = React.findDOMNode(this.refs.content);
    content.removeEventListener("blur", this.handleBlur);
    content.removeEventListener("focus", this.handleFocus);
    content.removeEventListener("keydown", this.handleKeyDown);
    content.removeEventListener("keypress", this.handleKeyPress);
  }

  renderContent(node) {
    node.innerHTML = Formatter.formatBlock(this.props.block);
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

BlockCaption.propTypes = {
  block: React.PropTypes.instanceOf(Block).isRequired,
  sectionIndex: React.PropTypes.number.isRequired,
  shouldEnableEdits: React.PropTypes.bool.isRequired,
  updateStory: React.PropTypes.func,
};

BlockCaption.defaultProps = {
  block: new Block(),
  sectionIndex: 0,
  shouldEnableEdits: true,
};


module.exports = BlockCaption;
