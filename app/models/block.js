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
  addFragment(offset, character) {
    var content = this.get("content");
    var prefix = content.substring(0, offset);
    var suffix = content.substring(offset);

    this.set("content", prefix + character + suffix);
    // TODO: Shift up elements here.
  }

  removeFragment(startOffset, endOffset) {
    var content = this.get("content");
    var prefix = content.substring(0, startOffset);
    var suffix = content.substring(endOffset);

    this.set("content", prefix + suffix);
    // TODO: Shift down elements here.
  }

  // removeFragment: (startOffset, endOffset) ->
  //   #
  //   # Delete a fragment of text from this block from given start to end offsets.
  //   # @param startOffset (integer) : The offset at which fragment removal should start.
  //   # @param endOffset (integer) : The offset at which fragment removal should end.
  //   #
  //   originalText = @getText()
  //   @setText(originalText[0...startOffset] + originalText[endOffset..])
  //   @shiftDownElements(startOffset, endOffset - startOffset)
}


module.exports = Block;
