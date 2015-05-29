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

  // TODO: Should and can we just use es6 getters here?
  getDefaultState() {
    // TODO: Do we really need to track content and modal states?
    return _.merge(
      {
        shouldEnableEdits: true,
        shouldUpdateContent: true,
        shouldUpdateModal: true,
      },
      super.getDefaultState()
    );
  }

  getStoreState() {
    return {
      activeStyles: EditorStore.activeStyles,
      point: EditorStore.point,
      story: EditorStore.story,
      vector: EditorStore.vector,
    }
  }

  enableEdits() {
    this.setState({ shouldEnableEdits: true });
  }

  disableEdits() {
    this.setState({ shouldEnableEdits: false });
  }

  updateContent() {
    this.setState({ shouldUpdateContent: true });
  }

  downdateContent() {
    this.setState( { shouldUpdateContent: false });
  }

  updateModal() {
    this.setState({ shouldUpdateModal: true });
  }

  downdateModal() {
    this.setState({ shouldUpdateModal: false });
  }

  handleMouseDown(event) {
    EditorActor.updateMouseState(TypeConstants.mouse.down);
  }

  handleKeyDown(event) {
    event.stopPropagation();
    var selection = window.getSelection();

    if (EditorStore.mouseState === TypeConstants.mouse.move) {
      if (event.which === KeyConstants.backspace) {
        event.preventDefault();
        var vector = Selector.generateVector(selection);
        EditorActor.removeSelection(vector);
      } else if (event.which >= KeyConstants.left && event.which <= KeyConstants.down) {
        if (!event.shiftKey) {
          event.preventDefault();
          var vector = Selector.generateVector(selection);

          this.enableEdits();
          if (event.which === KeyConstants.left || event.which === KeyConstants.up) {
            EditorActor.updatePoint(vector.startPoint);
          } else {
            EditorActor.updatePoint(vector.endPoint);
          }
        }
      }
    }
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
    node.addEventListener("mousedown", this.handleMouseDown.bind(this));
    node.addEventListener("mouseup", this.handleMouseUp.bind(this));
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    var node = React.findDOMNode(this.refs.page);
    document.removeEventListener("keydown", this.handleKeyDown);
    node.removeEventListener("mousedown", this.handleMouseDown);
    node.removeEventListener("mouseup", this.handleMouseUp);
  }

  render() {
    return (
      <div className={"editor-page"} ref="page">
        <StoryEditable
          disableEdits={this.disableEdits.bind(this)}
          enableEdits={this.enableEdits.bind(this)}
          point={this.state.point}
          shouldEnableEdits={this.state.shouldEnableEdits}
          shouldUpdateContent={this.state.shouldUpdateContent}
          story={this.state.story} />
        <StyleModal
          shouldUpdateModal={this.state.shouldUpdateModal}
          activeStyles={this.state.activeStyles}
          vector={this.state.vector} />
      </div>
    );
  }
}


module.exports = EditorPage;
