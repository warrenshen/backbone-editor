import React from "react";
import ListeningComponent from "app/templates/listening_component";

import StoryEditable from "app/components/story_editable";
import StyleModal from "app/components/style_modal";

import EditorStore from "app/stores/editor_store";


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

  render() {
    return (
      <div className={"general-page"}>
        <StoryEditable
          point={this.state.point}
          story={this.state.story}
          vector={this.state.vector} />
      </div>
    );
  }
}


module.exports = EditorPage;
