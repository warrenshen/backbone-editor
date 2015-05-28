import _ from "lodash"

import Model from "app/templates/model";

import ModelDirectory from "app/directories/model_directory";

import TypeConstants from "app/constants/type_constants";


class Block extends Model {

  get defaults() {
    return {
      centered: false,
      content: "",
      image_url: "",
      index: 0,
      type: TypeConstants.block.standard,
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

  elementComparator(element) {
    return [element.get("type"), element.get("start"), element.get("end")];
  }

  mergeElements() {
    var elements = this.get("elements");
    elements.comparator = this.elementComparator;
    elements.sort();

    var trashElements = [];
    var indices = _.range(0, elements.length - 1);

    for (var index of indices) {
      var leftElement = elements.at(index);
      var rightElement = elements.at(index + 1);

      if (leftElement.coincidesWith(rightElement)) {
        var startOffset = Math.min(leftElement.get("start"), rightElement.get("start"));
        var endOffset = Math.max(leftElement.get("end"), rightElement.get("end"));

        rightElement.setOffsets(startOffset, endOffset);
        trashElements.push(leftElement);
      }
    }

    for (var trashElement of trashElements) {
      elements.remove(trashElements);
    }
  }

  parseElement(newElement) {
    var elements = this.get("elements");
    var trashElements = [];
    var treasureElements = [];

    for (var element of elements.models) {
      if (element.completelyBounds(newElement)) {
        var prefixElement = element.clonePrefix(newElement.get("start"));
        var suffixElement = element.cloneSuffix(newElement.get("end"));

        trashElements.push(element);
        treasureElements.push(prefixElement);
        treasureElements.push(suffixElement);
      }
    }

    if (trashElements.length > 0) {
      for (var trashElement of trashElements) {
        elements.remove(trashElements);
      }

      for (var treasureElement of treasureElements) {
        elements.push(treasureElements);
      }
    } else {
      elements.push(newElement);
      this.mergeElements();
    }
  }

  removeFragment(startOffset, endOffset) {
    var content = this.get("content");
    var prefix = content.substring(0, startOffset);
    var suffix = content.substring(endOffset);

    this.set("content", prefix + suffix);
    // TODO: Shift down elements here.
  }
}


module.exports = Block;
