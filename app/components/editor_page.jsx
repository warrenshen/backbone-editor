import _ from "lodash";
import React from "react";
import ListeningComponent from "app/templates/listening_component";

import StoryEditable from "app/components/story_editable";
import StyleModal from "app/components/style_modal";

import EditorStore from "app/stores/editor_store";

import EditorActor from "app/actors/editor_actor";

import Selector from "app/helpers/selector";


class EditorPage extends ListeningComponent {

  stores() {
    return [EditorStore];
  }

  getDefaultState() {
    return _.merge(
      {
        shouldEnableEdits: true,
        shouldUpdateContent: true,
        shouldUpdateModal: true,
      },
      super.getDefaultState()
    );
  }

  getStoreState() {
    return {
      point: EditorStore.getPoint(),
      story: EditorStore.getStory(),
      vector: EditorStore.getVector(),
    }
  }

  enableEdits() {
    this.setState({ shouldAllowEdits: true });
  }

  disableEdits() {
    this.setState({ shouldAllowEdits: false });
  }

  updateContent() {
    this.setState({ shouldUpdateContent: true });
  }

  downdateContent() {
    this.setState( { shouldUpdateContent: false });
  }

  updateModal() {
    this.setState({ shouldUpdateModal: true });
  }

  downdateModal() {
    this.setState({ shouldUpdateModal: false });
  }

  handleMouseUp(event) {
    var selection = window.getSelection();
    console.log(selection.type);

    if (selection.type === "Range") {
      var vector = Selector.generateVector(selection);
      EditorActor.updateVector(vector);
    } else if (selection.type === "None") {
      EditorActor.updateVector(null);
    }
  }

  componentDidMount() {
    super.componentDidMount();
    var node = React.findDOMNode(this.refs.page);
    node.addEventListener("mouseup", this.handleMouseUp.bind(this));
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    var node = React.findDOMNode(this.refs.page);
    node.removeEventListener("mouseup", this.handleMouseUp);
  }

  render() {
    return (
      <div className={"general-page"} ref="page">
        <StoryEditable
          point={this.state.point}
          shouldAllowEdits={this.state.shouldAllowEdits}
          shouldUpdateContent={this.state.shouldUpdateContent}
          story={this.state.story} />
        <StyleModal
          shouldUpdateModal={this.state.shouldUpdateModal}
          vector={this.state.vector} />
      </div>
    );
  }
}


module.exports = EditorPage;
