import $ from "jquery";
import React from "react";
import Component from "app/templates/component";

import SectionStandard from "app/components/section_standard";

import Story from "app/models/story";

import Point from "app/helpers/point";
import Selector from "app/helpers/selector";


class StoryEditable extends Component {

  componentDidMount() {
    super.componentDidMount();
    this.createCaret(this.props.point);
  }

  componentDidUpdate() {
    this.createCaret(this.props.point);
  }

  createCaret(point) {
    if (point) {
      var section = $('section[data-index="' + point.sectionIndex + '"]')[0];
      var block = section.childNodes[point.blockIndex];
      var caretOffset = point.caretOffset;

      var node = block.childNodes[0];
      node.focus();

      var selection = window.getSelection();
      var range = document.createRange();

      if (point.shouldFloor) {
        var floorOffset = Selector.findFloorOffset(node, 30);
        caretOffset += floorOffset;
      }

      if (caretOffset > 0) {
        var complete = false;
        var currentNode = node;
        var walker = Selector.createTreeWalker(node);
        while (walker.nextNode() && !complete) {
          currentNode = walker.currentNode;
          if (caretOffset - currentNode.length <= 0) {
            range.setStart(currentNode, caretOffset);
            range.setEnd(currentNode, caretOffset);
            complete = true;
          }
          caretOffset -= currentNode.length;
        }

        // Default to end of block if leftover caret offset present.
        if (caretOffset > 0) {
          range.setStart(currentNode, currentNode.length);
          range.setEnd(currentNode, currentNode.length);
        }
      } else {
        range.setStart(node, 0);
        range.setEnd(node, 0);
      }

      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }

  renderSection(section) {
    return (
      <SectionStandard
        key={section.cid}
        section={section}
        shouldEnableEdits={this.props.shouldEnableEdits}
        shouldUpdateContent={this.props.shouldUpdateContent} />
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
  point: React.PropTypes.instanceOf(Point),
  shouldEnableEdits: React.PropTypes.bool.isRequired,
  shouldUpdateContent: React.PropTypes.bool.isRequired,
  story: React.PropTypes.instanceOf(Story).isRequired,
};

StoryEditable.defaultProps = {
  shouldEnableEdits: true,
  shouldUpdateContent: true,
  story: new Story(),
};


module.exports = StoryEditable;
