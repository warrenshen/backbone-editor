import React from "react";

import Component from "app/templates/component";

import BlockDivider from "app/components/edit/block_divider";
import BlockHeading from "app/components/edit/block_heading";
import BlockImage from "app/components/edit/block_image";
import BlockParagraph from "app/components/edit/block_paragraph";
import BlockQuote from "app/components/edit/block_quote";

import Section from "app/models/section";

import TypeConstants from "app/constants/type_constants";


class SectionStandard extends Component {

  // --------------------------------------------------
  // Getters
  // --------------------------------------------------
  static get propTypes() {
    return {
      section: React.PropTypes.instanceOf(Section).isRequired,
      updateStoryEdit: React.PropTypes.func.isRequired,
    };
  }

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  renderBlock(block) {
    var props = {
      block: block,
      key: block.cid,
      updateStoryEdit: this.props.updateStoryEdit,
    };
    switch (block.get("type")) {
      case TypeConstants.block.divider:
        return <BlockDivider {...props} />;
      case TypeConstants.block.headingOne:
      case TypeConstants.block.headingTwo:
      case TypeConstants.block.headingThree:
        return <BlockHeading {...props} />;
      case TypeConstants.block.image:
        props["updateStoryStyle"] = this.props.updateStoryStyle;
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
      <section
        className={"section-container"}
        data-index={this.props.section.get("index")}>
        {this.renderBlocks()}
      </section>
    );
  }
}


module.exports = SectionStandard;
