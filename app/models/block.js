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

  // --------------------------------------------------
  // Methods
  // --------------------------------------------------
  addFragment(vector, character) {
    var startPoint = vector.getStartPoint();
    var caretOffset = startPoint.getCaretOffset();

    var content = this.get("content");
    var prefix = content.substring(0, caretOffset);
    var suffix = content.substring(caretOffset);

    this.set("content", prefix + character + suffix);
  }
}


module.exports = Block;
