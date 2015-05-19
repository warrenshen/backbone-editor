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
    console.log(this.state.story);
    return (
      <div style={this.styles.container}>
        Welcome to the editor page.
        <StoryComponent story={this.state.story} />
      </div>
    );
  }

  set styles(styles) {}
  get styles() {
    return {
      container: {
        position: "relative",
        width: "100%",
        padding: "172px 0",
      },
    };
  }
}


module.exports = EditorPage;
