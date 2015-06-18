import $ from "jquery";
import React from "react";

import Component from "app/templates/component";

import SectionStandard from "app/components/edit/section_standard";

import Story from "app/models/story";

import EditorActor from "app/actors/editor_actor";

import Link from "app/helpers/link";
import Point from "app/helpers/point";
import Selector from "app/helpers/selector";


class StoryEditable extends Component {

  // --------------------------------------------------
  // Defaults
  // --------------------------------------------------
  displayName() {
    return "StoryEditable";
  }

  // --------------------------------------------------
  // Handlers
  // --------------------------------------------------
  handleMouseEnter(event) {
    var range = document.createRange();

    range.setStartBefore(event.target);
    range.setEndAfter(event.target);

    var rectangle = range.getBoundingClientRect();
    var link = new Link(rectangle, event.currentTarget.dataset.link);

    EditorActor.updateLink(link)
    this.props.updateModalLink();
  }

  handleMouseLeave(event) {
    EditorActor.updateLink(null);
    this.props.updateModalLink();
  }

  // --------------------------------------------------
  // Helpers
  // --------------------------------------------------
  // TODO: Fix caret creation bug when styled
  // elements and selection are present.
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
            EditorActor.updatePoint(point);
            this.props.updateStoryEditable();
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

  createHandlers() {
    var links = $(".element-link");

    for (var i = 0; i < links.length; i += 1) {
      var link = links[i];

      link.addEventListener("mouseenter", this.handleMouseEnter.bind(this));
      link.addEventListener("mouseleave", this.handleMouseLeave.bind(this));
    }
  }

  // --------------------------------------------------
  // Lifecycle
  // --------------------------------------------------
  componentDidMount() {
    this.createCaret(this.props.point);
    this.createHandlers();
  }

  componentDidUpdate() {
    if (false) {
      console.log("Story editable component updated.");
    }

    this.createCaret(this.props.point);
    this.createHandlers();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.shouldUpdate;
  }

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  renderSection(section) {
    return (
      <SectionStandard
        key={section.cid}
        section={section}
        isEditable={this.props.isEditable}
        updateStoryStyle={this.props.updateStoryStyle}
        updateStoryEditable={this.props.updateStoryEditable} />
    );
  }

  renderSections() {
    return this.props.story.get("sections").map(this.renderSection, this);
  }

  render() {
    console.log(this.props.story.toString());
    return (
      <div className={"story-container"} ref={"story"}>
        {this.renderSections()}
      </div>
    );
  }
}

StoryEditable.propTypes = {
  isEditable: React.PropTypes.bool.isRequired,
  point: React.PropTypes.instanceOf(Point),
  shouldUpdate: React.PropTypes.bool.isRequired,
  story: React.PropTypes.instanceOf(Story).isRequired,
  updateModalLink: React.PropTypes.func.isRequired,
  updateStoryStyle: React.PropTypes.func.isRequired,
  updateStoryEditable: React.PropTypes.func.isRequired,
};

StoryEditable.defaultProps = {
  isEditable: true,
  shouldUpdate: true,
  story: new Story(),
  updateModalLink: null,
  updateStoryStyle: null,
  updateStoryEditable: null,
};


module.exports = StoryEditable;
