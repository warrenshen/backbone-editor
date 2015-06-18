import React from "react";

import Component from "app/templates/component";

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
          <code>
            {this.state.story.toCode()}
          </code>
        </pre>
      </div>
    );
  }
}


module.exports = ViewExport;
