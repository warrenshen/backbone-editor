import _ from "lodash";
import CookiesJS from "cookies-js";

import Store from "app/templates/store";

import Block from "app/models/block";
import Element from "app/models/element";
import Section from "app/models/section";
import Story from "app/models/story";

import Point from "app/helpers/point";
import Vector from "app/helpers/vector";

import ActionConstants from "app/constants/action_constants";
import TypeConstants from "app/constants/type_constants";


class EditorStore extends Store {

  // --------------------------------------------------
  // Setup
  // --------------------------------------------------
  setDefaults() {
    this._link = null;
    this._point = new Point(0, 0, 0);
    this._story = this.retrieveCookies();
    this._styles = {};
    this._vector = null;
  }

  // --------------------------------------------------
  // Getters
  // --------------------------------------------------
  get styles() {
    return this._styles;
  }

  get link() {
    return this._link;
  }

  get name() {
    return "EditorStore";
  }

  get point() {
    return this._point;
  }

  get story() {
    return this._story;
  }

  get vector() {
    return this._vector;
  }

  // --------------------------------------------------
  // Methods
  // --------------------------------------------------
  getBlock(point, sectionIndex, blockIndex) {
    return this.getSection(point).get("blocks").at(point.blockIndex);
  }

  getSection(point, sectionIndex) {
    return this._story.get("sections").at(point.sectionIndex);
  }

  // --------------------------------------------------
  // Actions
  // --------------------------------------------------
  addBlock(point, block) {
    var section = this.getSection(point);
    section.addBlock(block, point.blockIndex);
    if (!block.isEditable()) {
      point.blockIndex += 1;
    }
    this.resetCookies();
    this.updatePoint(point);
  }

  addSection(point, options) {
    var story = this._story;
    var section = this.getSection(point);
    var block = this.getBlock(point);
    var type = options.type;
    var clone = section.cloneDestructively(point.blockIndex + 1);
    var addition = section.cloneDestructively(point.blockIndex);
    addition.set("type", type);
    story.addSection(addition, point.sectionIndex + 1);
    if (addition.isList()) {
      block.set("type", TypeConstants.block.list);
      block.set("content", block.get("content").substring(3));
    } else {
      block.set("type", TypeConstants.block.paragraph);
    }
    if (clone.length) {
      story.addSection(clone, point.sectionIndex + 2);
    }
    if (!section.length) {
      story.removeSection(section);
    }
    point.sectionIndex = block.get("section_index");
    point.blockIndex = block.get("index");
    point.caretOffset = 0;
    this.resetCookies();
    this.updatePoint(point);
  }

  filterStyles(vector) {
    var styles = {};
    var maps = [];
    var fn = function(block, start, end) {
      var map = block.filterStyles(start, end);
      maps.push(map);
    };
    this.helper(vector, fn);
    for (var map of maps) {
      for (var [type, value] of map) {
        if (!value && styles[type])
          styles[type] = false;
        else if (value && styles[type] === undefined) {
          styles[type] = true;
        }
      }
    }
    return styles;
  }

  removeBlock(point) {
    var section = this.getSection(point);
    var block = this.getBlock(point);
    if (block.isList()) {
      this.addSection(point, { type: TypeConstants.section.standard });
    } else {
      var previousBlock = null;
      if (block.get("index") > 0) {
        previousBlock = this.getBlock(
          null,
          point.sectionIndex,
          point.blockIndex - 1
        );
      } else if (section.get("index") > 0) {
        previousBlock = this.getSection(
          null,
          point.sectionIndex - 1
        ).footer;
      }
      if (previousBlock === null) {
        if (block.isImage()) {
          section.removeBlock(block);
          this.addBlock(new Block(), point);
        }
      } else {
        if (previousBlock.isImage()) {
          if (!block.get("content") && !block.isLast()) {
            section.removeBlock(block);
            this._story.mergeSections();
          }
        } else {
          point.sectionIndex = previousBlock.get("section_index");
          point.blockIndex = previousBlock.get("index");
          point.caretOffset = previousBlock.length;
          if (!previousBlock.isEditable()) {
            section.removeBlock(previousBlock);
          } else {
            if (!block.isImage()) {
              previousBlock.mergeBlock(block, previousBlock.length);
            }
            section.removeBlock(block);
          }
        }
        this._story.mergeSections();
        this.resetCookies();
        this.updatePoint(point);
      }
    }
  }

  removeBlocks(vector, options={}) {
    var startPoint = vector.startPoint;
    var endPoint = vector.endPoint;
    // Figure out if there is a better way to do this.
    var startBlock = this.getBlock(startPoint);
    var endBlock = this.getBlock(endPoint);
    var fn = function(block, start, end) {
      block.removeFragment(start, end);
    };
    this.helper(vector, fn, true);
    if (options.enter) {
      var clone = startBlock.cloneDestructively(startCaretOffset);
      var section = this.getSection(startPoint);
      section.addBlock(clone, startBlockIndex + 1);
      startPoint.blockIndex += 1;
      startPoint.caretOffset = 0;
    } else {
      var endSection = this.getSection(endPoint);
      if (options.character) {
        startBlock.addFragment(options.character, startCaretOffset);
        startBlock.caretOffset += 1;
      }
      startBlock.mergeBlock(endBlock, startBlock.length);
      endSection.removeBlock(endBlock);
    }
    this.resetCookies();
    this.updatePoint(startPoint);
  }

  retrieveCookies() {
    // TODO: Fix cookies to support longer stories.
    if (false && CookiesJS.enabled) {
      var cookie = CookiesJS.get("editor");
      if (cookie) {
        var json = JSON.parse(cookie);
        return new Story(json);
      }
    }
    var story = new Story();
    var section = new Section();
    section.addBlock(new Block());
    story.addSection(section);
    return story;
  }

  resetCookies() {
    if (false && CookiesJS.enabled) {
      console.log("ES resetting cookies...");
      CookiesJS.set("editor", JSON.stringify(this._story.toJSON()));
    }
  }

  splitBlock(point) {
    var section = this.getSection(point);
    var block = this.getBlock(point);
    if (!block.length && block.isList()) {
      this.addSection(point, { type: TypeConstants.section.standard });
    } else {
      var clone = block.cloneDestructively(point.caretOffset);
      if (!clone.length && !clone.isList()) {
        clone.set("type", TypeConstants.block.paragraph);
      }
      point.blockIndex += 1;
      point.caretOffset = 0;
      this.addBlock(point, clone);
    }
  }

  helper(vector, fn, shouldRemove=false) {
    var startPoint = vector.startPoint;
    var endPoint = vector.endPoint;
    var startSectionIndex = startPoint.sectionIndex;
    var endSectionIndex = endPoint.sectionIndex;
    var startBlockIndex = startPoint.blockIndex;
    var endBlockIndex = endPoint.blockIndex;
    var startCaretOffset = startPoint.caretOffset;
    var endCaretOffset = endPoint.caretOffset;
    var sectionBucket = [];
    var sectionIndices = _.range(startSectionIndex, endSectionIndex + 1);
    for (var sectionIndex of sectionIndices) {
      var point = new Point(sectionIndex, 0, 0);
      var section = this.getSection(point);
      var shouldContinue = true;
      var blockIndices = null;
      if (startSectionIndex === endSectionIndex) {
        blockIndices = _.range(startBlockIndex, endBlockIndex + 1);
      } else if (sectionIndex === startSectionIndex) {
        blockIndices = _.range(startBlockIndex, section.length);
      } else if (sectionIndex === endSectionIndex) {
        blockIndices = _.range(0, endBlockIndex + 1);
      } else {
        if (shouldRemove) {
          sectionBucket.push(section);
          shouldContinue = false;
        } else {
          blockIndices = _.range(0, section.length);
        }
      }
      if (shouldContinue) {
        var blockBucket = [];
        for (var blockIndex of blockIndices) {
          point.blockIndex = blockIndex;
          var block = this.getBlock(point);
          if (blockIndices[0] === blockIndices[blockIndices.length - 1]) {
            fn(block, startCaretOffset, endCaretOffset);
          } else if (blockIndex === blockIndices[0]) {
            fn(block, startCaretOffset, block.length);
          } else if (blockIndex === blockIndices[blockIndices.length - 1]) {
            fn(block, 0, endCaretOffset);
          } else {
            if (shouldRemove) {
              blockBucket.push(block);
            } else {
              fn(block, 0, block.length);
            }
          }
        }
        for (var block of blockBucket) {
          section.removeBlock(block);
        }
      }
      for (var section of sectionBucket) {
        this._story.removeSection(section);
      }
    }
  }

  styleBlocks(vector, options) {
    var fn = function(block, start, end) {
      var type = options.type;
      if (block.isCentered()) {
        block.set("is_centered", false);
      } else if (block.get("type") === type) {
        block.set("type", TypeConstants.block.paragraph);
      } else {
        block.set("type", type);
      }
    };
    this.helper(vector, fn);
    this.resetCookies();
    this.updateStyles(vector);
  }

  styleElements(vector, options) {
    var fn = function(block, start, end) {
      var element = new Element({ type: options.type, url: options.url });
      element.setOffsets(start, end);
      block.parseElement(element);
    };
    this.helper(vector, fn);
    this.resetCookies();
    this.updateStyles(vector);
  }

  updateLink(link) {
    this._link = link;
  }

  updatePoint(point) {
    this._point = point;
    this._vector = null;
  }

  updateStyles(vector) {
    this._styles = vector ? this.filterStyles(vector) : {};
  }

  updateVector(vector) {
    this._point = null;
    this._vector = vector;
    this.updateStyles();
  }

  // --------------------------------------------------
  // Dispatch
  // --------------------------------------------------
  handleDispatch(payload) {
    var action = payload.action;
    switch (action.type) {
      case ActionConstants.editor.addBlock:
        return this.addBlock(action.point, action.block);
      case ActionConstants.editor.addSection:
        return this.addSection(action.point, action.options);
      case ActionConstants.editor.removeBlock:
        return this.removeBlock(action.point);
      case ActionConstants.editor.removeBlocks:
        return this.removeBlocks(action.vector, action.options);
      case ActionConstants.editor.resetCookies:
        return this.resetCookies();
      case ActionConstants.editor.splitBlock:
        return this.splitBlock(action.point);
      case ActionConstants.editor.styleBlocks:
        return this.styleBlocks(action.vector, action.options);
      case ActionConstants.editor.styleElements:
        return this.styleElements(action.vector, action.options);
      case ActionConstants.editor.updateLink:
        return this.updateLink(action.link);
      case ActionConstants.editor.updatePoint:
        return this.updatePoint(action.point);
      case ActionConstants.editor.updateVector:
        return this.updateVector(action.vector);
    };
  }
}


module.exports = new EditorStore();
