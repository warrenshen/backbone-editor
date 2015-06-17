import React from "react";

import Component from "app/templates/component";

import LinkModal from "app/components/link_modal";
import StoryEditable from "app/components/story_editable";
import StyleModal from "app/components/style_modal";

import Block from "app/models/block";

import EditorStore from "app/stores/editor_store";

import EditorActor from "app/actors/editor_actor";

import Paster from "app/helpers/paster";
import Selector from "app/helpers/selector";

import KeyConstants from "app/constants/key_constants";
import TypeConstants from "app/constants/type_constants";


class EditorPage extends Component {

  // --------------------------------------------------
  // Defaults
  // --------------------------------------------------
  displayName() {
    return "EditorPage";
  }

  // --------------------------------------------------
  // State
  // --------------------------------------------------
  getDefaultState() {
    return {
      shouldUpdateLinker: false,
      shouldUpdateStyler: false,
      shouldUpdateStory: false,
    };
  }

  getStoreState() {
    return {
      activeStyles: EditorStore.activeStyles,
      link: EditorStore.link,
      point: EditorStore.point,
      shouldEnableEdits: EditorStore.mouseState === TypeConstants.mouse.up,
      story: EditorStore.story,
      vector: EditorStore.vector,
    }
  }

  updateLinker() {
    this.setState({
      shouldUpdateLinker: true,
      shouldUpdateStory: false,
      shouldUpdateStyler: false,
    });
  }

  updateStates() {
    this.setState({
      shouldUpdateLinker: false,
      shouldUpdateStory: true,
      shouldUpdateStyler: true,
    });
  }

  updateStory() {
    this.setState({
      shouldUpdateLinker: false,
      shouldUpdateStory: true,
      shouldUpdateStyler: false,
    });
  }

  updateStyler() {
    this.setState({
      shouldUpdateLinker: false,
      shouldUpdateStory: false,
      shouldUpdateStyler: true,
    });
  }

  // --------------------------------------------------
  // Handlers
  // --------------------------------------------------
  handleKeyDown(event) {
    var selection = window.getSelection();

    if (event.which === KeyConstants.backspace) {
      event.preventDefault();
    }

    if (selection.type === TypeConstants.selection.range) {
      var vector = Selector.generateVector(selection);

      if (event.which >= KeyConstants.left &&
        event.which <= KeyConstants.down) {
        if (event.shiftKey) {
          var mouseState = EditorStore.mouseState;

          EditorActor.updateVector(vector);

          if (mouseState !== TypeConstants.mouse.move) {
            this.updateStory();
          }

          this.updateStyler();
        } else {
          event.preventDefault();

          if (event.which === KeyConstants.left ||
              event.which === KeyConstants.up) {
            EditorActor.updatePoint(vector.startPoint);
          } else {
            EditorActor.updatePoint(vector.endPoint);
          }

          this.updateStates();
        }
      } else if (event.which === KeyConstants.backspace) {
        EditorActor.removeBlocks(vector);
        this.updateStates();
      }
    }
  }

  handleKeyPress(event) {
    if (EditorStore.mouseState === TypeConstants.mouse.move) {
      event.preventDefault();

      var selection = window.getSelection();
      var vector = Selector.generateVector(selection);

      if (event.which === KeyConstants.enter) {
        EditorActor.removeBlocks(vector, { enter: true });
        this.updateStates();
      } else {
        if (event.ctrlKey || event.metaKey) {
          if (event.which === KeyConstants.b) {
            EditorActor.styleElements(vector, TypeConstants.element.bold);
            this.updateStates();
          } else if (event.which === KeyConstants.i) {
            EditorActor.styleElements(vector, TypeConstants.element.italic);
            this.updateStates();
          }
        } else {
          var character = String.fromCharCode(event.which);

          EditorActor.removeBlocks(vector, { character: character });
          this.updateStates();
        }
      }
    }
  }

  handleMouseDown(event) {
    EditorActor.updateMouseState(TypeConstants.mouse.down);
  }

  handleMouseUp(event) {
    if (EditorStore.mouseState === TypeConstants.mouse.move) {
      var selection = window.getSelection();
      var vector = Selector.generateVector(selection);

      EditorActor.updateVector(vector);
      this.updateStyler();
    } else {
      EditorActor.updatePoint(null);
      this.updateStyler();
    }
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
        this.updateStory();
      }
    }
  }

  handleScroll(event) {
    if (EditorStore.vector) {
      this.updateStyler();
    }
  }

  handleResize(event) {
    if (EditorStore.vector) {
      this.updateStyler();
    }
  }

  // --------------------------------------------------
  // Lifecycle
  // --------------------------------------------------
  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyDown.bind(this));
    document.addEventListener("keypress", this.handleKeyPress.bind(this));
    document.addEventListener("paste", this.handlePaste.bind(this));

    window.addEventListener("scroll", this.handleScroll.bind(this));
    window.addEventListener("resize", this.handleResize.bind(this));

    var page = React.findDOMNode(this.refs.page);
    page.addEventListener("mousedown", this.handleMouseDown.bind(this));
    page.addEventListener("mouseup", this.handleMouseUp.bind(this));
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyDown);
    document.removeEventListener("keypress", this.handleKeyPress);
    document.removeEventListener("paste", this.handlePaste);

    window.removeEventListener("scroll", this.handleScroll);
    window.removeEventListener("resize", this.handleResize);

    var page = React.findDOMNode(this.refs.page);
    page.removeEventListener("mousedown", this.handleMouseDown);
    page.removeEventListener("mouseup", this.handleMouseUp);
  }

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  render() {
    return (
      <div className={"general-page"} ref={"page"}>
        <StoryEditable
          point={this.state.point}
          shouldEnableEdits={this.state.shouldEnableEdits}
          shouldUpdateStory={this.state.shouldUpdateStory}
          story={this.state.story}
          updateLinker={this.updateLinker.bind(this)}
          updateStates={this.updateStates.bind(this)}
          updateStory={this.updateStory.bind(this)}
          updateStyler={this.updateStyler.bind(this)} />
        <StyleModal
          activeStyles={this.state.activeStyles}
          point={this.state.point}
          shouldUpdateStyler={this.state.shouldUpdateStyler}
          updateStates={this.updateStates.bind(this)}
          vector={this.state.vector} />
        <LinkModal
          link={this.state.link}
          shouldUpdateLinker={this.state.shouldUpdateLinker} />
      </div>
    );
  }
}


module.exports = EditorPage;
