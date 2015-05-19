import React from "react";
import ListeningComponent from "app/templates/listening_component";

import StoryComponent from "app/components/story";


class EditorPage extends ListeningComponent {

  render() {
    return (
      <div style={this.styles.container}>
        Welcome to the editor page.
        <StoryComponent />
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
