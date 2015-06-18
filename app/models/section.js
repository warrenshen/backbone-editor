import Model from "app/templates/model";

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
  // Methods
  // --------------------------------------------------
  addBlock(block, index=0) {
    block.set("section_index", this.get("index"));
    this.get("blocks").add(block, { at: index });
    this.resetIndices();
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
      block.set("section", this);

      if (index === this.length - 1) {
        block.set("is_local_last", true);
      } else {
        block.set("is_local_last", false);
      }
    }, this);
  }

  toCode() {
    var blocks = this.get("blocks");
    var code = "";

    for (var block of blocks.models) {
      code += block.toCode();
    }

    return code;
  }
}


module.exports = Section;
