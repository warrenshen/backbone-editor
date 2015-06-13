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
      var block = this.props.block;

      if (selection.type === TypeConstants.selection.caret) {
        var point = Selector.generatePoint(selection);
        var caretOffset = point.caretOffset;

        block.removeFragment(caretOffset - 1, caretOffset);
      } else if (selection.type === TypeConstants.selection.range) {
        var vector = Selector.generateVector(selection);
        var startPoint = vector.startPoint;
        var endPoint = vector.endPoint;

        block.removeFragment(startPoint.caretOffset, endPoint.caretOffset);
      }
    } else if (event.which === KeyConstants.tab) {
      event.preventDefault();
      // handle tab
    }
  }

  handleKeyPress(event) {
    event.stopPropagation();

    var selection = window.getSelection();

    if (event.which === KeyConstants.enter) {
      event.preventDefault();
    } else if (selection.type === TypeConstants.selection.caret) {
      var block = this.props.block;
      var character = String.fromCharCode(event.which);
      var point = Selector.generatePoint(selection);

      block.addCharacter(point.caretOffset, character);
    } else if (selection.type === TypeConstants.selection.range) {
      event.preventDefault();

      var character = String.fromCharCode(event.which);
      var vector = Selector.generateVector(selection);

      EditorActor.removeBlocks(vector, { character: character });
      this.props.updateStory();
    }
  }

  handleKeyUp(event) {
    event.stopPropagation();
  }

  // --------------------------------------------------
  // Lifecycle
  // --------------------------------------------------
  componentDidMount() {
    var content = React.findDOMNode(this.refs.content);
    content.addEventListener("blur", this.handleBlur.bind(this));
    content.addEventListener("focus", this.handleFocus.bind(this));
    content.addEventListener("keydown", this.handleKeyDown.bind(this));
    content.addEventListener("keypress", this.handleKeyPress.bind(this));
    content.addEventListener("keyup", this.handleKeyUp.bind(this));

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
    content.removeEventListener("keyup", this.handleKeyUp);
  }

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
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
        placeholder={"Write caption here..."}
        ref={"content"}>
      </p>
    );
  }
}

BlockCaption.propTypes = {
  block: React.PropTypes.instanceOf(Block).isRequired,
  shouldEnableEdits: React.PropTypes.bool.isRequired,
  updateStory: React.PropTypes.func.isRequired,
};

BlockCaption.defaultProps = {
  block: new Block(),
  shouldEnableEdits: true,
  updateStory: null,
};


module.exports = BlockCaption;
