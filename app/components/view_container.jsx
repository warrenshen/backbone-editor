import React from "react";

import Component from "app/templates/component";

import EditorView from "app/components/editor_view";
import TemplateView from "app/components/template_view";


class ViewContainer extends Component {

  // --------------------------------------------------
  // Defaults
  // --------------------------------------------------
  displayName() {
    return "ViewContainer";
  }

  // --------------------------------------------------
  // State
  // --------------------------------------------------
  getDefaultState() {
    return { viewType: "editor" };
  }

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  renderView() {
    switch (this.state.viewType) {
      case "editor":
        return <EditorView />;
      case "template":
        return <TemplateView />;
    }
  }

  render() {
    return (
      <div className={"view-container"} ref={"page"}>
        {this.renderView()}
      </div>
    );
  }
}


module.exports = ViewContainer;
