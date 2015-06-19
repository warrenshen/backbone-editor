import React from "react";

import Component from "app/templates/component";

import Section from "app/models/section";


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
      key: block.cid,
      block: block,
    };

    switch (block.get("type")) {
      // case TypeConstants.block.divider:
      //   return <BlockDivider {...props} />;
      // case TypeConstants.block.headingOne:
      // case TypeConstants.block.headingTwo:
      // case TypeConstants.block.headingThree:
      //   return <BlockHeading {...props} />;
      // case TypeConstants.block.image:
      //   return <BlockImage {...props} />;
      // case TypeConstants.block.quote:
      //   return <BlockQuote {...props} />;
      case TypeConstants.block.standard:
        return <BlockStandard {...props} />;
    }
  }

  renderBlocks() {
    return this.props.section.get("blocks").map(this.renderBlock, this);
  }

  render() {
    return (
      <section className={"section-container"}>
        {this.renderBlocks()}
      </section>
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
