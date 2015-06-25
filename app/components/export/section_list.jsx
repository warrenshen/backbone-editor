import React from "react";

import Component from "app/templates/component";

import BlockList from "app/components/export/block_list";

import Section from "app/models/section";

import TypeConstants from "app/constants/type_constants";


class SectionList extends Component {

  // --------------------------------------------------
  // Defaults
  // --------------------------------------------------
  displayName() {
    return "SectionList";
  }

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  renderBlock(block) {
    return (
      <BlockList
        key={block.cid}
        block={block} />
    );
  }

  renderBlocks() {
    return this.props.section.get("blocks").map(this.renderBlock, this);
  }

  render() {
    return (
      <code>
        {this.renderBlocks()}
      </code>
    );
  }
}

SectionList.propTypes = {
  section: React.PropTypes.instanceOf(Section).isRequired,
};

SectionList.defaultProps = {
  section: new Section(),
};


module.exports = SectionList;
