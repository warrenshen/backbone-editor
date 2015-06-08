import React from "react";
import Component from "app/templates/component";

import BlockDivider from "app/components/block_divider";
import BlockHeading from "app/components/block_heading";
import BlockImage from "app/components/block_image";
import BlockQuote from "app/components/block_quote";
import BlockStandard from "app/components/block_standard";

import Section from "app/models/section";

import TypeConstants from "app/constants/type_constants";


class SectionStandard extends Component {

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  renderBlock(block) {
    var props = {
      key: block.cid,
      block: block,
      sectionIndex: this.props.section.get("index"),
      shouldEnableEdits: this.props.shouldEnableEdits,
      updateStory: this.props.updateStory,
    };
    switch (block.get("type")) {
      case TypeConstants.block.divider:
        return <BlockDivider {...props} />;
      case TypeConstants.block.headingOne:
      case TypeConstants.block.headingTwo:
      case TypeConstants.block.headingThree:
        return <BlockHeading {...props} />;
      case TypeConstants.block.image:
        return <BlockImage {...props} />;
      case TypeConstants.block.quote:
        return <BlockQuote {...props} />;
      case TypeConstants.block.standard:
        return <BlockStandard {...props} />;
    }
  }

  renderBlocks() {
    var blocks = this.props.section.get("blocks");
    return blocks.map(this.renderBlock, this);
  }

  render() {
    var section = this.props.section;
    return (
      <section
        className={"section-container"}
        data-index={section.get("index")}>
        {this.renderBlocks()}
      </section>
    );
  }
}

SectionStandard.propTypes = {
  section: React.PropTypes.instanceOf(Section).isRequired,
  shouldEnableEdits: React.PropTypes.bool.isRequired,
  updateStory: React.PropTypes.func,
};

SectionStandard.defaultProps = {
  section: new Section(),
  shouldEnableEdits: true,
};


module.exports = SectionStandard;
