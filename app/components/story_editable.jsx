import React from "react";
import Component from "app/templates/component";

import SectionStandard from "app/components/section_standard";

import Story from "app/models/story";

import Vector from "app/helpers/vector";


class StoryEditable extends Component {

  componentDidMount() {
    super.componentDidMount();
    this.createSelection(this.props.vector);
  }

  componentDidUpdate() {
    this.createSelection(this.props.vector);
  }

  createTreeWalker(anchorNode) {
    return document.createTreeWalker(
      anchorNode,
      NodeFilter.SHOW_TEXT,
      function(node) { return NodeFilter.FILTER_ACCEPT },
      false
    );
  }

  createSelection(vector) {
    var startPoint = vector.getStartPoint();
    var endPoint = vector.getEndPoint();

    if (startPoint.equalsDeeply(endPoint)) {
      var section = $('[data-index="' + startPoint.getSectionIndex() + '"]')[0];
    } else {

    }
  }

  renderSection(section) {
    return (
      <SectionStandard key={section.cid} section={section} />
    );
  }

  renderSections() {
    var sections = this.props.story.get("sections");
    return sections.map(this.renderSection, this);
  }

  render() {
    return (
      <div className={"story-container"}>
        {this.renderSections()}
      </div>
    );
  }
}

StoryEditable.propTypes = {
  story: React.PropTypes.object.isRequired,
  vector: React.PropTypes.object.isRequired,
}

StoryEditable.defaultProps = {
  story: new Story(),
  vector: new Vector(),
}


module.exports = StoryEditable;
