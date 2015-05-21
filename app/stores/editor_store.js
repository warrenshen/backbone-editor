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

  splitBlock(point) {
    console.log(point);
  }

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
