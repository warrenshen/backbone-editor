import Actor from "app/templates/actor";

import ActionConstants from "app/constants/action_constants";


class EditorActor extends Actor {

  splitBlock(point) {
    this.act({
      type: ActionConstants.editor.splitBlock,
      point: point,
    });
  }
}


module.exports = new EditorActor();
