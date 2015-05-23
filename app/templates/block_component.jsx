import React from "react";
import Component from "app/templates/component";

import Block from "app/models/block";

import EditorActor from "app/actors/editor_actor";

import Formatter from "app/helpers/formatter";
import Selector from "app/helpers/selector";

import KeyConstants from "app/constants/key_constants";


class BlockComponent extends Component {

  handleKeyDown(event) {
    var selection = window.getSelection();
    var point = Selector.generatePoint(selection);

    if (event.which >= KeyConstants.left && event.which <= KeyConstants.down) {
      if (!event.shiftKey) {
        // handle arrow key
      }
    } else if (event.which === KeyConstants.backspace) {
      debugger
      if (point.prefixesBlock()) {
        event.preventDefault();
        EditorActor.removeBlock(point);
      } else {
        var block = this.props.block;
        var caretOffset = point.getCaretOffset();
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
      block.addFragment(point.getCaretOffset(), character);

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
