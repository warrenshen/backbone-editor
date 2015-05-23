import Store from "app/templates/store";

import Block from "app/models/block";
import Element from "app/models/element";
import Section from "app/models/section";
import Story from "app/models/story";

import Point from "app/helpers/point";
import Vector from "app/helpers/vector";

import ActionConstants from "app/constants/action_constants";


class EditorStore extends Store {

  setDefaults() {
    this._point = new Point();
    this._story = new Story();
    this._vector = new Vector();
    var initialSection = new Section();
    this.addSection(initialSection);
    initialSection.addBlock(new Block({ content: "Welcome to the editor." }));
    // initialSection.addBlock(new Block());
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

  // --------------------------------------------------
  // Getters
  // --------------------------------------------------
  getPoint() {
    return this._point;
  }

  getStory() {
    return this._story;
  }

  getVector() {
    return this._vector;
  }

  // --------------------------------------------------
  // Actions
  // --------------------------------------------------
  addSection(section, index=0) {
    var story = this._story;
    story.get("sections").add(section, { at: index });
    this.emitChange();
  }

  removeBlock(point) {
    if (!point.prefixesEverything()) {
      var story = this._story;

      var sectionIndex = point.getSectionIndex();
      var blockIndex = point.getBlockIndex();

      var sections = story.get("sections").models;
      var section = sections[sectionIndex];

      var blocks = section.get("blocks").models;
      var block = blocks[blockIndex];

      var beforeBlock;
      if (blockIndex === 0) {
        var beforeSection = sections[sectionIndex - 1];
        // TODO: Create get last block convenience method.
        beforeBlock = beforeSection.getLastBlock();
      } else {
        beforeBlock = blocks[blockIndex - 1];
      }

      var content = block.get("content");
      if (content.length > 0) {
        beforeBlock.set("content", beforeBlock.get("content") + content);
        beforeBlock.set("type", block.get("type"));
      }

      section.removeBlock(block);
      // TODO: Refactor below method invocation.
      this.updatePoint(new Point(sectionIndex - 1, beforeSection.get("blocks").length, beforeBlock.length));
      this.emitChange();
    }
  }

  splitBlock(point) {
    var story = this._story;

    var sectionIndex = point.getSectionIndex();
    var blockIndex = point.getBlockIndex();
    var caretOffset = point.getCaretOffset();

    var section = story.get("sections").models[sectionIndex];
    var block = section.get("blocks").models[blockIndex];

    var newBlock = new Block();
    if (caretOffset < block.length) {
      newBlock.set("content", block.get("content").substring(caretOffset));
      newBlock.set("type", block.get("type"));
      // TODO: Extract "new" elements and add to new block here.
      block.removeFragment(caretOffset, block.length);
    }
    section.addBlock(newBlock, blockIndex + 1);
    this.updatePoint(new Point(sectionIndex, blockIndex + 1, 0));
  }

  updatePoint(point) {
    this._point = point;
    this._vector = null;
    console.log("updating point");
    this.emitChange();
  }

  updateVector(vector) {
    this._point = null;
    this._vector = vector;
    console.log("updating vector");
    // TODO: Should this be manually called?
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
      case ActionConstants.editor.splitBlock:
        this.splitBlock(action.point);
        break;
      case ActionConstants.editor.updatePoint:
        this.updatePoint(action.point);
        break;
      case ActionConstants.editor.updateVector:
        this.updateVector(action.vector);
        break;
    }
  }
}


module.exports = new EditorStore();
