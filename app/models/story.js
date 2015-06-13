import _ from "lodash"

import Model from "app/templates/model";

import Block from "app/models/block";
import Section from "app/models/section";

import ModelDirectory from "app/directories/model_directory";


class Story extends Model {

  initialize() {
    var section = new Section();
    section.addBlock(new Block());
    this.addSection(section);
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

    var removeBucket = [];
    var indices = _.range(0, sections.length - 1);

    for (var index of indices) {
      var beforeSection = sections.at(index);
      var afterSection = sections.at(index + 1);

      if (beforeSection.get("type") === afterSection.get("type")) {
        afterSection.transferBlocks(beforeSection);
        removeBucket.push(afterSection);
      }
    }

    for (var section of removeBucket) {
      sections.remove(section);
    }
  }

  updateSectionIndices() {
    this.get("sections").map(function(section, index) {
      section.set("index", index);
    });
  }
}


module.exports = Story;
