import ClassNames from "classnames";
import React from "react";

import Component from "app/templates/component";

import Block from "app/models/block";

import EditorActor from "app/actors/editor_actor";

import Selector from "app/helpers/selector";

import KeyConstants from "app/constants/key_constants";
import TypeConstants from "app/constants/type_constants";


class BlockCaption extends Component {

  // --------------------------------------------------
  // Getters
  // --------------------------------------------------
  static get propTypes() {
    return {
      block: React.PropTypes.instanceOf(Block).isRequired,
      updateStoryEdit: React.PropTypes.func.isRequired,
      updateStoryStyle: React.PropTypes.func.isRequired,
    };
  }

  // --------------------------------------------------
  // State
  // --------------------------------------------------
  getDefaultState() {
    return { shouldShowPlaceholder: true };
  }

  // --------------------------------------------------
  // Handlers
  // --------------------------------------------------
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
    event.stopPropagation();
    var block = this.props.block;
    var selection = window.getSelection();
    var which = event.which;
    if (event.ctrlKey || event.metaKey && which === KeyConstants.a) {
      EditorActor.selectAll();
      this.props.updateStoryStyle();
    } else if (which === KeyConstants.backspace) {
      if (selection.isCollapsed) {
        var point = Selector.generatePoint(selection);
        var caretOffset = point.caretOffset;
        if (caretOffset) {
          block.removeFragment(caretOffset - 1, caretOffset);
        } else {
          event.preventDefault();
        }
      } else {
        var vector = Selector.generateVector(selection);
        var startOffset = vector.startPoint.caretOffset;
        var endOffset = vector.endPoint.caretOffset;
        block.removeFragment(startOffset, endOffset);
      }
    }
  }

  handleKeyPress(event) {
    event.stopPropagation();
    var block = this.props.block;
    var selection = window.getSelection();
    if (event.which === KeyConstants.enter) {
      event.preventDefault();
    } else if (selection.isCollapsed) {
      var character = String.fromCharCode(event.which);
      var point = Selector.generatePoint(selection);
      block.addFragment(character, point.caretOffset);
    } else {
      event.preventDefault();
      var character = String.fromCharCode(event.which);
      var vector = Selector.generateVector(selection);
      EditorActor.removeBlocks(vector, { character: character });
      this.props.updateStoryEdit();
    }
  }

  handleMouseUp(event) {
    event.stopPropagation();
  }

  // --------------------------------------------------
  // Lifecycle
  // --------------------------------------------------
  componentDidMount() {
    var node = React.findDOMNode(this.refs.content);
    node.addEventListener("blur", this.handleBlur.bind(this));
    node.addEventListener("focus", this.handleFocus.bind(this));
    node.addEventListener("keydown", this.handleKeyDown.bind(this));
    node.addEventListener("keypress", this.handleKeyPress.bind(this));
    node.addEventListener("mouseup", this.handleMouseUp.bind(this));
    this.renderContent(node);
  }

  componentDidUpdate() {
    var node = React.findDOMNode(this.refs.content);
    this.renderContent(node);
  }

  componentWillUnmount() {
    var node = React.findDOMNode(this.refs.content);
    node.removeEventListener("blur", this.handleBlur);
    node.removeEventListener("focus", this.handleFocus);
    node.removeEventListener("keydown", this.handleKeyDown);
    node.removeEventListener("keypress", this.handleKeyPress);
    node.removeEventListener("mouseup", this.handleMouseUp);
  }

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  renderContent(node) {
    node.innerHTML = this.props.block.get("content");
  }

  render() {
    var captionClass = ClassNames(
      { "block-caption": true },
      { "general-placeholder": this.state.shouldShowPlaceholder }
    );
    return (
      <p
        className={captionClass}
        contentEditable={"true"}
        placeholder={"Write a caption here..."}
        ref={"content"}>
      </p>
    );
  }
}


module.exports = BlockCaption;
