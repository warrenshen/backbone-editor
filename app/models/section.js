import Model from "app/templates/model";

import Block from "app/models/block";

import ModelDirectory from "app/directories/model_directory";

import TypeConstants from "app/constants/type_constants";


class Section extends Model {

  // --------------------------------------------------
  // Setup
  // --------------------------------------------------
  initialize() {
    if (!this.length) {
      this.addBlock(new Block());
    } else {
      this.resetIndices();
    }
  }

  // --------------------------------------------------
  // Getters
  // --------------------------------------------------
  get defaults() {
    return {
      index: 0,
      type: TypeConstants.section.standard,
    };
  }

  get footer() {
    return this.get("blocks").at(this.length - 1);
  }

  get leader() {
    return this.get("blocks").at(0);
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
    block.set("section_index", this.get("index"));
    this.get("blocks").add(block, { at: index });
    this.resetIndices();
  }

  cloneDestructively(index) {
    var section = new Section({ type: this.get("type") });
    var blocks = this.get("blocks");
    for (var i = 0; i < this.length - index; i += 1) {
      section.get("blocks").add(blocks.pop(), { at: 0 });
    }
    return section;
  }

  mergeSection(section) {
    if (this.get("type") !== section.get("type")) {
      return false;
    } else {
      var index = this.length;
      var models = section.get("blocks").models;
      for (var i = 0; i < section.length; i += 1) {
        this.addBlock(models.shift(), index);
      }
      return true;
    }
  }

  removeBlock(block) {
    this.get("blocks").remove(block);
    this.resetIndices();
  }

  resetIndices() {
    this.get("blocks").map(function(block, index) {
      block.set("index", index);
      block.set("section_index", this.get("index"));
      block.set("is_last", index === this.length - 1 && this.get("is_last"));
    }, this);
  }
}


module.exports = Section;
