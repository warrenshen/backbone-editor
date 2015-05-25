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

  getStoreState() {
    return {
      point: EditorStore.getPoint(),
      story: EditorStore.getStory(),
      vector: EditorStore.getVector(),
    }
  }

  handleMouseUp(event) {
    console.log("page mouse up");
    var selection = window.getSelection();
    if (selection.type === "Range") {
      var vector = Selector.generateVector(selection);
      EditorActor.updateVector(vector);
    }
  }

  componentDidMount() {
    super.componentDidMount();
    var node = React.findDOMNode(this.refs.page);
    node.addEventListener("mouseup", this.handleMouseUp.bind(this));
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    var node = React.findDOMNode(this.refs.page);
    node.removeEventListener("mouseup", this.handleMouseUp);
  }

  render() {
    return (
      <div className={"general-page"} ref="page">
        <StoryEditable
          point={this.state.point}
          story={this.state.story} />
        <StyleModal
          vector={this.state.vector} />
      </div>
    );
  }
}


module.exports = EditorPage;
