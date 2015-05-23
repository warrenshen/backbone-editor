import Model from "app/templates/model";
import ModelDirectory from "app/directories/model_directory";


class Story extends Model {

  get defaults() {
    return {};
  }

  get name() {
    return "Story";
  }

  get relations() {
    return [
      {
        type: "HasMany",
        key: "sections",
        relatedModel: ModelDirectory.get("Section"),
      },
    ];
  }

  // --------------------------------------------------
  // Methods
  // --------------------------------------------------
  updateSectionIndex(section, index) {
    section.set("index", index);
  }

  updateSectionIndices() {
    this.get("sections").map(this.updateSectionIndex);
  }
}


module.exports = Story;
