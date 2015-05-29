import _ from "lodash"

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
  mergeSections() {
    var trashSections = [];
    var sections = this.get("sections");

    var indices = _.range(0, sections.length - 1);
    for (var index of indices) {
      var leftSection = sections.at(index);
      var rightSection = sections.at(index + 1);

      if (leftSection.get("type") === rightSection.get("type")) {
        leftSection.merge(rightSection);
        trashSections.push(rightSection);
      }
    }

    for (var trashSection of trashSections) {
      sections.remove(trashSection);
    }
  }

  updateSectionIndex(section, index) {
    section.set("index", index);
  }

  updateSectionIndices() {
    this.get("sections").map(this.updateSectionIndex);
  }
}


module.exports = Story;
