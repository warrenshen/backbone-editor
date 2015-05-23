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
    this._story = new Story();
    this._point = new Point();
    this._vector = new Vector();
    var initialSection = new Section();
    this.addSection(initialSection);
    // initialSection.addBlock(new Block({ content: "Welcome to the editor." }));
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

  // --------------------------------------------------
  // Getters
  // --------------------------------------------------
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
  }

  removeBlock(vector) {
    if (!vector.prefixesEverything()) {
      var story = this._story;
      var point = vector.getStartPoint();

      var sectionIndex = point.getSectionIndex();
      var blockIndex = point.getBlockIndex();

      var sections = story.get("sections").models;
      var section = sections[sectionIndex];

      var blocks = section.get("blocks").models;
      var block = blocks[blockIndex];

      var beforeBlock;
      if (blockIndex === 0) {
        var beforeSection = sections[sectionIndex - 1];
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
      this.updateVector(vector);
      this.emitChange();
    }
  }

  splitBlock(vector) {
    var story = this._story;

    var startPoint = vector.getStartPoint();
    var endPoint = vector.getEndPoint();

    var startSectionIndex = startPoint.getSectionIndex();
    var startBlockIndex = startPoint.getBlockIndex();

    var startCaretOffset = startPoint.getCaretOffset();
    var endCaretOffset = endPoint.getCaretOffset();

    if (startPoint.equalsShallowly(endPoint)) {
      var section = story.get("sections").models[startSectionIndex];
      var block = section.get("blocks").models[startBlockIndex];

      var newBlock = new Block();
      if (endCaretOffset < block.length) {
        newBlock.set("content", block.get("content").substring(endCaretOffset));
        newBlock.set("type", block.get("type"));
        // TODO: Extract "new" elements and add to new block here.
        block.removeFragment(startCaretOffset, block.length);
      }
      section.addBlock(newBlock, startBlockIndex + 1);
      var newPoint = new Point(startSectionIndex, startBlockIndex + 1, 0);
      this.updateVector(new Vector(newPoint, newPoint));
    } else {
      //   @removeSelection(selection)
      //   section = sections[startSectionIndex]
      //   anotherBlock = new Block(block_type: Block.types.paragraph)
      //   section.addBlock(anotherBlock, startBlockIndex + 1)
      //   @updateCaret(new Point(startSectionIndex, startBlockIndex + 1, 0))
      //   section.updateBlockIndices()
    }
    // post.mergeSections()
  }

  updateVector(vector) {
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
        this.removeBlock(action.vector);
        break;
      case ActionConstants.editor.splitBlock:
        this.splitBlock(action.vector);
        break;
      case ActionConstants.editor.updateVector:
        this.updateVector(action.vector);
        break;
    }
  }
}


module.exports = new EditorStore();
