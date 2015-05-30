import React from "react";
import Component from "app/templates/component";

import Block from "app/models/block";

import EditorStore from "app/stores/editor_store";

import EditorActor from "app/actors/editor_actor";

import Formatter from "app/helpers/formatter";
import Selector from "app/helpers/selector";

import KeyConstants from "app/constants/key_constants";
import TypeConstants from "app/constants/type_constants";


class BlockComponent extends Component {

  handleArrowKey(event, point) {
    var block = this.props.block;
    var node = React.findDOMNode(this.refs.content);
    var caretOffset = point.caretOffset;

    switch (event.which) {
      case KeyConstants.down:
        var floorOffset = Selector.findFloorOffset(node);
        if (caretOffset >= floorOffset) {
          event.preventDefault();
          point.caretOffset = caretOffset - floorOffset;
          EditorActor.shiftDown(point);
        }
        break;

      case KeyConstants.left:
        if (point.prefixesBlock() && !point.prefixesEverything()) {
          event.preventDefault();
          EditorActor.shiftLeft(point);
        }
        break;

      case KeyConstants.right:
        if (point.caretOffset === block.get("content").length) {
          event.preventDefault();
          EditorActor.shiftRight(point);
        }
        break;

      case KeyConstants.up:
        var ceilingOffset = Selector.findCeilingOffset(node);
        if (caretOffset < ceilingOffset || caretOffset === 0 || ceilingOffset < 0) {
          event.preventDefault();
          EditorActor.shiftUp(point);
        }
        break;
    }
  }

  handleKeyDown(event) {
    var selection = window.getSelection();
    var point = Selector.generatePoint(selection);

    if (event.which >= KeyConstants.left && event.which <= KeyConstants.down) {
      if (!event.shiftKey) {
        this.handleArrowKey(event, point);
      }
    } else if (event.which === KeyConstants.backspace) {
      if (!point.prefixesBlock()) {
        var block = this.props.block;
        var caretOffset = point.caretOffset;
        block.removeFragment(caretOffset - 1, caretOffset);
      } else if (!point.prefixesEverything()) {
        event.preventDefault();
        EditorActor.removeBlock(point);
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
      EditorActor.splitBlock(point);
      this.props.updateStory();
    } else {
      var block = this.props.block;
      var character = String.fromCharCode(event.which);
      block.addFragment(point.caretOffset, character);

      // unless text
      //   event.preventDefault()
      //   pointObject = new Point(@props.sectionIndex, @props.index, 1)
      //   EditorActionCreators.updateCaret(pointObject)
      //   @props.truifyUpdateEdit()

      // else if @props.block.getText().substring(0, 3) is "1. "
      //   EditorActionCreators.formatOrderedList(@props.sectionIndex, @props.index)
      //   @props.truifyUpdateEdit()
    }
  }

  handleMouseDown(event) {
    event.stopPropagation();
    EditorActor.updateMouseState(TypeConstants.mouse.down);
  }

  handleMouseMove(event) {
    event.stopPropagation();
    if (EditorStore.mouseState === TypeConstants.mouse.down) {
      // Force the store to emit a change so that block components update.
      EditorActor.updateMouseState(TypeConstants.mouse.move, true);
    }
  }

  handleMouseUp(event) {
    if (EditorStore.mouseState !== TypeConstants.mouse.move) {
      EditorActor.updateMouseState(TypeConstants.mouse.up);

      var selection = window.getSelection();
      var range = document.caretRangeFromPoint(event.clientX, event.clientY);
      selection.removeAllRanges()
      selection.addRange(range)

      var point = Selector.generatePoint(selection);
      EditorActor.updatePoint(point);
    }
  }

  componentDidMount() {
    super.componentDidMount();
    var node = React.findDOMNode(this.refs.content);
    node.addEventListener("keydown", this.handleKeyDown.bind(this));
    node.addEventListener("keypress", this.handleKeyPress.bind(this));
    node.addEventListener("mousedown", this.handleMouseDown.bind(this));
    node.addEventListener("mousemove", this.handleMouseMove.bind(this));
    node.addEventListener("mouseup", this.handleMouseUp.bind(this));
    this.renderContent(node);
  }

  componentDidUpdate() {
    var node = React.findDOMNode(this.refs.content);
    this.renderContent(node);
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    var node = React.findDOMNode(this.refs.content);
    node.removeEventListener("keydown", this.handleKeyDown);
    node.removeEventListener("keypress", this.handleKeyPress);
    node.removeEventListener("mousedown", this.handleMouseDown);
    node.removeEventListener("mousemove", this.handleMouseMove);
    node.removeEventListener("mouseup", this.handleMouseUp);
  }

  renderContent(node) {
    node.innerHTML = Formatter.formatBlock(this.props.block);
  }

  render() {
    return (
      <div>
        <p ref={"content"}></p>
      </div>
    );
  }
}

BlockComponent.propTypes = {
  block: React.PropTypes.instanceOf(Block).isRequired,
  shouldEnableEdits: React.PropTypes.bool.isRequired,
  updateStory: React.PropTypes.func,
};

BlockComponent.defaultProps = {
  block: new Block(),
  shouldEnableEdits: true,
};


module.exports = BlockComponent;
