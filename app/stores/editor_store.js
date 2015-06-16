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

  // --------------------------------------------------
  // Setup
  // --------------------------------------------------
  setDefaults() {
    this._activeStyles = {};
    this._link = null;
    this._mouseState = TypeConstants.mouse.up;
    this._point = new Point(0, 0, 0);
    this._story = new Story();
    this._vector = null;
  }

  // --------------------------------------------------
  // Getters
  // --------------------------------------------------
  get activeStyles() {
    return this._activeStyles;
  }

  get link() {
    return this._link;
  }

  get mouseState() {
    return this._mouseState;
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
  currentSection(sectionIndex) {
    var story = this._story;
    return story.get("sections").at(sectionIndex);
  }

  // TODO: Can we just use a point as the only parameter?
  priorBlock(sectionIndex, blockIndex) {
    var story = this._story;
    var sections = story.get("sections");
    var section = sections.at(sectionIndex);

    if (blockIndex > 0) {
      return section.get("blocks").at(blockIndex - 1);
    } else if (sectionIndex > 0) {
      var priorSection = sections.at(sectionIndex - 1);
      return priorSection.get("blocks").at(priorSection.length - 1);
    } else {
      return null;
    }
  }

  currentBlock(sectionIndex, blockIndex) {
    var story = this._story;
    var section = story.get("sections").at(sectionIndex);
    return section.get("blocks").at(blockIndex);
  }

  nextBlock(sectionIndex, blockIndex) {
    var story = this._story;
    var sections = story.get("sections");
    var section = sections.at(sectionIndex);

    if (blockIndex < section.length - 1) {
      return section.get("blocks").at(blockIndex + 1);
    } else if (sectionIndex < sections.length - 1) {
      return sections.at(sectionIndex + 1).get("blocks").at(0);
    } else {
      return null;
    }
  }

  // --------------------------------------------------
  // Actions
  // --------------------------------------------------
  addSection(section, index=0) {
    var story = this._story;
    story.addSection(section, index);
  }

  addBlock(block, point) {
    var story = this._story;
    var section = story.get("sections").at(point.sectionIndex);

    section.addBlock(block, point.blockIndex);

    if (block.get("type") === TypeConstants.block.divider) {
      point.blockIndex += 1;
    }

    this.updatePoint(point);
  }

  mergeBlock(target, point) {
    var story = this._story;
    var section = story.get("sections").at(point.sectionIndex);
    var blocks = section.get("blocks");
    var block = blocks.at(point.blockIndex);

    block.mergeBlock(target, point.caretOffset);
    blocks.remove(target);
  }

  removeBlock(point) {
    var sectionIndex = point.sectionIndex;
    var blockIndex = point.blockIndex;

    var currentSection = this.currentSection(sectionIndex);
    var currentBlock = this.currentBlock(sectionIndex, blockIndex);
    var priorBlock = this.priorBlock(sectionIndex, blockIndex);

    point.sectionIndex = priorBlock.get("section_index");
    point.blockIndex = priorBlock.get("index");
    point.caretOffset = priorBlock.length;

    if (priorBlock.get("type") === TypeConstants.block.divider) {
      currentSection.removeBlock(priorBlock);
    } else if (priorBlock.get("type") === TypeConstants.block.image) {
      if (currentBlock.get("content") ||
          (currentSection.get("last") && currentBlock.get("local_last"))) {
        return;
      } else {
        currentSection.removeBlock(currentBlock);
      }
    } else {
      priorBlock.mergeBlock(currentBlock, priorBlock.length);
      currentSection.removeBlock(currentBlock);
    }

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

    var sectionBucket = [];
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
        sectionBucket.push(section);
        complete = true;
      }

      if (!complete) {
        var blockBucket = [];

        for (var blockIndex of blockIndices) {
          var block = blocks.at(blockIndex);

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
          blocks.remove(block);
        }

        section.updateIndices();
      }
    }

    for (var section of sectionBucket) {
      sections.remove(section);
    }

    if (options.character || options.enter) {
      var startBlock = this.currentBlock(startSectionIndex, startBlockIndex);

      if (options.character) {
        startBlock.addFragment(options.character, startCaretOffset);
        startPoint.caretOffset += 1;
      } else if (options.enter) {
        // TODO: This needs fixing.
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

    var currentBlock = this.currentBlock(sectionIndex, blockIndex);
    var nextBlock = this.nextBlock(sectionIndex, blockIndex);

    while (nextBlock && nextBlock.get("type") === TypeConstants.block.divider) {
      nextBlock = this.nextBlock(nextBlock.get("section_index"), nextBlock.get("index"));
    }

    if (nextBlock) {
      point.sectionIndex = nextBlock.get("section_index");
      point.blockIndex = nextBlock.get("index");
    } else {
      point.caretOffset = currentBlock.length;
    }

    this.updatePoint(point);
  }

  shiftLeft(point) {
    var priorBlock = this.priorBlock(point.sectionIndex, point.blockIndex);

    while (priorBlock && priorBlock.get("type") === TypeConstants.block.divider) {
      priorBlock = this.priorBlock(priorBlock.get("section_index"), priorBlock.get("index"));
    }

    if (priorBlock) {
      point.sectionIndex = priorBlock.get("section_index");
      point.blockIndex = priorBlock.get("index");
      point.caretOffset = priorBlock.length;
    }

    this.updatePoint(point);
  }

  shiftRight(point) {
    var nextBlock = this.nextBlock(point.sectionIndex, point.blockIndex);
    while (nextBlock && nextBlock.get("type") === TypeConstants.block.divider) {
      nextBlock = this.nextBlock(nextBlock.get("section_index"), nextBlock.get("index"));
    }

    if (nextBlock) {
      point.sectionIndex = nextBlock.get("section_index");
      point.blockIndex = nextBlock.get("index");
      point.caretOffset = 0;
    }

    this.updatePoint(point);
  }

  shiftUp(point) {
    var priorBlock = this.priorBlock(point.sectionIndex, point.blockIndex);
    while (priorBlock && priorBlock.get("type") === TypeConstants.block.divider) {
      priorBlock = this.priorBlock(priorBlock.get("section_index"), priorBlock.get("index"));
    }

    if (priorBlock) {
      point.sectionIndex = priorBlock.get("section_index");
      point.blockIndex = priorBlock.get("index");
      point.shouldFloor = true;
    } else {
      point.caretOffset = 0;
    }

    this.updatePoint(point);
  }

  splitBlock(point) {
    var story = this._story;
    var section = story.get("sections").at(point.sectionIndex);
    var block = section.get("blocks").at(point.blockIndex);
    var clone = block.destructiveClone(point.caretOffset);

    if (!clone.length) {
      clone.set("type", TypeConstants.block.standard);
    }

    section.addBlock(clone, block.get("index") + 1);
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

  // TODO: Set up better support for links.
  styleElements(vector, which, link) {
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
        var element = new Element({ type: which, link: link });

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
  }

  updateLink(link) {
    this._link = link;
  }

  updateMouseState(mouseState) {
    if (this._point !== null) {
      this._point = null;
    }

    this._mouseState = mouseState;
  }

  updatePoint(point) {
    if (this._mouseState !== TypeConstants.mouse.up) {
      this.updateMouseState(TypeConstants.mouse.up);
    }

    this._point = point;
    this._vector = null;
  }

  updateVector(vector) {
    if (this._mouseState !== TypeConstants.mouse.move) {
      this.updateMouseState(TypeConstants.mouse.move);
    }

    this._point = null;
    this._vector = vector;

    if (vector !== null) {
      this.updateActiveStyles(vector);
    }
  }

  // --------------------------------------------------
  // Dispatch
  // --------------------------------------------------
  handleDispatch(payload) {
    var action = payload.action;
    switch (action.type) {
      case ActionConstants.editor.addBlock:
        this.addBlock(action.block, action.point);
        break;
      case ActionConstants.editor.mergeBlock:
        this.mergeBlock(action.block, action.point);
        break;
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
        this.styleElements(action.vector, action.which, action.link);
        break;
      case ActionConstants.editor.updateMouseState:
        this.updateMouseState(action.mouseState);
        break;
      case ActionConstants.editor.updateLink:
        this.updateLink(action.link);
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
