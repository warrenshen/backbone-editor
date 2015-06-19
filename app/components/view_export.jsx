import React from "react";

import Component from "app/templates/component";

import StoryCode from "app/components/export/story_code";

import EditorStore from "app/stores/editor_store";


class ViewExport extends Component {

  // --------------------------------------------------
  // Defaults
  // --------------------------------------------------
  displayName() {
    return "ViewExport";
  }

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
        <pre>
          <StoryCode story={this.state.story} />
        </pre>
      </div>
    );
  }
}


module.exports = ViewExport;
