import _ from "lodash";
import React from "react";
import ListeningComponent from "app/templates/listening_component";

import StoryEditable from "app/components/story_editable";
import StyleModal from "app/components/style_modal";

import EditorStore from "app/stores/editor_store";

import EditorActor from "app/actors/editor_actor";

import Selector from "app/helpers/selector";

import KeyConstants from "app/constants/key_constants";
import TypeConstants from "app/constants/type_constants";


class EditorPage extends ListeningComponent {

  stores() {
    return [EditorStore];
  }

  getStoreState() {
    return {
      activeStyles: EditorStore.activeStyles,
      point: EditorStore.point,
      shouldEnableEdits: EditorStore.mouseState === TypeConstants.mouse.up,
      story: EditorStore.story,
      vector: EditorStore.vector,
    }
  }

  handleKeyDown(event) {
    event.stopPropagation();

    if (EditorStore.mouseState === TypeConstants.mouse.move) {
      if (event.which === KeyConstants.backspace) {
        event.preventDefault();
        var selection = window.getSelection();
        var vector = Selector.generateVector(selection);
        EditorActor.removeBlocks(vector);
      } else if (event.which >= KeyConstants.left && event.which <= KeyConstants.down) {
        var selection = window.getSelection();
        var vector = Selector.generateVector(selection);

        if (event.shiftKey) {
          EditorActor.updateVector(vector);
        } else {
          event.preventDefault();
          if (event.which === KeyConstants.left || event.which === KeyConstants.up) {
            EditorActor.updatePoint(vector.startPoint);
          } else {
            EditorActor.updatePoint(vector.endPoint);
          }
        }
      }
    }
  }

  handleKeyPress(event) {
    if (EditorStore.mouseState === TypeConstants.mouse.move) {
      event.preventDefault();
      var selection = window.getSelection();
      var vector = Selector.generateVector(selection);

      if (event.which === KeyConstants.enter) {
        EditorActor.splitBlocks(vector);
      } else {
        if (event.ctrlKey || event.metaKey) {
          switch (event.which) {
            case KeyConstants.b:
              EditorActor.styleElements(vector, TypeConstants.element.bold);
              break;
            case KeyConstants.i:
              EditorActor.styleElements(vector, TypeConstants.element.italic);
              break;
          }
        } else {
          var character = String.fromCharCode(event.which);
          EditorActor.removeBlocks(vector, character);
        }
      }
    }
  }

  handleMouseDown(event) {
    EditorActor.updateMouseState(TypeConstants.mouse.down);
  }

  handleMouseUp(event) {
    var selection = window.getSelection();
    if (EditorStore.mouseState === TypeConstants.mouse.move) {
      var vector = Selector.generateVector(selection);
      EditorActor.updateVector(vector);
    } else if (EditorStore.mouseState === TypeConstants.mouse.down) {
      EditorActor.updateMouseState(TypeConstants.mouse.up)
      EditorActor.updateVector(null);
    }
  }

  componentDidMount() {
    super.componentDidMount();
    var node = React.findDOMNode(this.refs.page);
    document.addEventListener("keydown", this.handleKeyDown.bind(this));
    document.addEventListener("keypress", this.handleKeyPress.bind(this));
    node.addEventListener("mousedown", this.handleMouseDown.bind(this));
    node.addEventListener("mouseup", this.handleMouseUp.bind(this));
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    var node = React.findDOMNode(this.refs.page);
    document.removeEventListener("keydown", this.handleKeyDown);
    document.removeEventListener("keypress", this.handleKeyPress);
    node.removeEventListener("mousedown", this.handleMouseDown);
    node.removeEventListener("mouseup", this.handleMouseUp);
  }

  render() {
    return (
      <div className={"editor-page"} ref="page">
        <StoryEditable
          point={this.state.point}
          shouldEnableEdits={this.state.shouldEnableEdits}
          story={this.state.story} />
        <StyleModal
          activeStyles={this.state.activeStyles}
          vector={this.state.vector} />
      </div>
    );
  }
}


module.exports = EditorPage;
