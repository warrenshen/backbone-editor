import Store from "app/templates/store";

import Section from "app/models/section";
import Story from "app/models/story";


class EditorStore extends Store {

  setDefaults() {
    this._current = new Story();
    var initialSection = new Section();
    this.addSection(initialSection);
    // initialSection.addBlock(new Block());
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

  // --------------------------------------------------
  // Dispatch
  // --------------------------------------------------
  // Stores that listen for dispatches must override this method.
  handleDispatch(payload) {

  }
}


module.exports = new EditorStore();
