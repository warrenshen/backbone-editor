import React from "react";
import ListeningComponent from "app/templates/listening_component";

import StoryComponent from "app/components/story";

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
        <StoryComponent story={this.state.story} />
      </div>
    );
  }
}


module.exports = EditorPage;
