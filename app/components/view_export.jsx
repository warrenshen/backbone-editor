import React from "react";

import Component from "app/templates/component";

import StoryExport from "app/components/export/story_export";

import EditorStore from "app/stores/editor_store";


class ViewExport extends Component {

  // --------------------------------------------------
  // State
  // --------------------------------------------------
  getStoreState() {
    return { story: EditorStore.story };
  }

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  render() {
    return (
      <div className={"general-view"} ref={"view"}>
        <pre className={"pre-container"}>
          <StoryExport
            story={this.state.story} />
        </pre>
      </div>
    );
  }
}


module.exports = ViewExport;
