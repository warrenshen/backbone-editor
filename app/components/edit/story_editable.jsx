import $ from "jquery";
import React from "react";

import Component from "app/templates/component";

import SectionStandard from "app/components/edit/section_standard";

import Story from "app/models/story";

import EditorStore from "app/stores/editor_store";

import EditorActor from "app/actors/editor_actor";

import Link from "app/helpers/link";
import Point from "app/helpers/point";
import Selector from "app/helpers/selector";

import KeyConstants from "app/constants/key_constants";
import TypeConstants from "app/constants/type_constants";


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
  handleKeyDown(event) {
    event.stopPropagation();

    var selection = window.getSelection();
    var which = event.which;

    if (selection.type === TypeConstants.selection.caret) {
      var point = Selector.generatePoint(selection);

      if (which === KeyConstants.backspace) {
        // TODO: Backspace does not cause rerender,
        // so link modal stays in the wrong position.
        if (point.caretOffset !== 0) {
          var block = this.getBlock(point);
          var caretOffset = point.caretOffset;

          // TODO: Could set this up with action so that a block
          // does not have to be grabbed directly from store.
          block.removeFragment(caretOffset - 1, caretOffset);

          if (!block.get("content")) {
            event.preventDefault();

            point.caretOffset = 0;
            EditorActor.updatePoint(point);
            this.props.updateStoryEditable();
          }
        } else if (!point.matchesValues(0, 0)) {
          event.preventDefault();

          EditorActor.removeBlock(point);
          this.props.updateStoryEditable();
        }
      }
      // TODO: Handle tab for both point and vector.
      // else if (which === KeyConstants.tab) {
      //   event.preventDefault();

      //   point.caretOffset = 0;
      //   EditorActor.shiftDown(point);
      //   this.props.updateStoryEditable();
      // }
    } else if (selection.type === TypeConstants.selection.range) {
      var vector = Selector.generateVector(selection);

      if (which >= KeyConstants.left && which <= KeyConstants.down) {
        if (event.shiftKey) {
          EditorActor.updateVector(vector);
          this.props.updateModalStyle();
        }
      } else if (which === KeyConstants.backspace) {
        EditorActor.removeBlocks(vector);
        this.props.updateStoryStyle();
      }
    }
  }

  handleKeyPress(event) {
    var selection = window.getSelection();
    var which = event.which;

    if (selection.type === TypeConstants.selection.caret) {
      var point = Selector.generatePoint(selection);

      if (which === KeyConstants.enter) {
        event.preventDefault();

        EditorActor.splitBlock(point);
        this.props.updateStoryEditable();
      } else {
        var block = this.getBlock(point);
        var character = String.fromCharCode(which);

        block.addFragment(character, point.caretOffset);

        if (block.length === 1) {
          event.preventDefault();

          point.caretOffset = 1;
          EditorActor.updatePoint(point);
          this.props.updateStoryEditable();
        }
      }
    } else if (selection.type === TypeConstants.selection.range) {
      var vector = Selector.generateVector(selection);

      if (which === KeyConstants.enter) {
        EditorActor.removeBlocks(vector, { enter: true });
      } else {
        var character = String.fromCharCode(which);

        if (event.ctrlKey || event.metaKey) {
          if (character === KeyConstants.b) {
            EditorActor.styleElements(vector, TypeConstants.element.bold);
          } else if (character === KeyConstants.i) {
            EditorActor.styleElements(vector, TypeConstants.element.italic);
          } else {
            return;
          }
        } else {
          EditorActor.removeBlocks(vector, { character: character });
        }
      }

      this.props.updateStoryStyle();
    }
  }

  handleKeyUp(event) {
    var selection = window.getSelection();

    if (EditorStore.vector &&
        selection.type === TypeConstants.selection.caret) {
      var point = Selector.generatePoint(selection);

      EditorActor.updatePoint(point);
      this.props.updateStoryStyle();
    }
  }

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

  getBlock(point) {
    return EditorStore.getBlock(point.sectionIndex, point.blockIndex);
  }

  // --------------------------------------------------
  // Lifecycle
  // --------------------------------------------------
  componentDidMount() {
    var node = React.findDOMNode(this.refs.story);
    node.addEventListener("keydown", this.handleKeyDown.bind(this));
    node.addEventListener("keypress", this.handleKeyPress.bind(this));
    node.addEventListener("keyup", this.handleKeyUp.bind(this));

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

  componentWillUnmount() {
    var node = React.findDOMNode(this.refs.story);
    node.removeEventListener("keydown", this.handleKeyDown);
    node.removeEventListener("keypress", this.handleKeyPress);
    node.removeEventListener("keyup", this.handleKeyUp);
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
        updateStoryEditable={this.props.updateStoryEditable} />
    );
  }

  renderSections() {
    return this.props.story.get("sections").map(this.renderSection, this);
  }

  render() {
    return (
      <div
        className={"story-container"}
        contentEditable={"true"}
        ref={"story"}>
        {this.renderSections()}
      </div>
    );
  }
}

StoryEditable.propTypes = {
  point: React.PropTypes.instanceOf(Point),
  shouldUpdate: React.PropTypes.bool.isRequired,
  story: React.PropTypes.instanceOf(Story).isRequired,
  updateModalLink: React.PropTypes.func.isRequired,
  updateStoryEditable: React.PropTypes.func.isRequired,
};

StoryEditable.defaultProps = {
  shouldUpdate: true,
  story: new Story(),
  updateModalLink: null,
  updateStoryStyle: null,
  updateStoryEditable: null,
};


module.exports = StoryEditable;
