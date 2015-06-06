import _ from "lodash"

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

  setDefaults() {
    this._mouseState = TypeConstants.mouse.up;
    this._point = new Point();
    this._story = new Story();
    this._activeStyles = {};
    this._vector = null;

    var initialSection = new Section();
    initialSection.addBlock(new Block());
    this.addSection(initialSection);
  }

  // --------------------------------------------------
  // Defaults
  // --------------------------------------------------
  get name() {
    return "EditorStore";
  }

  get model() {
    return Story;
  }

  get activeStyles() {
    return this._activeStyles;
  }

  get mouseState() {
    return this._mouseState;
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
  // Actions
  // --------------------------------------------------
  addSection(section, index=0) {
    var story = this._story;
    story.get("sections").add(section, { at: index });
    story.updateSectionIndices();
    this.emitChange();
  }

  removeBlock(point) {
    var sectionIndex = point.sectionIndex;
    var blockIndex = point.blockIndex;

    var story = this._story;
    var sections = story.get("sections");
    var section = sections.at(sectionIndex);
    var blocks = section.get("blocks");
    var block = blocks.at(blockIndex);

    var beforeBlock;
    if (blockIndex === 0) {
      beforeBlock = sections.at(sectionIndex - 1).getLastBlock();
      point.sectionIndex -= 1;
      point.blockIndex = beforeSection.length;
    } else {
      beforeBlock = blocks.at(blockIndex - 1);
      point.blockIndex -= 1;
    }

    point.caretOffset = beforeBlock.length;
    block.transferFragment(beforeBlock, 0);
    section.removeBlock(block);
    this.updatePoint(point);
  }

  removeBlocks(vector, options={}) {
    var startPoint = vector.startPoint;
    var endPoint = vector.endPoint;

    var startSectionIndex = startPoint.sectionIndex;
    var endSectionIndex = endPoint.sectionIndex;

    var startBlockIndex = startPoint.blockIndex;
    var endBlockIndex = endPoint.blockIndex;

    var startCaretOffset = startPoint.caretOffset;
    var endCaretOffset = endPoint.caretOffset;

    var story = this._story;
    var sections = story.get("sections");

    var oldSections = [];
    var sectionIndices = _.range(startSectionIndex, endSectionIndex + 1);
    for (var sectionIndex of sectionIndices) {
      var section = sections.at(sectionIndex);
      var blocks = section.get("blocks");

      var blockIndices;
      var complete = false;
      if (startSectionIndex === endSectionIndex) {
        blockIndices = _.range(startBlockIndex, endBlockIndex + 1);
      } else if (sectionIndex === startSectionIndex) {
        blockIndices = _.range(startBlockIndex, blocks.length);
      } else if (sectionIndex === endSectionIndex) {
        blockIndices = _.range(0, endBlockIndex + 1);
      } else {
        oldSections.push(section);
        complete = true;
      }

      if (!complete) {
        var oldBlocks = [];
        for (var blockIndex of blockIndices) {
          var block = blocks.at(blockIndex);
          if (blockIndices[0] === blockIndices[blockIndices.length - 1]) {
            block.removeFragment(startCaretOffset, endCaretOffset);
          } else if (blockIndex === blockIndices[0]) {
            block.removeFragment(startCaretOffset, block.length);
          } else if (blockIndex === blockIndices[blockIndices.length - 1]) {
            if (endCaretOffset === block.length) {
              oldBlocks.push(block);
            } else {
              block.removeFragment(0, endCaretOffset);
            }
          } else {
            oldBlocks.push(block);
          }
        }

        for (var oldBlock of oldBlocks) {
          blocks.remove(oldBlock);
        }

        section.updateBlockIndices();
      }
    }

    for (var oldSection of oldSections) {
      section.remove(oldSections);
    }

    if (options.character || options.enter) {
      var startSection = sections.at(startSectionIndex);
      var startBlock = startSection.get("blocks").at(startBlockIndex);

      if (options.character) {
        startBlock.addCharacter(startCaretOffset, options.character);
        startPoint.caretOffset += 1;
      } else if (options.enter) {
        var newBlock = new Block();
        startBlock.transferFragment(newBlock, startCaretOffset);
        startSection.addBlock(newBlock, startBlockIndex + 1);
      }
    }

    story.mergeSections();
    this.updatePoint(startPoint);
  }

  shiftDown(point) {
    var sectionIndex = point.sectionIndex;
    var blockIndex = point.blockIndex;

    var story = this._story;
    var sections = story.get("sections");
    var section = sections.at(sectionIndex);

    if (blockIndex < section.length - 1) {
      point.blockIndex += 1;
    } else if (sectionIndex === sections.length - 1) {
      var block = section.get("blocks").at(blockIndex);
      point.caretOffset = block.length;
    } else {
      point.sectionIndex += 1;
      point.blockIndex = 0;
    }

    this.updatePoint(point);
  }

  shiftLeft(point) {
    var sectionIndex = point.sectionIndex;
    var blockIndex = point.blockIndex;

    var story = this._story;
    var sections = story.get("sections");

    if (blockIndex === 0) {
      var beforeSection = sections.at(sectionIndex - 1);
      var beforeBlock = beforeSection.get("blocks").at(section.length);
      point.sectionIndex -= 1;
      point.blockIndex = beforeSection.length;
      point.caretOffset = beforeBlock.length;
    } else {
      var section = sections.at(sectionIndex);
      var beforeBlock = section.get("blocks").at(blockIndex - 1);
      point.blockIndex -= 1;
      point.caretOffset = beforeBlock.length;
    }

    this.updatePoint(point);
  }

  shiftRight(point) {
    var sectionIndex = point.sectionIndex;
    var blockIndex = point.blockIndex;

    var story = this._story;
    var sections = story.get("sections");
    var section = sections.at(sectionIndex);

    if (blockIndex < section.length - 1) {
      point.blockIndex += 1;
      point.caretOffset = 0;
    } else if (sectionIndex < sections.length - 1) {
      point.sectionIndex += 1;
      point.blockIndex = 0;
      point.caretOffset = 0;
    } else {
      return;
    }

    this.updatePoint(point);
  }

  shiftUp(point) {
    if (!point.prefixesEverything()) {
      var sectionIndex = point.sectionIndex;
      var blockIndex = point.blockIndex;

      var story = this._story;
      var sections = story.get("sections");

      if (blockIndex === 0) {
        point.sectionIndex -= 1;
        point.blockIndex = sections.at(sectionIndex).length;
      } else {
        point.blockIndex -= 1;
      }
    } else {
      point = new Point();
    }

    point.shouldFloor = true;
    this.updatePoint(point);
  }

  splitBlock(point) {
    var sectionIndex = point.sectionIndex;
    var blockIndex = point.blockIndex;
    var caretOffset = point.caretOffset;

    var story = this._story;
    var section = story.get("sections").at(sectionIndex);
    var block = section.get("blocks").at(blockIndex);

    var newBlock = new Block();
    if (caretOffset < block.length) {
      newBlock.set("type", block.get("type"));
      block.transferFragment(newBlock, caretOffset);
    }

    section.addBlock(newBlock, blockIndex + 1);
    point.blockIndex += 1;
    point.caretOffset = 0;
    this.updatePoint(point);
  }

  styleBlocks(vector, which) {
    var startPoint = vector.startPoint;
    var endPoint = vector.endPoint;

    var startSectionIndex = startPoint.sectionIndex;
    var endSectionIndex = endPoint.sectionIndex;

    var startBlockIndex = startPoint.blockIndex;
    var endBlockIndex = endPoint.blockIndex;

    var story = this._story;
    var sections = story.get("sections");

    var sectionIndices = _.range(startSectionIndex, endSectionIndex + 1);
    for (var sectionIndex of sectionIndices) {
      var section = sections.at(sectionIndex);
      var blocks = section.get("blocks");

      var blockIndices;
      if (startSectionIndex === endSectionIndex) {
        blockIndices = _.range(startBlockIndex, endBlockIndex + 1);
      } else if (sectionIndex === startSectionIndex) {
        blockIndices = _.range(startBlockIndex, blocks.length);
      } else if (sectionIndex === endSectionIndex) {
        blockIndices = _.range(0, endBlockIndex + 1);
      } else {
        blockIndices = _.range(0, blocks.length);
      }

      for (var blockIndex of blockIndices) {
        var block = blocks.at(blockIndex);
        if (which === TypeConstants.block.centered) {
          block.set("centered", !block.get("centered"));
        } else {
          if (block.get("type") === which) {
            block.set("type", TypeConstants.block.standard);
          } else {
            block.set("type", which);
          }
        }
      }
    }

    this.updateActiveStyles(vector);
  }

  styleElements(vector, which) {
    var startPoint = vector.startPoint;
    var endPoint = vector.endPoint;

    var startSectionIndex = startPoint.sectionIndex;
    var endSectionIndex = endPoint.sectionIndex;

    var startBlockIndex = startPoint.blockIndex;
    var endBlockIndex = endPoint.blockIndex;

    var startCaretOffset = startPoint.caretOffset;
    var endCaretOffset = endPoint.caretOffset;

    var story = this._story;
    var sections = story.get("sections");

    var sectionIndices = _.range(startSectionIndex, endSectionIndex + 1);
    for (var sectionIndex of sectionIndices) {
      var section = sections.at(sectionIndex);
      var blocks = section.get("blocks");

      var blockIndices;
      if (startSectionIndex === endSectionIndex) {
        blockIndices = _.range(startBlockIndex, endBlockIndex + 1);
      } else if (sectionIndex === startSectionIndex) {
        blockIndices = _.range(startBlockIndex, blocks.length);
      } else if (sectionIndex === endSectionIndex) {
        blockIndices = _.range(0, endBlockIndex + 1);
      } else {
        blockIndices = _.range(0, blocks.length);
      }

      for (var blockIndex of blockIndices) {
        var block = blocks.at(blockIndex);
        var element = new Element({ type: which });

        if (blockIndices[0] === blockIndices[blockIndices.length - 1]) {
          element.setRange(startCaretOffset, endCaretOffset);
        } else if (blockIndex === blockIndices[0]) {
          element.setRange(startCaretOffset, block.length);
        } else if (blockIndex === blockIndices[blockIndices.length - 1]) {
          element.setRange(0, endCaretOffset);
        } else {
          element.setRange(0, block.length);
        }

        block.parseElement(element);
      }
    }

    this.updateActiveStyles(vector);
  }

  updateActiveStyles(vector) {
    var startPoint = vector.startPoint;
    var endPoint = vector.endPoint;

    var startSectionIndex = startPoint.sectionIndex;
    var endSectionIndex = endPoint.sectionIndex;

    var startBlockIndex = startPoint.blockIndex;
    var endBlockIndex = endPoint.blockIndex;

    var startCaretOffset = startPoint.caretOffset;
    var endCaretOffset = endPoint.caretOffset;

    var story = this._story;
    var sections = story.get("sections");

    var stylesMaps = [];
    var sectionIndices = _.range(startSectionIndex, endSectionIndex + 1);
    for (var sectionIndex of sectionIndices) {
      var section = sections.at(sectionIndex);
      var blocks = section.get("blocks");

      var blockIndices;
      if (startSectionIndex === endSectionIndex) {
        blockIndices = _.range(startBlockIndex, endBlockIndex + 1);
      } else if (sectionIndex === startSectionIndex) {
        blockIndices = _.range(startBlockIndex, blocks.length);
      } else if (sectionIndex === endSectionIndex) {
        blockIndices = _.range(0, endBlockIndex + 1);
      } else {
        blockIndices = _.range(0, blocks.length);
      }

      for (var blockIndex of blockIndices) {
        var block = blocks.at(blockIndex);
        var stylesMap;

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

    var activeStyles = {};
    for (var stylesMap of stylesMaps) {
      for (var [type, value] of stylesMap) {
        if (!value && activeStyles[type])
          activeStyles[type] = false;
        else if (value && activeStyles[type] === undefined) {
          activeStyles[type] = true;
        }
      }
    }

    this._activeStyles = activeStyles;
    this.emitChange();
  }

  updateMouseState(mouseState, shouldEmit=false) {
    this._mouseState = mouseState;
    if (shouldEmit) {
      this.emitChange();
    }
  }

  updatePoint(point) {
    if (this._mouseState !== TypeConstants.mouse.up) {
      this.updateMouseState(TypeConstants.mouse.up);
    }

    this._point = point;
    this._vector = null;
    this.emitChange();
  }

  updateVector(vector) {
    if (this._mouseState !== TypeConstants.mouse.move) {
      this.updateMouseState(TypeConstants.mouse.move);
    }

    this._point = null;
    this._vector = vector;

    if (vector === null) {
      this.emitChange();
    } else {
      this.updateActiveStyles(vector);
    }
  }

  // --------------------------------------------------
  // Dispatch
  // --------------------------------------------------
  handleDispatch(payload) {
    var action = payload.action;
    switch (action.type) {
      case ActionConstants.editor.removeBlock:
        this.removeBlock(action.point);
        break;
      case ActionConstants.editor.removeBlocks:
        this.removeBlocks(action.vector, action.options);
        break;
      case ActionConstants.editor.shiftDown:
        this.shiftDown(action.point);
        break;
      case ActionConstants.editor.shiftLeft:
        this.shiftLeft(action.point);
        break;
      case ActionConstants.editor.shiftRight:
        this.shiftRight(action.point);
        break;
      case ActionConstants.editor.shiftUp:
        this.shiftUp(action.point);
        break;
      case ActionConstants.editor.splitBlock:
        this.splitBlock(action.point);
        break;
      case ActionConstants.editor.styleBlocks:
        this.styleBlocks(action.vector, action.which);
        break;
      case ActionConstants.editor.styleElements:
        this.styleElements(action.vector, action.which);
        break;
      case ActionConstants.editor.updateMouseState:
        this.updateMouseState(action.mouseState, action.shouldEmit);
        break;
      case ActionConstants.editor.updatePoint:
        this.updatePoint(action.point);
        break;
      case ActionConstants.editor.updateVector:
        this.updateVector(action.vector);
       break;
    };
  }
}


module.exports = new EditorStore();
