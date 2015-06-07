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

  getDefaultState() {
    return _.merge(
      {},
      { shouldUpdateStory: false },
      this.getStoreState()
    );
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

  updateStory() {
    this.setState({ shouldUpdateStory: true });
    this.setState({ shouldUpdateStory: false });
  }

  handleKeyDown(event) {
    var selection = window.getSelection();
    // We use selection.type === "Range" check when
    // checking for arrow key events because they can
    // happen without changing the store's mouse state.
    if (event.shiftKey) {
      if (selection.type === TypeConstants.selection.range &&
          event.which >= KeyConstants.left &&
          event.which <= KeyConstants.down) {
        var vector = Selector.generateVector(selection);
        EditorActor.updateVector(vector);
        this.updateStory();
      }
    } else if (EditorStore.mouseState === TypeConstants.mouse.move) {
      if (event.which === KeyConstants.backspace) {
        event.preventDefault();
        var vector = Selector.generateVector(selection);

        EditorActor.removeBlocks(vector);
        this.updateStory();
      } else if (event.which >= KeyConstants.left && event.which <= KeyConstants.down) {
        event.preventDefault();
        var vector = Selector.generateVector(selection);

        if (event.which === KeyConstants.left || event.which === KeyConstants.up) {
          EditorActor.updatePoint(vector.startPoint);
        } else {
          EditorActor.updatePoint(vector.endPoint);
        }

        this.updateStory();
      }
    }
  }

  handleKeyPress(event) {
    if (EditorStore.mouseState === TypeConstants.mouse.move) {
      event.preventDefault();
      var selection = window.getSelection();
      var vector = Selector.generateVector(selection);

      if (event.which === KeyConstants.enter) {
        EditorActor.removeBlocks(vector, { enter: true });
        this.updateStory();
      } else {
        if (event.ctrlKey || event.metaKey) {
          switch (event.which) {
            case KeyConstants.b:
              EditorActor.styleElements(vector, TypeConstants.element.bold);
              this.updateStory();
              break;
            case KeyConstants.i:
              EditorActor.styleElements(vector, TypeConstants.element.italic);
              this.updateStory();
              break;
          }
        } else {
          var character = String.fromCharCode(event.which);
          EditorActor.removeBlocks(vector, { character: character });
          this.updateStory();
        }
      }
    }
  }

  handleKeyUp(event) {
    var selection = window.getSelection();
    if (event.shiftKey &&
        selection.type === TypeConstants.selection.range &&
        event.which >= KeyConstants.left &&
        event.which <= KeyConstants.down) {
      var vector = Selector.generateVector(selection);
      EditorActor.updateVector(vector);
      this.updateStory();
    }
  }

  handleMouseDown(event) {
    // Only update mouse state if the store has a vector,
    // because we don't want possibly hide a media modal.
    if (EditorStore.vector != null) {
      EditorActor.updateMouseState(TypeConstants.mouse.down);
    }
  }

  handleMouseUp(event) {
    var selection = window.getSelection();
    if (EditorStore.mouseState === TypeConstants.mouse.move) {
      var vector = Selector.generateVector(selection);
      EditorActor.updateVector(vector);
      this.updateStory();
    } else if (EditorStore.mouseState === TypeConstants.mouse.down) {
      EditorActor.updateMouseState(TypeConstants.mouse.up)
      EditorActor.updateVector(null);
      this.updateStory();
    }
  }

  componentDidMount() {
    super.componentDidMount();
    var page = React.findDOMNode(this.refs.page);
    document.addEventListener("keydown", this.handleKeyDown.bind(this));
    document.addEventListener("keypress", this.handleKeyPress.bind(this));
    document.addEventListener("keyup", this.handleKeyUp.bind(this));
    page.addEventListener("mousedown", this.handleMouseDown.bind(this));
    page.addEventListener("mouseup", this.handleMouseUp.bind(this));
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    var page = React.findDOMNode(this.refs.page);
    document.removeEventListener("keydown", this.handleKeyDown);
    document.removeEventListener("keypress", this.handleKeyPress);
    document.removeEventListener("keyup", this.handleKeyUp);
    page.removeEventListener("mousedown", this.handleMouseDown);
    page.removeEventListener("mouseup", this.handleMouseUp);
  }

  render() {
    return (
      <div className={"editor-page"} ref="page">
        <StoryEditable
          point={this.state.point}
          shouldEnableEdits={this.state.shouldEnableEdits}
          shouldUpdateStory={this.state.shouldUpdateStory}
          story={this.state.story}
          updateStory={this.updateStory.bind(this)} />
        <StyleModal
          activeStyles={this.state.activeStyles}
          updateStory={this.updateStory.bind(this)}
          vector={this.state.vector} />
      </div>
    );
  }
}


module.exports = EditorPage;
