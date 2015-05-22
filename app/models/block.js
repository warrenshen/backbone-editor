import Model from "app/templates/model";
import ModelDirectory from "app/directories/model_directory";


class Block extends Model {

  get defaults() {
    return {
      centered: false,
      content: "",
      image_url: "",
      index: 0,
      type: "paragraph",
    };
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

  get length() {
    return this.get("content").length;
  }
}


module.exports = Block;
