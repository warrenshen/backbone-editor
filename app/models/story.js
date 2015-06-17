import _ from "lodash"

import Model from "app/templates/model";

import Block from "app/models/block";
import Section from "app/models/section";

import ModelDirectory from "app/directories/model_directory";


class Story extends Model {

  // --------------------------------------------------
  // Setup
  // --------------------------------------------------
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
    this.updateIndices();
  }

  mergeSections() {
    var sections = this.get("sections");

    for (var i = 0; i < sections.length - 1; i += 1) {
      if (sections.at(i).mergeSection(sections.at(i + 1))) {
        sections.remove(sections.at(i + 1));
        i -= 1;
      }
    }

    this.updateIndices();
  }

  updateIndices() {
    this.get("sections").map(function(section, index) {
      section.set("index", index);

      if (index === this.length - 1) {
        section.set("is_last", true);
      } else {
        section.set("is_last", false);
      }
    }, this);
  }
}


module.exports = Story;
