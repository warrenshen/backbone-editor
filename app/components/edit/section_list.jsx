import React from "react";

import Component from "app/templates/component";

import BlockList from "app/components/edit/block_list";

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
        block={block}
        updateStoryEditable={this.props.storyEditable} />
    );
  }

  renderBlocks() {
    return this.props.section.get("blocks").map(this.renderBlock, this);
  }

  render() {
    var section = this.props.section;
    switch (section.get("type")) {
      case TypeConstants.section.listOrdered:
        return (
          <ol
            className={"section-container"}
            data-index={section.get("index")}>
            {this.renderBlocks()}
          </ol>
        );
      case TypeConstants.section.listUnordered:
        return (
          <ul
            className={"section-container"}
            data-index={section.get("index")}>
            {this.renderBlocks()}
          </ul>
        );
    }
  }
}

SectionList.propTypes = {
  section: React.PropTypes.instanceOf(Section).isRequired,
  updateStoryEditable: React.PropTypes.func.isRequired,
};

SectionList.defaultProps = {
  section: new Section(),
  updateStoryEditable: null,
};


module.exports = SectionList;
