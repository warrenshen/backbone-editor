import React from "react";

import Component from "app/templates/component";

import StoryEditable from "app/components/edit/story_editable";
import ModalLink from "app/components/edit/modal_link";
import ModalStyle from "app/components/edit/modal_style";

import Block from "app/models/block";

import EditorStore from "app/stores/editor_store";

import EditorActor from "app/actors/editor_actor";

import Paster from "app/helpers/paster";
import Selector from "app/helpers/selector";

import KeyConstants from "app/constants/key_constants";
import TypeConstants from "app/constants/type_constants";


class ViewEdit extends Component {

  // --------------------------------------------------
  // Defaults
  // --------------------------------------------------
  displayName() {
    return "ViewEdit";
  }

  // --------------------------------------------------
  // State
  // --------------------------------------------------
  getDefaultState() {
    return {
      shouldUpdateModalLink: false,
      shouldUpdateModalStyle: false,
      shouldUpdateStoryEditable: false,
    };
  }

  getStoreState() {
    return {
      activeStyles: EditorStore.activeStyles,
      link: EditorStore.link,
      point: EditorStore.point,
      story: EditorStore.story,
      vector: EditorStore.vector,
    };
  }

  updateModalLink() {
    this.setState({
      shouldUpdateModalLink: true,
      shouldUpdateModalStyle: false,
      shouldUpdateStoryEditable: false,
    });
  }

  updateModalStyle() {
    this.setState({
      shouldUpdateModalLink: false,
      shouldUpdateModalStyle: true,
      shouldUpdateStoryEditable: false,
    });
  }

  updateStoryStyle() {
    this.setState({
      shouldUpdateModalLink: false,
      shouldUpdateModalStyle: true,
      shouldUpdateStoryEditable: true,
    });
  }

  updateStoryEditable() {
    this.setState({
      shouldUpdateModalLink: false,
      shouldUpdateModalStyle: false,
      shouldUpdateStoryEditable: true,
    });
  }

  // --------------------------------------------------
  // Handlers
  // --------------------------------------------------
  handleKeyDown(event) {
    if (event.which === KeyConstants.backspace) {
      event.preventDefault();
    }
  }

  handleMouseUp(event) {
    var selection = window.getSelection();

    setTimeout(function() {
      if (selection.type === TypeConstants.selection.caret) {
        var point = Selector.generatePoint(selection);
        EditorActor.updatePoint(point);
        this.updateStoryStyle();
      } else if (selection.type === TypeConstants.selection.range) {
        var vector = Selector.generateVector(selection);
        console.log(vector);
        EditorActor.updateVector(vector);
        this.updateModalStyle();
      }
    }.bind(this), 25);
  }

  handlePaste(event) {
    // TODO: Set up support for pasting with active selection.
    var selection = window.getSelection();
    var point = Selector.generatePoint(selection);

    if (point) {
      event.preventDefault();

      var html = event.clipboardData.getData("text/html");
      var container = document.createElement("div");

      container.innerHTML = html;

      if (Paster.parseContainer(container, point)) {
        this.updateStoryEditable();
      }
    }
  }

  handleScroll(event) {
    if (EditorStore.vector) {
      this.updateModalStyle();
    }
  }

  handleResize(event) {
    if (EditorStore.vector) {
      this.updateModalStyle();
    }
  }

  // --------------------------------------------------
  // Lifecycle
  // --------------------------------------------------
  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyDown.bind(this));
    document.addEventListener("paste", this.handlePaste.bind(this));

    window.addEventListener("scroll", this.handleScroll.bind(this));
    window.addEventListener("resize", this.handleResize.bind(this));

    var node = React.findDOMNode(this.refs.view);
    node.addEventListener("mouseup", this.handleMouseUp.bind(this));
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyDown);
    document.removeEventListener("paste", this.handlePaste);

    window.removeEventListener("scroll", this.handleScroll);
    window.removeEventListener("resize", this.handleResize);

    var node = React.findDOMNode(this.refs.view);
    node.removeEventListener("mouseup", this.handleMouseUp);
  }

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  render() {
    console.log("view edit rerendering");
    return (
      <div className={"general-view"} ref={"view"}>
        <StoryEditable
          point={this.state.point}
          shouldUpdate={this.state.shouldUpdateStoryEditable}
          story={this.state.story}
          updateModalLink={this.updateModalLink.bind(this)}
          updateModalStyle={this.updateModalStyle.bind(this)}
          updateStoryStyle={this.updateStoryStyle.bind(this)}
          updateStoryEditable={this.updateStoryEditable.bind(this)} />
        <ModalStyle
          activeStyles={this.state.activeStyles}
          point={this.state.point}
          shouldUpdate={this.state.shouldUpdateModalStyle}
          updateStoryStyle={this.updateStoryStyle.bind(this)}
          vector={this.state.vector} />
        <ModalLink
          link={this.state.link}
          shouldUpdate={this.state.shouldUpdateModalLink} />
      </div>
    );
  }
}


module.exports = ViewEdit;
