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
      var section = sections.at(i + 1);
      if (sections.at(i).mergeSection(section) || !section.length) {
        sections.remove(section);
        i -= 1;
      }
    }
    this.resetIndices();
  }

  removeSection(section) {
    this.get("sections").remove(section);
    this.mergeSections();
  }

  resetIndices() {
    this.get("sections").map(function(section, index) {
      section.set("index", index);
      section.set("is_last", index === this.length - 1);
      section.resetIndices();
    }, this);
  }
}


module.exports = Story;
