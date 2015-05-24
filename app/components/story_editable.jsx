import $ from "jquery";
import React from "react";
import Component from "app/templates/component";

import SectionStandard from "app/components/section_standard";

import Story from "app/models/story";

import Point from "app/helpers/point";
import Vector from "app/helpers/vector";


class StoryEditable extends Component {

  componentDidMount() {
    super.componentDidMount();
    this.createCaret(this.props.point);
  }

  componentDidUpdate() {
    this.createCaret(this.props.point);
  }

  createTreeWalker(anchorNode) {
    return document.createTreeWalker(
      anchorNode,
      NodeFilter.SHOW_TEXT,
      function(node) { return NodeFilter.FILTER_ACCEPT },
      false
    );
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

      if (caretOffset < 0) {
        caretOffset = Math.abs(caretOffset);
        var bottom = block.getBoundingClientRect().bottom;

        var floorOffset = 0;
        var complete = false;
        var walker = this.createTreeWalker(node);
        while (walker.nextNode() && !complete) {
          var currentNode = walker.currentNode;
          var length = currentNode.textContent.length;
          for (var i = 0; i < length - 1; i += 1) {
            range.setStart(currentNode, i);
            range.setEnd(currentNode, i + 1);

            if (bottom - range.getBoundingClientRect().bottom < 30) {
              floorOffset += i - length - 1;
              complete = true;
              i = length;
            }
          }
          floorOffset += length;
        }
        caretOffset += floorOffset;
      }

      if (caretOffset > 0) {
        var complete = false;
        var walker = this.createTreeWalker(node);
        while (walker.nextNode() && !complete) {
          var currentNode = walker.currentNode;
          if (caretOffset - currentNode.length <= 0) {
            range.setStart(currentNode, caretOffset);
            range.setEnd(currentNode, caretOffset);
            range.collapse(true);
            complete = true;
          }
          caretOffset -= currentNode.length;
        }

        if (caretOffset > 0) {
          var currentNode = walker.currentNode;
          range.setStart(currentNode, currentNode.length);
          range.setEnd(currentNode, currentNode.length);
          range.collapse(true);
        }

        selection.removeAllRanges();
        selection.addRange(range);
      }
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
  point: React.PropTypes.object,
  story: React.PropTypes.object.isRequired,
  vector: React.PropTypes.object,
}

StoryEditable.defaultProps = {
  // point: new Point(),
  story: new Story(),
  // vector: new Vector(),
}


module.exports = StoryEditable;
