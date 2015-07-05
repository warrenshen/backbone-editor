import Actor from "app/templates/actor";

import ActionConstants from "app/constants/action_constants";


class EditorActor extends Actor {

  addSection(point, options) {
    this.act({
      type: ActionConstants.editor.addSection,
      point: point,
      options: options,
    });
  }

  changeBlock(point, options) {
    this.act({
      type: ActionConstants.editor.changeBlock,
      point: point,
      options: options,
    });
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

  // removeFragment(point, options) {
  //   this.act({
  //     type: ActionConstants.editor.removeFragment,
  //     point: point,
  //     options: options,
  //   });
  // }

  resetCookies() {
    this.act({
      type: ActionConstants.editor.resetCookies,
    });
  }

  selectAll() {
    this.act({
      type: ActionConstants.editor.selectAll,
    });
  }

  splitBlock(point) {
    this.act({
      type: ActionConstants.editor.splitBlock,
      point: point,
    });
  }

  styleBlocks(vector, options) {
    this.act({
      type: ActionConstants.editor.styleBlocks,
      vector: vector,
      options: options,
    })
  }

  styleElements(vector, options) {
    this.act({
      type: ActionConstants.editor.styleElements,
      vector: vector,
      options: options,
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
