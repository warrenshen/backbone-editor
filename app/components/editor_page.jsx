import React from "react";
import ListeningComponent from "app/templates/listening_component";

import StoryEditable from "app/components/story_editable";

import EditorStore from "app/stores/editor_store";


class EditorPage extends ListeningComponent {

  stores() {
    return [EditorStore];
  }

  getStoreState() {
    return {
      story: EditorStore.getCurrent(),
    }
  }

  render() {
    return (
      <div className={"general-page"}>
        <StoryEditable story={this.state.story} />
      </div>
    );
  }
}


module.exports = EditorPage;
