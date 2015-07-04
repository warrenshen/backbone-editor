import React from "react";

import Component from "app/templates/component";

import BlockList from "app/components/export/block_list";

import Section from "app/models/section";

import TypeConstants from "app/constants/type_constants";


class SectionList extends Component {

  // --------------------------------------------------
  // Getters
  // --------------------------------------------------
  static get propTypes() {
    return {
      section: React.PropTypes.instanceOf(Section).isRequired,
    };
  }

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  renderBlock(block) {
    return (
      <BlockList
        block={block}
        key={block.cid} />
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
        <p className={"code"}>
          <span className={"code code-rose"}>
            {"    <" + this.renderTag()}
          </span>
          <span className={"code code-green"}>
            {" class="}
          </span>
          <span className={"code code-blue"}>
            {"\"section section-standard\""}
          </span>
          <span className={"code code-rose"}>
            {">"}
          </span>
        </p>
        {this.renderBlocks()}
        <p className={"code code-rose"}>
          {"    </" + this.renderTag() + ">"}
        </p>
      </code>
    );
  }
}


module.exports = SectionList;
