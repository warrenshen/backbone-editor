import Actions from "app/templates/actor";

import ActionConstants from "app/constants/action_constants";


class EditorActor extends Actor {

  create(attributes) {
    this.act({
      type: ActionConstants.editor.create,
      attributes: attributes,
    });
  }
}


module.exports = new EditorActor();
