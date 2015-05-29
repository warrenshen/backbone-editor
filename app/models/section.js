import Model from "app/templates/model";

import ModelDirectory from "app/directories/model_directory";

import TypeConstants from "app/constants/type_constants";


class Section extends Model {

  // --------------------------------------------------
  // Defaults
  // --------------------------------------------------
  get defaults() {
    return {
      index: 0,
      type: TypeConstants.section.standard,
    };
  }

  get name() {
    return "Section";
  }

  get relations() {
    return [
      {
        type: "HasMany",
        key: "blocks",
        relatedModel: ModelDirectory.get("Block"),
      },
    ];
  }

  get length() {
    return this.get("blocks").length;
  }

  // --------------------------------------------------
  // Methods
  // --------------------------------------------------
  mergeWith(other) {
    var blocks = other.get("blocks");
    for (var i = 0; i < other.length; i += 1) {
      var block = blocks.shift();
      this.addBlock(block, blocks.length);
    }
  }

  updateBlockIndex(block, index) {
    block.set("index", index);
  }

  updateBlockIndices() {
    this.get("blocks").map(this.updateBlockIndex);
  }

  // --------------------------------------------------
  // Actions
  // --------------------------------------------------
  addBlock(block, index=0) {
    this.get("blocks").add(block, { at: index });
    this.updateBlockIndices();
  }

  removeBlock(block) {
    this.get("blocks").remove(block);
    this.updateBlockIndices();
  }
}


module.exports = Section;
