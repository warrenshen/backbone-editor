import _ from "lodash";
import React from "react";

import ListeningComponent from "app/templates/listening_component";

import LinkModa from "app/components/link_modal";
import StoryEditable from "app/components/story_editable";
import StyleModal from "app/components/style_modal";

import EditorStore from "app/stores/editor_store";

import EditorActor from "app/actors/editor_actor";

import Selector from "app/helpers/selector";

import KeyConstants from "app/constants/key_constants";
import TypeConstants from "app/constants/type_constants";


class EditorPage extends ListeningComponent {

  // --------------------------------------------------
  // Defaults
  // --------------------------------------------------
  stores() {
    return [EditorStore];
  }

  // --------------------------------------------------
  // State
  // --------------------------------------------------
  getDefaultState() {
    return _.merge(
      {},
      {
        shouldUpdateStyler: false,
        shouldUpdateStory: false,
      },
      super.getDefaultState()
    );
  }

  getStoreState() {
    return {
      activeStyles: EditorStore.activeStyles,
      point: EditorStore.point,
      shouldEnableEdits: EditorStore.mouseState === TypeConstants.mouse.up,
      story: EditorStore.story,
      vector: EditorStore.vector,
    }
  }

  updateStates() {
    this.setState({
      shouldUpdateStory: true,
      shouldUpdateStyler: true,
    });

    this.setState({
      shouldUpdateStory: false,
      shouldUpdateStyler: false,
    });
  }

  updateStory() {
    this.setState({ shouldUpdateStory: true });
    this.setState({ shouldUpdateStory: false });
  }

  updateStyler() {
    this.setState({ shouldUpdateStyler: true });
    this.setState({ shouldUpdateStyler: false });
  }

  // --------------------------------------------------
  // Handlers
  // --------------------------------------------------
  handleKeyDown(event) {
    var selection = window.getSelection();
    // We use selection.type === "Range" check when
    // checking for arrow key events because they can
    // happen without changing the store's mouse state.
    if (event.shiftKey) {
      if (selection.type === TypeConstants.selection.range &&
          event.which >= KeyConstants.left &&
          event.which <= KeyConstants.down) {
        var mouseState = EditorStore.mouseState;
        var vector = Selector.generateVector(selection);
        EditorActor.updateVector(vector);

        if (mouseState !== TypeConstants.mouse.move) {
          this.updateStory();
        }
        this.updateStyler();
      }
    } else if (EditorStore.mouseState === TypeConstants.mouse.move) {
      if (event.which === KeyConstants.backspace) {
        event.preventDefault();
        var vector = Selector.generateVector(selection);

        EditorActor.removeBlocks(vector);
        this.updateStates();
      } else if (event.which >= KeyConstants.left && event.which <= KeyConstants.down) {
        event.preventDefault();
        var vector = Selector.generateVector(selection);

        if (event.which === KeyConstants.left || event.which === KeyConstants.up) {
          EditorActor.updatePoint(vector.startPoint);
        } else {
          EditorActor.updatePoint(vector.endPoint);
        }

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
          switch (event.which) {
            case KeyConstants.b:
              EditorActor.styleElements(vector, TypeConstants.element.bold);
              this.updateStates();
              break;
            case KeyConstants.i:
              EditorActor.styleElements(vector, TypeConstants.element.italic);
              this.updateStates();
              break;
          }
        } else {
          var character = String.fromCharCode(event.which);
          EditorActor.removeBlocks(vector, { character: character });
          this.updateStates();
        }
      }
    }
  }

  handleKeyUp(event) {
    var selection = window.getSelection();
    if (event.shiftKey &&
        selection.type === TypeConstants.selection.range &&
        event.which >= KeyConstants.left &&
        event.which <= KeyConstants.down) {
      var mouseState = EditorStore.mouseState;
      var vector = Selector.generateVector(selection);
      EditorActor.updateVector(vector);

      if (mouseState !== TypeConstants.mouse.move) {
        this.updateStory();
      }
      this.updateStyler();
    }
  }

  handleMouseDown(event) {
    // Only update mouse state if the store has a vector,
    // because we don't want possibly hide a media modal.
    if (EditorStore.vector != null) {
      EditorActor.updateMouseState(TypeConstants.mouse.down);
    }
  }

  handleMouseUp(event) {
    var selection = window.getSelection();
    if (EditorStore.mouseState === TypeConstants.mouse.move) {
      var vector = Selector.generateVector(selection);
      EditorActor.updateVector(vector);
      this.updateStyler();
    } else if (EditorStore.mouseState === TypeConstants.mouse.down) {
      EditorActor.updateMouseState(TypeConstants.mouse.up)
      EditorActor.updateVector(null);
      this.updateStyler();
    }
  }

  handleScroll(event) {
    this.updateStyler();
  }

  handleResize(event) {
    this.updateStyler();
  }

  // --------------------------------------------------
  // Lifecycle
  // --------------------------------------------------
  componentDidMount() {
    super.componentDidMount();
    var page = React.findDOMNode(this.refs.page);
    document.addEventListener("keydown", this.handleKeyDown.bind(this));
    document.addEventListener("keypress", this.handleKeyPress.bind(this));
    document.addEventListener("keyup", this.handleKeyUp.bind(this));
    page.addEventListener("mousedown", this.handleMouseDown.bind(this));
    page.addEventListener("mouseup", this.handleMouseUp.bind(this));
    window.addEventListener("scroll", this.handleScroll.bind(this));
    window.addEventListener("resize", this.handleResize.bind(this));
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    var page = React.findDOMNode(this.refs.page);
    document.removeEventListener("keydown", this.handleKeyDown);
    document.removeEventListener("keypress", this.handleKeyPress);
    document.removeEventListener("keyup", this.handleKeyUp);
    page.removeEventListener("mousedown", this.handleMouseDown);
    page.removeEventListener("mouseup", this.handleMouseUp);
    window.removeEventListener("scroll", this.handleScroll);
    window.removeEventListener("resize", this.handleResize);
  }

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  render() {
    return (
      <div className={"editor-page"} ref={"page"}>
        <StoryEditable
          point={this.state.point}
          shouldEnableEdits={this.state.shouldEnableEdits}
          shouldUpdateStory={this.state.shouldUpdateStory}
          story={this.state.story}
          updateStates={this.updateStates.bind(this)}
          updateStory={this.updateStory.bind(this)}
          updateStyler={this.updateStyler.bind(this)} />
        <StyleModal
          activeStyles={this.state.activeStyles}
          shouldUpdateStyler={this.state.shouldUpdateStyler}
          updateStates={this.updateStates.bind(this)}
          vector={this.state.vector} />
      </div>
    );
  }
}


module.exports = EditorPage;
