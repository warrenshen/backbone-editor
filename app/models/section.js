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

  get length() {
    return this.get("blocks").length;
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

  // --------------------------------------------------
  // Methods
  // --------------------------------------------------
  addBlock(block, index=0) {
    this.get("blocks").add(block, { at: index });
    this.updateBlockIndices();
  }

  transferBlocks(otherSection) {
    var blocks = this.get("blocks").models;
    for (var i = 0; i < this.length; i += 1) {
      otherSection.addBlock(blocks.shift(), blocks.length);
    }
  }

  removeBlock(block) {
    this.get("blocks").remove(block);
    this.updateBlockIndices();
  }

  updateBlockIndices() {
    this.get("blocks").map(function(block, index) {
      block.set("index", index);
    });
  }
}


module.exports = Section;
