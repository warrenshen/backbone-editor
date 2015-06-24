import $ from "jquery";
import React from "react";

import Component from "app/templates/component";

import SectionList from "app/components/edit/section_list";
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
        var block = EditorStore.getBlock(point);
        if (point.caretOffset !== 0) {
          var caretOffset = point.caretOffset;
          block.removeFragment(caretOffset - 1, caretOffset);
          if (!block.get("content")) {
            event.preventDefault();
            point.caretOffset = 0;
            EditorActor.updatePoint(point);
            this.props.updateStoryEditable();
          }
        } else {
          event.preventDefault();
          EditorActor.removeBlock(point);
          this.props.updateStoryEditable();
        }
      }
    } else if (selection.type === TypeConstants.selection.range) {
      var vector = Selector.generateVector(selection);
      if (which >= KeyConstants.left && which <= KeyConstants.down) {
        if (event.shiftKey) {
          EditorActor.updateVector(vector);
          this.props.updateModalStyle();
        }
      } else if (which === KeyConstants.backspace) {
        event.preventDefault();
        EditorActor.removeBlocks(vector);
        this.props.updateStoryStyle();
      } else if (event.ctrlKey || event.metaKey) {
        if (which === KeyConstants.b || which === KeyConstants.B) {
          EditorActor.styleElements(
            vector,
            { type: TypeConstants.element.bold }
          );
          this.props.updateModalStyle();
        } else if (which === KeyConstants.i || which === KeyConstants.I) {
          EditorActor.styleElements(
            vector,
            { type: TypeConstants.element.italic }
          );
          this.props.updateModalStyle();
        }
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
        var block = EditorStore.getBlock(point);
        var character = String.fromCharCode(which);
        block.addFragment(character, point.caretOffset);
        if (block.length === 1) {
          event.preventDefault();
          point.caretOffset = 1;
          EditorActor.updatePoint(point);
          this.props.updateStoryEditable();
        } else if (block.get("content").substring(0, 2) === "* ") {
          event.preventDefault();
          EditorActor.addSection(
            point,
            { type: TypeConstants.section.listUnordered }
          );
          this.props.updateStoryEditable();
        } else if (block.get("content").substring(0, 3) === "1. ") {
          event.preventDefault();
          EditorActor.addSection(
            point,
            { type: TypeConstants.section.listOrdered }
          );
          this.props.updateStoryEditable();
        } else if (character === "." ||
                   character === "?" ||
                   character === "!") {
          EditorActor.resetCookies();
        }
      }
    } else if (selection.type === TypeConstants.selection.range) {
      event.preventDefault();
      var vector = Selector.generateVector(selection);
      if (which === KeyConstants.enter) {
        EditorActor.removeBlocks(vector, { enter: true });
      } else {
        var character = String.fromCharCode(which);
        EditorActor.removeBlocks(vector, { character: character });
      }
      this.props.updateStoryStyle();
    }
  }

  handleKeyUp(event) {
    var selection = window.getSelection();
    var which = event.which;
    if (EditorStore.vector &&
        selection.type === TypeConstants.selection.caret) {
      var point = Selector.generatePoint(selection);
      EditorActor.updatePoint(point);
      this.props.updateStoryStyle();
    } else if (which >= KeyConstants.left &&
        which <= KeyConstants.down &&
        !event.shiftKey) {
      var point = Selector.generatePoint(selection);
      if (point.compareShallowly(EditorStore.point)) {
        EditorActor.updatePoint(point);
        this.props.updateStoryEditable();
      }
    }
  }

  handleMouseEnter(event) {
    var range = document.createRange();
    range.setStartBefore(event.target);
    range.setEndAfter(event.target);
    var rectangle = range.getBoundingClientRect();
    var url = event.currentTarget.dataset.link;
    var link = new Link(rectangle, url);
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
  createCaret(point) {
    if (point) {
      var parentNode = React.findDOMNode(this.refs.story)
                       .childNodes[point.sectionIndex]
                       .childNodes[point.blockIndex];
      var childrenNodes = parentNode.childNodes;
      var node = null;
      for (var i = 0; i < childrenNodes.length && !node; i += 1) {
        if (childrenNodes[i].isContentEditable) {
          node = childrenNodes[i];
        }
      }
      if (node) {
        node.focus();
        var selection = window.getSelection();
        var range = document.createRange();
        var caretOffset = point.caretOffset;
        var currentNode = node;
        if (caretOffset > 0) {
          var walker = Selector.createTreeWalker(node);
          while (walker.nextNode() && caretOffset >= 0) {
            currentNode = walker.currentNode;
            if (caretOffset - currentNode.length <= 0) {
              range.setStart(currentNode, caretOffset);
              range.setEnd(currentNode, caretOffset);
            }
            caretOffset -= currentNode.length;
          }
        } else {
          range.setStart(currentNode, 0);
          range.setEnd(currentNode, 0);
        }
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  }

  attachHandlers() {
    var nodes = $(".element-link");
    for (var i = 0; i < nodes.length; i += 1) {
      var nodes = nodes[i];
      nodes.addEventListener("mouseenter", this.handleMouseEnter.bind(this));
      nodes.addEventListener("mouseleave", this.handleMouseLeave.bind(this));
    }
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
    this.attachHandlers();
  }

  componentDidUpdate() {
    if (false) {
      console.log("Story editable component updated.");
    }
    this.createCaret(this.props.point);
    this.attachHandlers();
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
    var props = {
      key: section.cid,
      section: section,
      updateStoryEditable: this.props.updateStoryEditable,
    };
    switch (section.get("type")) {
      case TypeConstants.section.listOrdered:
      case TypeConstants.section.listUnordered:
        return <SectionList {...props} />
      case TypeConstants.section.standard:
        return <SectionStandard {...props} />
    }
  }

  renderSections() {
    return this.props.story.get("sections").map(this.renderSection, this);
  }

  render() {
    console.log(this.props.story.length);
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
