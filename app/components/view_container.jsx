import React from "react";

import Component from "app/templates/component";

import Clickable from "app/components/clickable";
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

  selectEditor() {
    if (this.state.viewType !== "editor") {
      this.setState({ viewType: "editor" });
    }
  }

  selectPreview() {
    if (this.state.viewType !== "preview") {
      this.setState({ viewType: "preview" });
    }
  }

  selectTemplate() {
    if (this.state.viewType !== "template") {
      this.setState({ viewType: "template" });
    }
  }

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  renderButton(props, index) {
    var className = "general-button";
    className += (props.isSelected) ? " general-button-selected" : "";

    return (
      <Clickable
        key={index}
        action={props.action}
        className={className}
        content={props.content} />
    );
  }

  renderButtons() {
    return [
      {
        action: this.selectEditor.bind(this),
        content: "write",
        isSelected: this.state.viewType === "editor",
      },
      {
        action: this.selectPreview.bind(this),
        content: "preview",
        isSelected: this.state.viewType === "preview",
      },
      {
        action: this.selectTemplate.bind(this),
        content: "export",
        isSelected: this.state.viewType === "template",
      },
    ].map(this.renderButton, this);
  }

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
      <div className={"view-container"}>
        <div className={"view-buttons"}>
          {this.renderButtons()}
        </div>
        {this.renderView()}
      </div>
    );
  }
}


module.exports = ViewContainer;
