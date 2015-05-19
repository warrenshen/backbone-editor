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

  id: null
  block_type: "paragraph"
  index: 0
  creation_index: 0
  text: ""
  centered: false
  image_url: ""

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
