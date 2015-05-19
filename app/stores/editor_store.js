import Store from "app/templates/store";

import Story from "app/models/story";


class EditorStore extends Store {

  setDefaults() {
    this._current = new Story();
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

  // --------------------------------------------------
  // Dispatch
  // --------------------------------------------------
  // Stores that listen for dispatches must override this method.
  handleDispatch(payload) {

  }
}


module.exports = new EditorStore();
