import React from "react";
import Component from "app/templates/component";

import BlockStandard from "app/components/block_standard";

import Section from "app/models/section";


class SectionStandard extends Component {

  renderBlock(block) {
    return (
      <BlockStandard key={block.cid} block={block} />
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

SectionStandard.propTypes = {
  section: React.PropTypes.object.isRequired,
}

SectionStandard.defaultProps = {
  section: new Section(),
}


module.exports = SectionStandard;
