import React from "react";
import Component from "app/templates/component";

import Block from "app/models/block";

import EditorActor from "app/actors/editor_actor";

import Formatter from "app/helpers/formatter";

import KeyConstants from "app/constants/key_constants";


class BlockComponent extends Component {

  handleKeyPress(event) {
    var selection = window.getSelection();
    if (event.which === KeyConstants.enter) {
      event.preventDefault();
      EditorActor.splitBlock(1);
    }
  }

  // handleKeyPress: (event) ->
  //   selection = window.getSelection()

  //   # Conditional clause to handle enter key press.
  //   if event.which is KeyCodes.enter
  //     event.preventDefault()

  //     caretOffset = @getCaretOffset(selection)
  //     pointObject = new Point(@props.sectionIndex, @props.index, caretOffset)
  //     EditorActionCreators.splitBlock(pointObject)
  //     @saveDraft()

  //   # Conditional clause to handle any other "input" key presses.
  //   else
  //     caretOffset = @getCaretOffset(selection)
  //     text = @props.block.getText()
  //     char = String.fromCharCode(event.which)
  //     @props.block.addFragment(caretOffset, char)

  //     switch char
  //       when ".", ",", "?", "!"
  //         @saveDraft(false)

  //     unless text
  //       event.preventDefault()
  //       pointObject = new Point(@props.sectionIndex, @props.index, 1)
  //       EditorActionCreators.updateCaret(pointObject)
  //       @props.truifyUpdateEdit()

  //     else if @props.block.getText().substring(0, 3) is "1. "
  //       EditorActionCreators.formatOrderedList(@props.sectionIndex, @props.index)
  //       @props.truifyUpdateEdit()

  componentDidMount() {
    super.componentDidMount();
    var node = React.findDOMNode(this.refs.content);
    node.addEventListener("keypress", this.handleKeyPress);
    this.renderContent(node);
  }

  componentDidUpdate() {
    super.componentDidUpdate();
    var node = React.findDOMNode(this.refs.content);
    this.renderContent(node);
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    var node = React.findDOMNode(this.refs.content);
    node.removeEventListener("keypress", this.handleKeyPress);
  }

  renderContent(node) {
    node.innerHTML = Formatter.format(this.props.block);
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
