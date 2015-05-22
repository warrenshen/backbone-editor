import Store from "app/templates/store";

import Block from "app/models/block";
import Element from "app/models/element";
import Section from "app/models/section";
import Story from "app/models/story";

import Vector from "app/helpers/vector";

import ActionConstants from "app/constants/action_constants";


class EditorStore extends Store {

  setDefaults() {
    this._story = new Story();
    this._vector = new Vector();
    var initialSection = new Section();
    this.addSection(initialSection);
    initialSection.addBlock(new Block({ content: "Welcome to the editor." }));
    // initialSection.addBlock(new Block(), 1);
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
        // TODO: Extract "new" elements here.
      }
      section.addBlock(emptyBlock, startBlockIndex + 1);
      // TODO: Should this be manually called?
      this.emitChange();
    }
  }

  updateVector(vector) {
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
