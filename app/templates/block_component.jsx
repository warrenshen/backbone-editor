import React from "react";
import Component from "app/templates/component";

import ModalMedia from "app/components/edit/modal_media";

import Block from "app/models/block";

import EditorStore from "app/stores/editor_store";

import EditorActor from "app/actors/editor_actor";

import Selector from "app/helpers/selector";

import KeyConstants from "app/constants/key_constants";
import TypeConstants from "app/constants/type_constants";


class BlockComponent extends Component {

  // --------------------------------------------------
  // Lifecycle
  // --------------------------------------------------
  componentDidMount() {
    var content = React.findDOMNode(this.refs.content);

    this.renderContent(content);
  }

  componentDidUpdate() {
    var content = React.findDOMNode(this.refs.content);

    this.renderContent(content);
  }

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  renderContent(node) {
    node.innerHTML = this.props.block.toString();
  }

  renderEditable(className) {
    return (
      <p
        className={className}
        ref={"content"}>
      </p>
    );
  }

  renderModal() {
    var block = this.props.block;
    var point = EditorStore.point;
    if (!block.get("content") && point &&
        point.matchesValues(block.get("section_index"), block.get("index"))) {
      return (
        <ModalMedia
          block={this.props.block}
          updateStoryEditable={this.props.updateStoryEditable} />
      );
    }
  }

  render() {
    return (
      <div>
        {this.renderEditable("block-content")}
      </div>
    );
  }
}

BlockComponent.propTypes = {
  block: React.PropTypes.instanceOf(Block).isRequired,
  isEditable: React.PropTypes.bool.isRequired,
  updateStoryStyle: React.PropTypes.func.isRequired,
  updateStoryEditable: React.PropTypes.func.isRequired,
};

BlockComponent.defaultProps = {
  block: new Block(),
  isEditable: true,
  updateStoryStyle: null,
  updateStoryEditable: null,
};


module.exports = BlockComponent;
