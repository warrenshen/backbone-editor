import Model from "app/templates/model";

import Section from "app/models/section";

import ModelDirectory from "app/directories/model_directory";


class Story extends Model {

  // --------------------------------------------------
  // Getters
  // --------------------------------------------------
  get defaults() {
    return {};
  }

  get length() {
    return this.get("sections").length;
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
  addSection(section, index=0) {
    this.get("sections").add(section, { at: index });
    this.resetIndices();
  }

  mergeSections() {
    var sections = this.get("sections");
    for (var i = 0; i < sections.length - 1; i += 1) {
      if (sections.at(i).mergeSection(sections.at(i + 1))) {
        sections.remove(sections.at(i + 1));
        i -= 1;
      }
    }
    this.resetIndices();
  }


  resetIndices() {
    this.get("sections").map(function(section, index) {
      section.set("index", index);
      section.set("is_last", index === this.length - 1);
    }, this);
  }
}


module.exports = Story;
