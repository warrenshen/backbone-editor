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

  renderTag() {
    var section = this.props.section;
    if (section.get("type") === TypeConstants.section.listOrdered) {
      return "ol";
    } else {
      return "ul";
    }
  }
  render() {

    return (
      <code>
        <p className={"code code-rose"}>
          {"  <" + this.renderTag() + ">"}
        </p>
        {this.renderBlocks()}
        <p className={"code code-rose"}>
          {"  </" + this.renderTag() + ">"}
        </p>
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
