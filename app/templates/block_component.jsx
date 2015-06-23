import React from "react";
import Component from "app/templates/component";

import Block from "app/models/block";


class BlockComponent extends Component {

  // --------------------------------------------------
  // Lifecycle
  // --------------------------------------------------
  componentDidMount() {
    var node = React.findDOMNode(this.refs.content);
    this.renderContent(node);
  }

  componentDidUpdate() {
    var node = React.findDOMNode(this.refs.content);
    this.renderContent(node);
  }

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  renderContent(node) {
    node.innerHTML = this.props.block.toString();
  }

  render() {
    return (
      <div
        className={"block-container"}
        data-index={this.props.block.get("index")}>
        <p className={"block-content"} ref={"content"}></p>
      </div>
    );
  }
}

BlockComponent.propTypes = {
  block: React.PropTypes.instanceOf(Block).isRequired,
  updateStoryEditable: React.PropTypes.func.isRequired,
};

BlockComponent.defaultProps = {
  block: new Block(),
  updateStoryEditable: null,
};


module.exports = BlockComponent;
