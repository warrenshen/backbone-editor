import ClassNames from "classnames";
import React from "react";

import Component from "app/templates/component";

import Block from "app/models/block";

import EditorActor from "app/actors/editor_actor";

import Formatter from "app/helpers/formatter";
import Selector from "app/helpers/selector";

import KeyConstants from "app/constants/key_constants";
import TypeConstants from "app/constants/type_constants";


class BlockCaption extends Component {

  // --------------------------------------------------
  // Defaults
  // --------------------------------------------------
  displayName() {
    return "BlockCaption";
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

    var selection = window.getSelection();

    if (event.which === KeyConstants.backspace) {
      if (selection.type === TypeConstants.selection.caret) {
        var point = Selector.generatePoint(selection);
        var caretOffset = point.caretOffset;

        this.props.block.removeFragment(caretOffset - 1, caretOffset);
      } else if (selection.type === TypeConstants.selection.range) {
        var vector = Selector.generateVector(selection);
        var startOffset = vector.startPoint.caretOffset;
        var endOffset = vector.endPoint.caretOffset;

        this.props.block.removeFragment(startOffset, endOffset);
      }
    } else if (event.which === KeyConstants.tab) {
      event.preventDefault();

      var point = Selector.generatePoint(selection);

      point.caretOffset = 0;
      EditorActor.shiftDown(point);
      this.props.updateStoryEditable();
    }
  }

  handleKeyPress(event) {
    event.stopPropagation();

    var selection = window.getSelection();

    if (event.which === KeyConstants.enter) {
      event.preventDefault();
    } else if (selection.type === TypeConstants.selection.caret) {
      var character = String.fromCharCode(event.which);
      var point = Selector.generatePoint(selection);

      this.props.block.addFragment(character, point.caretOffset);
    } else if (selection.type === TypeConstants.selection.range) {
      event.preventDefault();

      var character = String.fromCharCode(event.which);
      var vector = Selector.generateVector(selection);

      EditorActor.removeBlocks(vector, { character: character });
      this.props.updateStoryEditable();
    }
  }

  handleKeyUp(event) {
    event.stopPropagation();
  }

  handleMouseDown(event) {
    event.stopPropagation();
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
    node.addEventListener("keyup", this.handleKeyUp.bind(this));
    node.addEventListener("mousedown", this.handleMouseDown.bind(this));
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
    node.removeEventListener("keyup", this.handleKeyUp);
    node.removeEventListener("mousedown", this.handleMouseDown);
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

BlockCaption.propTypes = {
  block: React.PropTypes.instanceOf(Block).isRequired,
  updateStoryEditable: React.PropTypes.func.isRequired,
};

BlockCaption.defaultProps = {
  block: new Block(),
  updateStoryEditable: null,
};


module.exports = BlockCaption;
