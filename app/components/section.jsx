import React from "react";
import Component from "app/templates/component";

import BlockComponent from "app/components/block";

import Section from "app/models/section";


class SectionComponent extends Component {

  renderBlock(block) {
    return (
      <BlockComponent key={block.cid} block={block} />
    );
  }

  renderBlocks() {
    var blocks = this.props.section.get("blocks");
    return blocks.map(this.renderBlock, this);
  }

  render() {
    return (
      <div>
        {this.renderBlocks()}
      </div>
    );
  }
}

SectionComponent.propTypes = {
  section: React.PropTypes.object.isRequired,
}

SectionComponent.defaultProps = {
  section: new Section(),
}


module.exports = SectionComponent;
