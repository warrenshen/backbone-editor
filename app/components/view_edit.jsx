import React from "react";

import Component from "app/templates/component";

import ModalLink from "app/components/edit/modal_link";
import ModalStyle from "app/components/edit/modal_style";
import StoryEdit from "app/components/edit/story_edit";

import EditorStore from "app/stores/editor_store";

import EditorActor from "app/actors/editor_actor";

import Paster from "app/helpers/paster";
import Selector from "app/helpers/selector";

import TypeConstants from "app/constants/type_constants";


class ViewEdit extends Component {

  // --------------------------------------------------
  // State
  // --------------------------------------------------
  getDefaultState() {
    return {
      shouldUpdateModalLink: false,
      shouldUpdateModalStyle: false,
      shouldUpdateStoryEdit: false,
    };
  }

  getStoreState() {
    return {
      link: EditorStore.link,
      point: EditorStore.point,
      story: EditorStore.story,
      styles: EditorStore.styles,
      vector: EditorStore.vector,
    };
  }

  updateModalLink() {
    this.setState({
      shouldUpdateModalLink: true,
      shouldUpdateModalStyle: false,
      shouldUpdateStoryEdit: false,
    });
  }

  updateModalStyle() {
    this.setState({
      shouldUpdateModalLink: false,
      shouldUpdateModalStyle: true,
      shouldUpdateStoryEdit: false,
    });
  }

  updateStoryStyle() {
    this.setState({
      shouldUpdateModalLink: false,
      shouldUpdateModalStyle: true,
      shouldUpdateStoryEdit: true,
    });
  }

  updateStoryEdit() {
    this.setState({
      shouldUpdateModalLink: false,
      shouldUpdateModalStyle: false,
      shouldUpdateStoryEdit: true,
    });
  }

  // --------------------------------------------------
  // Handlers
  // --------------------------------------------------
  handleMouseUp(event) {
    var selection = window.getSelection();
    setTimeout(function() {
      if (selection.type === TypeConstants.selection.caret) {
        var point = Selector.generatePoint(selection);
        if (!EditorStore.point ||
            point.compareShallowly(EditorStore.point) ||
            EditorStore.vector) {
          EditorActor.updatePoint(point);
          this.updateStoryStyle();
        }
      } else if (selection.type === TypeConstants.selection.range) {
        var vector = Selector.generateVector(selection);
        EditorActor.updateVector(vector);
        this.updateModalStyle();
      }
    }.bind(this), 25);
  }

  handlePaste(event) {
    var point = false;
    var selection = window.getSelection();
    if (selection.type === TypeConstants.selection.caret) {
      point = Selector.generatePoint(selection);
    } else if (selection.type === TypeConstants.selection.range) {
      var vector = Selector.generateVector(selection);
      point = vector.startPoint;
      EditorActor.removeBlocks(vector);
    }
    // TODO: We'll be back to refactor this.
    if (point) {
      event.preventDefault();
      var html = event.clipboardData.getData("text/html");
      var container = document.createElement("div");
      container.innerHTML = html;
      if (Paster.parseContainer(container, point)) {
        this.updateStoryEdit();
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
    var node = React.findDOMNode(this.refs.view);
    node.addEventListener("mouseup", this.handleMouseUp.bind(this));
    document.addEventListener("paste", this.handlePaste.bind(this));
    window.addEventListener("scroll", this.handleScroll.bind(this));
    window.addEventListener("resize", this.handleResize.bind(this));
  }

  componentWillUnmount() {
    var node = React.findDOMNode(this.refs.view);
    node.removeEventListener("mouseup", this.handleMouseUp);
    document.removeEventListener("paste", this.handlePaste);
    window.removeEventListener("scroll", this.handleScroll);
    window.removeEventListener("resize", this.handleResize);
  }

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  render() {
    return (
      <div className={"general-view"} ref={"view"}>
        <StoryEdit
          point={this.state.point}
          shouldUpdate={this.state.shouldUpdateStoryEdit}
          story={this.state.story}
          updateModalLink={this.updateModalLink.bind(this)}
          updateModalStyle={this.updateModalStyle.bind(this)}
          updateStoryEdit={this.updateStoryEdit.bind(this)}
          updateStoryStyle={this.updateStoryStyle.bind(this)} />
        <ModalStyle
          shouldUpdate={this.state.shouldUpdateModalStyle}
          styles={this.state.styles}
          updateModalStyle={this.updateModalStyle.bind(this)}
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
