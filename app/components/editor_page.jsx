import _ from "lodash";
import React from "react";
import ListeningComponent from "app/templates/listening_component";

import StoryEditable from "app/components/story_editable";
import StyleModal from "app/components/style_modal";

import EditorStore from "app/stores/editor_store";

import EditorActor from "app/actors/editor_actor";

import Selector from "app/helpers/selector";


class EditorPage extends ListeningComponent {

  stores() {
    return [EditorStore];
  }

  // TODO: Should we just use es6 getters here?
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
    // TODO: Maybe we should turn this into an action that
    // does not emit any change (to not be an anti-pattern).
    EditorStore.mouse = "Down";
  }

  handleMouseUp(event) {
    var selection = window.getSelection();
    if (EditorStore.mouse === "Move") {
      var vector = Selector.generateVector(selection);
      EditorActor.updateVector(vector);
    } else if (EditorStore.mouse === "Down") {
      EditorStore.mouse === "Up";
      EditorActor.updateVector(null);
    }
  }

  componentDidMount() {
    super.componentDidMount();
    var node = React.findDOMNode(this.refs.page);
    node.addEventListener("mousedown", this.handleMouseDown.bind(this));
    node.addEventListener("mouseup", this.handleMouseUp.bind(this));
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    var node = React.findDOMNode(this.refs.page);
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
          vector={this.state.vector} />
      </div>
    );
  }
}


module.exports = EditorPage;
