import Model from "app/templates/model";
import ModelDirectory from "app/directories/model_directory";


class Section extends Model {

  // --------------------------------------------------
  // Defaults
  // --------------------------------------------------
  get defaults() {
    return {
      index: 0,
      type: "standard",
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

  // --------------------------------------------------
  // Actions
  // --------------------------------------------------
  addBlock(block, index=0) {
    this.get("blocks").add(block, { at: index });
  }
}


module.exports = Section;
