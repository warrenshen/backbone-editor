import Actor from "app/templates/actor";

import ActionConstants from "app/constants/action_constants";


class EditorActor extends Actor {

  addBlock(block, point) {
    this.act({
      type: ActionConstants.editor.addBlock,
      block: block,
      point: point,
    });
  }

  mergeBlock(block, point) {
    this.act({
      type: ActionConstants.editor.mergeBlock,
      block: block,
      point: point,
    })
  }

  removeBlock(point) {
    this.act({
      type: ActionConstants.editor.removeBlock,
      point: point,
    });
  }

  removeBlocks(vector, options) {
    this.act({
      type: ActionConstants.editor.removeBlocks,
      vector: vector,
      options: options,
    });
  }

  splitBlock(point) {
    this.act({
      type: ActionConstants.editor.splitBlock,
      point: point,
    });
  }

  styleBlocks(vector, which) {
    this.act({
      type: ActionConstants.editor.styleBlocks,
      vector: vector,
      which: which,
    })
  }

  styleElements(vector, which, link) {
    this.act({
      type: ActionConstants.editor.styleElements,
      vector: vector,
      which: which,
      link: link,
    });
  }

  updateLink(link) {
    this.act({
      type: ActionConstants.editor.updateLink,
      link: link,
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
