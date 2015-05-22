import Actor from "app/templates/actor";

import ActionConstants from "app/constants/action_constants";


class EditorActor extends Actor {

  splitBlock(vector) {
    this.act({
      type: ActionConstants.editor.splitBlock,
      vector: vector,
    });
  }

  updateVector(vector) {
    this.act({
      type: ActionConstants.editor.updateVector,
      vector: vector,
    });
  }
}


module.exports = new EditorActor();
