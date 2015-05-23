import Actor from "app/templates/actor";

import ActionConstants from "app/constants/action_constants";


class EditorActor extends Actor {

  removeBlock(point) {
    this.act({
      type: ActionConstants.editor.removeBlock,
      point: point,
    });
  }

  splitBlock(point) {
    this.act({
      type: ActionConstants.editor.splitBlock,
      point: point,
    });
  }

  updatePoint(point) {
    this.act({
      type: ActionConstants.editor.updatePoint,
      point: point,
    });
  }

  updateVector(point) {
    this.act({
      type: ActionConstants.editor.updateVector,
      vector: vector,
    });
  }
}


module.exports = new EditorActor();
