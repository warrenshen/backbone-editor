import _ from "lodash"

import Model from "app/templates/model";

import Block from "app/models/block";
import Section from "app/models/section";

import ModelDirectory from "app/directories/model_directory";


class Story extends Model {

  intialize() {
    this.addSection(new Section().addBlock(new Block()));
  }

  // --------------------------------------------------
  // Getters
  // --------------------------------------------------
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
  addSection(section, index=0) {
    this.get("sections").add(section, { at: index });
    this.updateSectionIndices();
  }

  mergeSections() {
    var sections = this.get("sections");

    var oldSections = [];
    var indices = _.range(0, sections.length - 1);
    for (var index of indices) {
      var leftSection = sections.at(index);
      var rightSection = sections.at(index + 1);

      if (leftSection.get("type") === rightSection.get("type")) {
        rightSection.transferBlocks(leftSection);
        oldSections.push(rightSection);
      }
    }

    for (var oldSection of oldSections) {
      sections.remove(oldSection);
    }
  }

  updateSectionIndices() {
    this.get("sections").map(function(section, index) {
      section.set("index", index);
    });
  }
}


module.exports = Story;
