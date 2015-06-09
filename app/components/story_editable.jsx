import React from "react";

import Component from "app/templates/component";

import SectionStandard from "app/components/section_standard";

import Story from "app/models/story";

import EditorActor from "app/actors/editor_actor";

import Point from "app/helpers/point";
import Selector from "app/helpers/selector";


class StoryEditable extends Component {

  // --------------------------------------------------
  // Helpers
  // --------------------------------------------------
  createCaret(point) {
    if (point) {
      var story = React.findDOMNode(this.refs.story);
      var section = story.childNodes[point.sectionIndex];
      var block = section.childNodes[point.blockIndex];
      var caretOffset = point.caretOffset;

      var node;
      var children = block.childNodes;
      var complete = false;
      for (var i = 0; i < children.length && !complete; i += 1) {
        if (children[i].isContentEditable) {
          node = children[i];
          complete = true;
        }
      }
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
          if (!node.textContent) {
            point.caretOffset = 0;
            console.log(point);
            EditorActor.updatePoint(point);
            this.props.updateStory();
            return;
          } else {
            range.setStart(currentNode, currentNode.length);
            range.setEnd(currentNode, currentNode.length);
          }
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

  // --------------------------------------------------
  // Lifecycle
  // --------------------------------------------------
  componentDidMount() {
    this.createCaret(this.props.point);
  }

  componentDidUpdate() {
    this.createCaret(this.props.point);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.shouldUpdateStory;
  }

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  renderSection(section) {
    return (
      <SectionStandard
        key={section.cid}
        section={section}
        shouldEnableEdits={this.props.shouldEnableEdits}
        updateStory={this.props.updateStory} />
    );
  }

  renderSections() {
    var sections = this.props.story.get("sections");
    return sections.map(this.renderSection, this);
  }

  render() {
    return (
      <div className={"story-container"} ref={"story"}>
        {this.renderSections()}
      </div>
    );
  }
}

StoryEditable.propTypes = {
  point: React.PropTypes.instanceOf(Point),
  shouldEnableEdits: React.PropTypes.bool.isRequired,
  shouldUpdateStory: React.PropTypes.bool.isRequired,
  story: React.PropTypes.instanceOf(Story).isRequired,
  updateStory: React.PropTypes.func,
};

StoryEditable.defaultProps = {
  shouldEnableEdits: true,
  shouldUpdateStory: true,
  story: new Story(),
};


module.exports = StoryEditable;
