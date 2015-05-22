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
    this._vector = new Vector(new Point(0, 0), new Point(0, 0));
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

    if (startPoint.compareShallowly(endPoint)) {
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

    // sections = post.getSections().models
    // if startSectionIndex is endSectionIndex and startBlockIndex is endBlockIndex
    //   section = sections[startSectionIndex]
    //   block = section.getBlocks().models[startBlockIndex]
    //   newBlock = new Block(block_type: Block.types.paragraph)

    //   unless endCaretOffset is block.getLength()
    //     newText = block.getText().substring(endCaretOffset)
    //     savedElements = block.removeElementsFromOffset(endCaretOffset)
    //     newBlock.setText(newText)
    //     newBlock.addElementsWithOffset(endCaretOffset, savedElements)
    //     section.addBlock(newBlock, startBlockIndex + 1)

    //   block.removeFragment(startCaretOffset, block.getLength())

    // else
    //   @removeSelection(selection)
    //   section = sections[startSectionIndex]
    //   anotherBlock = new Block(block_type: Block.types.paragraph)
    //   section.addBlock(anotherBlock, startBlockIndex + 1)
    //   @updateCaret(new Point(startSectionIndex, startBlockIndex + 1, 0))
    //   section.updateBlockIndices()

    // post.mergeSections()
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
    }
  }
}


module.exports = new EditorStore();
