import React from "react";

import Component from "app/templates/component";

import BlockDivider from "app/components/export/block_divider";
import BlockHeading from "app/components/export/block_heading";
import BlockImage from "app/components/export/block_image";
import BlockQuote from "app/components/export/block_quote";
import BlockParagraph from "app/components/export/block_paragraph";

import Section from "app/models/section";

import TypeConstants from "app/constants/type_constants";


class SectionStandard extends Component {

  // --------------------------------------------------
  // Defaults
  // --------------------------------------------------
  displayName() {
    return "SectionStandard";
  }

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  renderBlock(block) {
    var props = {
      block: block,
      key: block.cid,
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
      case TypeConstants.block.paragraph:
        return <BlockParagraph {...props} />;
    }
  }

  renderBlocks() {
    return this.props.section.get("blocks").map(this.renderBlock, this);
  }

  render() {
    return (
      <code>
        <p className={"code code-rose"}>
          {"  <section>"}
        </p>
        {this.renderBlocks()}
        <p className={"code code-rose"}>
          {"  </section>"}
        </p>
      </code>
    );
  }
}

SectionStandard.propTypes = {
  section: React.PropTypes.instanceOf(Section).isRequired,
};

SectionStandard.defaultProps = {
  section: new Section(),
};


module.exports = SectionStandard;
