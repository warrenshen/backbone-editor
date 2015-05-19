import Model from "app/templates/model";
import ModelDirectory from "app/directories/model_directory";


class Block extends Model {

  get defaults() {
    return {};
  }

  get name() {
    return "Block";
  }

  get relations() {
    return [
      {
        type: "HasMany",
        key: "elements",
        relatedModel: ModelDirectory.get("Element"),
      },
    ];
  }
}


module.exports = Block;
