import React from "react";
import Component from "app/templates/component";

import BlockStandard from "app/components/block_standard";

import Section from "app/models/section";


class SectionStandard extends Component {

  renderBlock(block) {
    return (
      <BlockStandard
        key={block.cid}
        block={block}
        disableEdits={this.props.disableEdits}
        enableEdits={this.props.enableEdits}
        shouldEnableEdits={this.props.shouldEnableEdits}
        shouldUpdateContent={this.props.shouldUpdateContent} />
    );
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
  disableEdits: React.PropTypes.func.isRequired,
  enableEdits: React.PropTypes.func.isRequired,
  section: React.PropTypes.instanceOf(Section).isRequired,
  shouldEnableEdits: React.PropTypes.bool.isRequired,
  shouldUpdateContent: React.PropTypes.bool.isRequired,
};

SectionStandard.defaultProps = {
  disableEdits: null,
  enableEdits: null,
  section: new Section(),
  shouldEnableEdits: true,
  shouldUpdateContent: true,
};


module.exports = SectionStandard;
