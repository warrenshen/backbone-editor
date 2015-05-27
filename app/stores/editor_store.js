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
    // TODO: Turn mouse states into constants.
    this._mouse = "Up";
    this._point = new Point();
    this._story = new Story();
    this._vector = null;

    var initialSection = new Section();
    this.addSection(initialSection);
    initialSection.addBlock(new Block());
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

  get mouse() {
    return this._mouse;
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

  set mouse(mouse) {
    this._mouse = mouse;
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

    var content = block.get("content");
    beforeBlock.set("content", beforeBlock.get("content") + content);
    point.caretOffset = beforeBlock.length;

    section.removeBlock(block);
    this.updatePoint(newPoint);
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
      newBlock.set("content", block.get("content").substring(caretOffset));
      newBlock.set("type", block.get("type"));
      // TODO: Extract "new" elements and add to new block here.
      block.removeFragment(caretOffset, block.length);
    }

    section.addBlock(newBlock, blockIndex + 1);
    point.blockIndex += 1;
    point.caretOffset = 0;
    this.updatePoint(point);
  }

  styleBlock(vector, type) {
    var startPoint = vector.startPoint;
    var endPoint = vector.endPoint;

    var startSectionIndex = startPoint.sectionIndex;
    var endSectionIndex = endPoint.sectionIndex;

    var startBlockIndex = startPoint.blockIndex;
    var endBlockIndex = endPoint.blockIndex;

    var story = this._story;
    var sections = story.get("sections");

    var sectionIndices = _.range(startSectionIndex, endSectionIndex + 1);
    for (var sectionIndex in sectionIndices) {
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

      for (var blockIndex in blockIndices) {
        var block = blocks.at(blockIndex);
        if (block.get("type") === type) {
          block.set("type", TypeConstants.block.standard);
        } else {
          block.set("type", type);
        }
      }
    }

    this.emitChange();
  }

  styleHeading(vector, which) {
    this.styleBlock(vector, TypeConstants.block.headingOne);
  }

  updatePoint(point) {
    this._point = point;
    this._vector = null;
    this.emitChange();
  }

  updateVector(vector) {
    this._point = null;
    this._vector = vector;
    this.emitChange();
  }

  // --------------------------------------------------
  // Dispatch
  // --------------------------------------------------
  // Stores that listen for dispatches must override this method.
  handleDispatch(payload) {
    var action = payload.action;
    switch (action.type) {
      case ActionConstants.editor.removeBlock:
        this.removeBlock(action.point);
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
      case ActionConstants.editor.styleHeading:
        this.styleHeading(action.vector, action.which);
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
