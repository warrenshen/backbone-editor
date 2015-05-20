import React from "react";
import Component from "app/templates/component";

import Block from "app/models/block";


class BlockComponent extends Component {

  render() {
    return (
      <div></div>
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
