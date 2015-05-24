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
      case KeyConstants.down:
        var floorOffset = 0;
        var bottom = node.getBoundingClientRect().bottom;

        var complete = false;
        while (walker.nextNode() && !complete) {
          var currentNode = walker.currentNode;
          var length = currentNode.textContent.length;
          for (var i = 0; i < length && !complete; i += 1) {
            console.log(floorOffset);
            range.setStart(currentNode, i);
            range.setEnd(currentNode, i + 1);
            if (bottom - range.getBoundingClientRect().bottom < 10) {
              complete = true;
            } else {
              floorOffset += 1;
            }
          }
        }

        if (caretOffset >= floorOffset) {
          event.preventDefault();
          point.caretOffset = caretOffset - floorOffset;
          EditorActor.shiftDown(point);
        }
        break;

      case KeyConstants.up:
        // TODO: Come up with a better name here.
        var ceilingOffset = 0;
        var top = node.getBoundingClientRect().top;

        var complete = false;
        while (walker.nextNode() && !complete) {
          var currentNode = walker.currentNode;
          var length = currentNode.textContent.length;
          for (var i = 0; i < length && !complete; i += 1) {
            ceilingOffset += 1;
            console.log(ceilingOffset);
            range.setStart(currentNode, i);
            range.setEnd(currentNode, i + 1);
            if (range.getBoundingClientRect().top - top > 10) {
              complete = true;
            }
          }
        }

        if (caretOffset <= ceilingOffset) {
          event.preventDefault();
          point.caretOffset = (-1) * caretOffset;
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
