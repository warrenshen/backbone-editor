import React from "react";
import Component from "app/templates/component";

import Block from "app/models/block";

import EditorActor from "app/actors/editor_actor";

import Formatter from "app/helpers/formatter";
import Selector from "app/helpers/selector";

import KeyConstants from "app/constants/key_constants";


class BlockComponent extends Component {

  handleArrowKey(event, selection) {
    var block = this.props.block;
    var node = React.findDOMNode(this.refs.content);

    var point = Selector.generatePoint(selection);
    var caretOffset = point.caretOffset;

    var range = document.createRange();
    var walker = Selector.createTreeWalker(node);

    switch (event.which) {
      case KeyConstants.up:
        var altitude = 0;
        if (block.length > 0) {
          var top = node.getBoundingClientRect().top;
          while (walker.nextNode()) {
            var currentNode = walker.currentNode;
            if (caretOffset - walker.currentNode.length <= 0) {
              if (caretOffset >= currentNode.length) {
                range.setStart(currentNode, caretOffset - 1);
                range.setStart(currentNode, caretOffset);
              } else {
                range.setStart(currentNode, caretOffset);
                range.setStart(currentNode, caretOffset + 1);
              }
            } else {
              caretOffset -= currentNode.length;
            }
          }
          altitude = range.getBoundingClientRect().top - top;
        }
        if (altitude < 10) {
          event.preventDefault();
          EditorActor.shiftCaretUp(point);
        }
        break;

      case KeyConstants.down:
        var floorOffset = 0;
        if (block.length > 0) {
          var bottom = node.getBoundingClientRect().bottom;
          var complete = false;
          while (walker.nextNode() && !complete) {
            var currentNode = walker.currentNode;
            var length = currentNode.textContent.length;
            for (int i = 0; i < length - 1; i += 1) {
              range.setStart(currentNode, count);
              range.setEnd(currentNode, count + 1);

              if (bottom - range.getBoundingClientRect().bottom < 10) {
                floorOffset += count - length - 1;
                complete = true;
                i = length;
              }
            }
            floorOffset += length;
          }
        }
        if (caretOffset > floorOffset - 1) {
          event.preventDefault();
          point.caretOffset = caretOffset - floorOffset;
          EditorActor.shiftCaretDown(point);
        }
        break;

    }
  }

  handleKeyDown(event) {
    var selection = window.getSelection();
    var point = Selector.generatePoint(selection);

    if (event.which >= KeyConstants.left && event.which <= KeyConstants.down) {
      if (!event.shiftKey) {
        this.handleArrowKey(event, selection);
      }
    } else if (event.which === KeyConstants.backspace) {
      if (point.prefixesBlock()) {
        event.preventDefault();
        EditorActor.removeBlock(point);
      } else {
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
      EditorActor.splitBlock(point);
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

  handleMouseUp(event) {
    var selection = window.getSelection();
    var point = Selector.generatePoint(selection);
    EditorActor.updatePoint(point);
  }

  componentDidMount() {
    super.componentDidMount();
    var node = React.findDOMNode(this.refs.content);
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
    super.componentWillUnmount();
    var node = React.findDOMNode(this.refs.content);
    node.removeEventListener("keydown", this.handleKeyDown);
    node.removeEventListener("keypress", this.handleKeyPress);
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
  block: React.PropTypes.object.isRequired,
}

BlockComponent.defaultProps = {
  block: new Block(),
}


module.exports = BlockComponent;
