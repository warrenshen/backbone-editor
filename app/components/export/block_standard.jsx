import React from "react";

import Component from "app/templates/component";


class BlockStandard extends Component {

  // --------------------------------------------------
  // Defaults
  // --------------------------------------------------
  displayName() {
    return "BlockStandard";
  }

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  render() {
    return (
      <div className={"block-container"}>

      </div>
    );
  }
}

BlockStandard.propTypes = {
  block: React.PropTypes.instanceOf(Block).isRequired,
};

BlockStandard.defaultProps = {
  block: new Block(),
};


module.exports = BlockStandard;
