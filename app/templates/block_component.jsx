import React from "react";
import Component from "app/templates/component";

import Block from "app/models/block";

import Formatter from "app/helpers/formatter";


class BlockComponent extends Component {

  componentDidMount() {
    super.componentDidMount();
    this.renderContent();
  }

  componentDidUpdate() {
    super.componentDidUpdate();
    this.renderContent();
  }

  renderContent() {
    var node = React.findDOMNode(this.refs.content);
    node.innerHTML = Formatter.format(this.props.block);
  }

  render() {
    return (
      <div>
        <p ref={"content"}></p>
      </div>
    );
  }
}

BlockComponent.propTypes = {
  block: React.PropTypes.object.isRequired,
}

BlockComponent.defaultProps = {
  block: new Block(),
}


module.exports = BlockComponent;
