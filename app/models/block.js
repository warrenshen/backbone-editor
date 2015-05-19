import Model from "app/templates/model";


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
