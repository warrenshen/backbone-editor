import React from "react";
import Component from "app/templates/component";

import Block from "app/models/block";

import EditorActor from "app/actors/editor_actor";

import Formatter from "app/helpers/formatter";
import Vectorizer from "app/helpers/vectorizer";

import KeyConstants from "app/constants/key_constants";


class BlockComponent extends Component {

  handleKeyPress(event) {
    var selection = window.getSelection();
    var vector = Vectorizer.generateVector(selection);
    if (event.which === KeyConstants.enter) {
      event.preventDefault();
      EditorActor.splitBlock(vector);
    } else {
      var block = this.props.block;
      var character = String.fromCharCode(event.which);
      block.addFragment(vector, character);

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
