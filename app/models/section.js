import Model from "app/templates/model";
import ModelDirectory from "app/directories/model_directory";


class Section extends Model {

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
}


module.exports = Section;