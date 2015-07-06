import Model from "app/templates/model";

import Block from "app/models/block";

import ModelDirectory from "app/directories/model_directory";

import TypeConstants from "app/constants/type_constants";


class Section extends Model {

  // --------------------------------------------------
  // Getters
  // --------------------------------------------------
  get defaults() {
    return {
      index: 0,
      is_last: false,
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
  // Conditionals
  // --------------------------------------------------
  isList() {
    return this.get("type") === TypeConstants.section.listOrdered ||
           this.get("type") === TypeConstants.section.listUnordered;
  }

  // --------------------------------------------------
  // Methods
  // --------------------------------------------------
  addBlock(block, index=0) {
    this.get("blocks").add(block, { at: index });
    this.resetIndices();
  }

  addBlocks(blocks, index=0) {
    this.get("blocks").add(blocks, { at: index });
    this.resetIndices();
  }

  cloneDestructively(index) {
    var section = new Section({ type: this.get("type") });
    var blocks = this.get("blocks");
    var bucket = [];
    for (var i = 0; i < this.length - index; i += 1) {
      bucket.unshift(blocks.pop());
    }
    section.addBlocks(bucket);
    return section;
  }

  filterTypes(types) {
    for (var block of this.get("blocks").models) {
      var type = block.get("type");
      if (!types[type]) {
        types[type] = true;
      }
      if (type === TypeConstants.block.image &&
          !types[TypeConstants.block.caption] &&
          block.length) {
        types[TypeConstants.block.caption] = true;
      }
    }
  }

  mergeSection(section) {
    if (this.get("type") !== section.get("type")) {
      return false;
    } else {
      this.addBlocks(section.get("blocks").models, this.length);
      return true;
    }
  }

  removeBlock(block) {
    this.get("blocks").remove(block);
    this.resetIndices();
  }

  resetIndices() {
    this.get("blocks").map(function(block, index) {
      block.set({
        index: index,
        is_last: index === this.length - 1 && this.get("is_last"),
        section_index: this.get("index"),
      });
    }, this);
  }
}


module.exports = Section;
