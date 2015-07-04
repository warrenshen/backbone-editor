import React from "react";

import Component from "app/templates/component";

import Clickable from "app/components/clickable";
import ViewEdit from "app/components/view_edit";
import ViewExport from "app/components/view_export";

import KeyConstants from "app/constants/key_constants";
import TypeConstants from "app/constants/type_constants";


class ViewContainer extends Component {

  // --------------------------------------------------
  // State
  // --------------------------------------------------
  getDefaultState() {
    return { viewType: TypeConstants.view.edit };
  }

  selectEdit() {
    if (this.state.viewType !== TypeConstants.view.edit) {
      this.setState({ viewType: TypeConstants.view.edit });
    }
  }

  selectExport() {
    if (this.state.viewType !== TypeConstants.view.export) {
      this.setState({ viewType: TypeConstants.view.export });
    }
  }

  // --------------------------------------------------
  // Handlers
  // --------------------------------------------------
  handleKeyDown(event) {
    if (event.which === KeyConstants.backspace) {
      var shouldPrevent = !confirm("Are you sure you want to leave this page?");
      if (shouldPrevent) {
        event.preventDefault();
      }
    }
  }

  // --------------------------------------------------
  // Lifecycle
  // --------------------------------------------------
  componentDidMount() {
    var node = React.findDOMNode(this.refs.view);
    document.addEventListener("keydown", this.handleKeyDown.bind(this));
  }

  componentWillUnmount() {
    var node = React.findDOMNode(this.refs.view);
    document.removeEventListener("keydown", this.handleKeyDown);
  }

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  renderButton(props, index) {
    var className = "view-button";
    className += (props.isSelected) ? " view-button-selected" : "";
    return (
      <Clickable
        action={props.action}
        className={className}
        content={props.content}
        key={index} />
    );
  }

  renderButtons() {
    return [
      {
        action: this.selectEdit.bind(this),
        content: TypeConstants.view.edit,
        isSelected: this.state.viewType === TypeConstants.view.edit,
      },
      {
        action: this.selectExport.bind(this),
        content: TypeConstants.view.export,
        isSelected: this.state.viewType === TypeConstants.view.export,
      },
    ].map(this.renderButton, this);
  }

  renderView() {
    switch (this.state.viewType) {
      case TypeConstants.view.edit:
        return <ViewEdit />;
      case TypeConstants.view.export:
        return <ViewExport />;
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
