import Store from "app/templates/store";

import Block from "app/models/block";
import Element from "app/models/element";
import Section from "app/models/section";
import Story from "app/models/story";

import ActionConstants from "app/constants/action_constants";


class EditorStore extends Store {

  setDefaults() {
    this._current = new Story();
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
  // Actions
  // --------------------------------------------------
  addSection(section, index=0) {
    var story = this._current;
    story.get("sections").add(section, { at: index });
  }

  splitBlock(vector) {
    var post = this._current;

    console.log(vector);
  }

  // splitBlock: (point) ->
  //   post = @getCurrentPost()
  //   sectionIndex = point.getSectionIndex()
  //   blockIndex = point.getBlockIndex()
  //   caretOffset = point.getCaretOffset()

  //   section = post.getSections().models[sectionIndex]
  //   blocks = section.getBlocks().models
  //   block = blocks[blockIndex]

  //   needsAdd = true;
  //   nextBlock = new Block(block_type: block.getBlockType())

  //   if blockIndex < blocks.length - 1
  //     afterBlock = blocks[blockIndex + 1]
  //     unless afterBlock.getLength() or afterBlock.hasSpecialType()
  //       needsAdd = false;
  //       nextBlock = afterBlock;
  //       nextBlock.setBlockType(block.getBlockType())

  //   unless caretOffset is block.getLength()
  //     nextText = block.getText().substring(caretOffset)
  //     savedElements = block.removeElementsFromOffset(caretOffset)
  //     block.removeFragment(caretOffset, block.getLength())

  //     nextBlock.setText(nextText)
  //     nextBlock.addElementsWithOffset(caretOffset, savedElements)
  //   else if nextBlock.getBlockType() isnt Block.types.listItem
  //     nextBlock.setBlockType(Block.types.paragraph)

  //   if needsAdd
  //     section.addBlock(nextBlock, blockIndex + 1)
  //   @updateCaret(new Point(sectionIndex, blockIndex + 1, 0))

  //   if not block.getLength() and block.getBlockType() isnt Block.types.listItem
  //     block.setBlockType(Block.types.paragraph)

  // --------------------------------------------------
  // Dispatch
  // --------------------------------------------------
  // Stores that listen for dispatches must override this method.
  handleDispatch(payload) {
    var action = payload.action;
    switch (action.type) {
      case ActionConstants.editor.splitBlock:
        this.splitBlock(action.point);
        break;
    }
  }
}


module.exports = new EditorStore();
