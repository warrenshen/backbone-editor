import Actor from "app/templates/actor";

import ActionConstants from "app/constants/action_constants";


class EditorActor extends Actor {

  removeBlock(point) {
    this.act({
      type: ActionConstants.editor.removeBlock,
      point: point,
    });
  }

  shiftDown(point) {
    this.act({
      type: ActionConstants.editor.shiftDown,
      point: point,
    });
  }

  shiftLeft(point) {
    this.act({
      type: ActionConstants.editor.shiftLeft,
      point: point,
    });
  }

  shiftRight(point) {
    this.act({
      type: ActionConstants.editor.shiftRight,
      point: point,
    });
  }

  shiftUp(point) {
    this.act({
      type: ActionConstants.editor.shiftUp,
      point: point,
    });
  }

  splitBlock(point) {
    this.act({
      type: ActionConstants.editor.splitBlock,
      point: point,
    });
  }

  styleBlock(vector, which) {
    this.act({
      type: ActionConstants.editor.styleBlock,
      vector: vector,
      which: which,
    })
  }

  styleElement(vector, which) {
    this.act({
      type: ActionConstants.editor.styleElement,
      vector: vector,
      which: which,
    });
  }

  updateMouseState(mouseState) {
    this.act({
      type: ActionConstants.editor.updateMouseState,
      mouseState: mouseState,
    });
  }

  updatePoint(point) {
    this.act({
      type: ActionConstants.editor.updatePoint,
      point: point,
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
