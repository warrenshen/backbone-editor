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
  getBlock(point) {
    var section = this._story.get("sections").at(point.sectionIndex);
    return section.get("blocks").at(point.blockIndex);
  }

  getSection(point) {
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
    if (addition.isList()) {
      block.set("type", TypeConstants.block.list);
      block.set("content", block.get("content").substring(3));
    } else {
      block.set("type", TypeConstants.block.paragraph);
    }
    addition.addBlock(block);
    story.addSection(addition, point.sectionIndex + 1);
    if (clone.length) {
      story.addSection(clone, point.sectionIndex + 2);
    }
    if (!section.length) {
      story.removeSection(section);
    }
    point.sectionIndex = addition.get("index");
    point.blockIndex = block.get("index");
    point.caretOffset = 0;
    this.resetCookies();
    this.updatePoint(point);
  }

  findStyles(vector) {
    var startPoint = vector.startPoint;
    var endPoint = vector.endPoint;
    var startSectionIndex = startPoint.sectionIndex;
    var endSectionIndex = endPoint.sectionIndex;
    var startBlockIndex = startPoint.blockIndex;
    var endBlockIndex = endPoint.blockIndex;
    var startCaretOffset = startPoint.caretOffset;
    var endCaretOffset = endPoint.caretOffset;
    var styles = {};
    var stylesMaps = [];
    var sectionIndices = _.range(startSectionIndex, endSectionIndex + 1);
    for (var sectionIndex of sectionIndices) {
      var section = this.getSection(sectionIndex);
      var blockIndices = null;
      if (startSectionIndex === endSectionIndex) {
        blockIndices = _.range(startBlockIndex, endBlockIndex + 1);
      } else if (sectionIndex === startSectionIndex) {
        blockIndices = _.range(startBlockIndex, section.length);
      } else if (sectionIndex === endSectionIndex) {
        blockIndices = _.range(0, endBlockIndex + 1);
      } else {
        blockIndices = _.range(0, section.length);
      }
      for (var blockIndex of blockIndices) {
        var block = this.getBlock(sectionIndex, blockIndex);
        var stylesMap = null;
        if (blockIndices[0] === blockIndices[blockIndices.length - 1]) {
          stylesMap = block.filterStyles(startCaretOffset, endCaretOffset);
        } else if (blockIndex === blockIndices[0]) {
          stylesMap = block.filterStyles(startCaretOffset, block.length);
        } else if (blockIndex === blockIndices[blockIndices.length - 1]) {
          stylesMap = block.filterStyles(0, endCaretOffset);
        } else {
          stylesMap = block.filterStyles(0, block.length);
        }
        stylesMaps.push(stylesMap);
      }
    }
    for (var stylesMap of stylesMaps) {
      for (var [type, value] of stylesMap) {
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
        var clone = point.clone();
        clone.blockIndex -= 1;
        previousBlock = this.getBlock(clone);
      } else if (sectionIndex > 0) {
        var clone = point.clone();
        clone.sectionIndex -= 1;
        previousBlock = this.getSection(point).footer;
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
        this.resetCookies();
        this.updatePoint(point);
      }
    }
  }

  removeBlocks(vector, options={}) {
    console.log(vector);
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
      var section = this.getSection(sectionIndex);
      var blockIndices = null;
      var shouldContinue = true;
      if (startSectionIndex === endSectionIndex) {
        blockIndices = _.range(startBlockIndex, endBlockIndex + 1);
      } else if (sectionIndex === startSectionIndex) {
        blockIndices = _.range(startBlockIndex, section.length);
      } else if (sectionIndex === endSectionIndex) {
        blockIndices = _.range(0, endBlockIndex + 1);
      } else {
        sectionBucket.push(section);
        shouldContinue = false;
      }
      if (shouldContinue) {
        var blockBucket = [];
        for (var blockIndex of blockIndices) {
          var block = this.getBlock(sectionIndex, blockIndex);
          if (blockIndices[0] === blockIndices[blockIndices.length - 1]) {
            block.removeFragment(startCaretOffset, endCaretOffset);
          } else if (blockIndex === blockIndices[0]) {
            block.removeFragment(startCaretOffset, block.length);
          } else if (blockIndex === blockIndices[blockIndices.length - 1] &&
                     endCaretOffset !== block.length) {
            block.removeFragment(0, endCaretOffset);
          } else {
            blockBucket.push(block);
          }
        }
        for (var block of blockBucket) {
          section.removeBlock(block);
        }
      }
    }
    for (var section of sectionBucket) {
      this._story.removeSection(section);
    }
    if (options.character) {
      var block = this.getBlock(startPoint);
      block.addFragment(options.character, startCaretOffset);
      startPoint.caretOffset += 1;
    } else if (options.enter) {
      var block = this.getBlock(startPoint);
      var clone = block.cloneDestructively(startCaretOffset);
      var section = this.getSection(startPoint);
      section.addBlock(clone, startBlockIndex + 1);
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
    var clone = block.cloneDestructively(point.caretOffset);
    if (!clone.length) {
      clone.set("type", TypeConstants.block.paragraph);
    }
    point.blockIndex += 1;
    point.caretOffset = 0;
    this.addBlock(point, clone);
  }

  styleBlocks(vector, options) {
    var startPoint = vector.startPoint;
    var endPoint = vector.endPoint;
    var startSectionIndex = startPoint.sectionIndex;
    var endSectionIndex = endPoint.sectionIndex;
    var startBlockIndex = startPoint.blockIndex;
    var endBlockIndex = endPoint.blockIndex;
    var sectionIndices = _.range(startSectionIndex, endSectionIndex + 1);
    for (var sectionIndex of sectionIndices) {
      var section = this.getSection(sectionIndex);
      var blockIndices = null;
      if (startSectionIndex === endSectionIndex) {
        blockIndices = _.range(startBlockIndex, endBlockIndex + 1);
      } else if (sectionIndex === startSectionIndex) {
        blockIndices = _.range(startBlockIndex, section.length);
      } else if (sectionIndex === endSectionIndex) {
        blockIndices = _.range(0, endBlockIndex + 1);
      } else {
        blockIndices = _.range(0, section.length);
      }
      for (var blockIndex of blockIndices) {
        var block = this.getBlock(sectionIndex, blockIndex);
        var type = options.type;
        if (type === TypeConstants.block.centered) {
          block.set("is_centered", !block.get("is_centered"));
        } else {
          block.set("type", (block.get("type") === type) ?
                             TypeConstants.block.paragraph :
                             type);
        }
      }
    }
    this.resetCookies();
    this.updateStyles(vector);
  }

  styleElements(vector, options) {
    var startPoint = vector.startPoint;
    var endPoint = vector.endPoint;
    var startSectionIndex = startPoint.sectionIndex;
    var endSectionIndex = endPoint.sectionIndex;
    var startBlockIndex = startPoint.blockIndex;
    var endBlockIndex = endPoint.blockIndex;
    var startCaretOffset = startPoint.caretOffset;
    var endCaretOffset = endPoint.caretOffset;
    var sectionIndices = _.range(startSectionIndex, endSectionIndex + 1);
    for (var sectionIndex of sectionIndices) {
      var section = this.getSection(sectionIndex);
      var blockIndices = null;
      if (startSectionIndex === endSectionIndex) {
        blockIndices = _.range(startBlockIndex, endBlockIndex + 1);
      } else if (sectionIndex === startSectionIndex) {
        blockIndices = _.range(startBlockIndex, section.length);
      } else if (sectionIndex === endSectionIndex) {
        blockIndices = _.range(0, endBlockIndex + 1);
      } else {
        blockIndices = _.range(0, section.length);
      }
      for (var blockIndex of blockIndices) {
        var block = this.getBlock(sectionIndex, blockIndex);
        var element = new Element({
          type: options.type,
          url: options.url ? options.url : "",
        });
        if (blockIndices[0] === blockIndices[blockIndices.length - 1]) {
          element.setOffsets(startCaretOffset, endCaretOffset);
        } else if (blockIndex === blockIndices[0]) {
          element.setOffsets(startCaretOffset, block.length);
        } else if (blockIndex === blockIndices[blockIndices.length - 1]) {
          element.setOffsets(0, endCaretOffset);
        } else {
          element.setOffsets(0, block.length);
        }
        block.parseElement(element);
      }
    }
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
    this._styles = vector ? this.findStyles(vector) : {};
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
