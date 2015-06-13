import _ from "lodash"

import Model from "app/templates/model";

import ModelDirectory from "app/directories/model_directory";

import TypeConstants from "app/constants/type_constants";


class Block extends Model {

  // --------------------------------------------------
  // Getters
  // --------------------------------------------------
  get defaults() {
    return {
      centered: false,
      content: "",
      index: 0,
      section_index: 0,
      source: "",
      type: TypeConstants.block.standard,
    };
  }

  get length() {
    return this.get("content").length;
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

  // --------------------------------------------------
  // Methods
  // --------------------------------------------------
  addCharacter(offset, character) {
    var elements = this.get("elements");
    var content = this.get("content");

    var beforeContent = content.substring(0, offset);
    var afterContent = content.substring(offset);

    this.set("content", beforeContent + character + afterContent);

    for (var element of elements.models) {
      var start = element.get("start");
      var end = element.get("end");

      if (start >= offset) {
        element.setRange(start + 1, end + 1);
      } else if (end >= offset) {
        element.set("end", end + 1);
      }
    }
  }

  elementComparator(element) {
    return [element.get("type"), element.get("start"), element.get("end")];
  }

  filterStyles(startOffset, endOffset) {
    var elements = this.get("elements");
    var type = this.get("type");

    var styleBucket = [];
    var constants = TypeConstants.block;

    styleBucket.push([constants.centered, this.get("centered")]);
    styleBucket.push([constants.headingOne, type === constants.headingOne]);
    styleBucket.push([constants.headingTwo, type === constants.headingTwo]);
    styleBucket.push([constants.headingThree, type === constants.headingThree]);
    styleBucket.push([constants.quote, type === constants.quote]);

    for (var element of elements.models) {
      if (element.get("start") <= startOffset &&
          element.get("end") >= endOffset) {
        styleBucket.push([element.get("type"), true]);
      }
    }

    return new Map(styleBucket);
  }

  mergeElements() {
    var elements = this.get("elements");
    elements.comparator = this.elementComparator;
    elements.sort();

    var removeBucket = [];
    var indices = _.range(0, elements.length - 1);

    for (var index of indices) {
      var beforeElement = elements.at(index);
      var afterElement = elements.at(index + 1);

      if (beforeElement.coincidesWith(afterElement)) {
        var start = Math.min(beforeElement.get("start"), afterElement.get("start"));
        var end = Math.max(beforeElement.get("end"), afterElement.get("end"));

        afterElement.setRange(start, end);
        removeBucket.push(beforeElement);
      }
    }

    for (var element of removeBucket) {
      elements.remove(element);
    }
  }

  parseElement(targetElement) {
    var elements = this.get("elements");

    var pushBucket = [];
    var removeBucket = [];

    for (var element of elements.models) {
      if (element.completelyBounds(targetElement)) {
        var prefixElement = element.clonePrefix(targetElement.get("start"));
        var suffixElement = element.cloneSuffix(targetElement.get("end"));

        pushBucket.push(prefixElement);
        pushBucket.push(suffixElement);
        removeBucket.push(element);
      }
    }

    if (removeBucket.length > 0) {
      for (var element of removeBucket) {
        elements.remove(element);
      }

      for (var element of pushBucket) {
        elements.push(element);
      }
    } else {
      elements.push(targetElement);
      this.mergeElements();
    }
  }

  transferFragment(otherBlock, startOffset) {
    var elements = this.get("elements");
    var otherElements = otherBlock.get("elements");

    var changeBucket = [];
    var pushBucket = [];
    var removeBucket = [];

    for (var element of elements.models) {
      if (element.get("start") >= startOffset) {
        changeBucket.push(element);
        removeBucket.push(element);
      } else if (element.get("end") > startOffset) {
        var prefixElement = element.clonePrefix(startOffset);
        var suffixElement = element.cloneSuffix(startOffset);

        pushBucket.push(prefixElement);
        changeBucket.push(suffixElement);
        removeBucket.push(element);
      }
    }

    for (var element of pushBucket) {
      elements.push(element);
    }

    for (var element of removeBucket) {
      elements.remove(element);
    }

    for (var element of changeBucket) {
      var anchorOffset = otherBlock.length - startOffset;
      var start = element.get("start") + anchorOffset;
      var end = element.get("end") + anchorOffset;

      element.setRange(start, end);
      otherElements.push(element);
    }

    var content = this.get("content").substring(startOffset);
    var otherContent = otherBlock.get("content");

    otherBlock.set("content", otherContent + content);
    otherBlock.mergeElements();
    this.removeFragment(startOffset, this.length);
  }

  removeFragment(startOffset, endOffset) {
    var elements = this.get("elements");
    var content = this.get("content");

    var beforeContent = content.substring(0, startOffset);
    var afterContent = content.substring(endOffset);
    var removeBucket = [];

    for (var element of elements.models) {
      var start = element.get("start");
      var end = element.get("end");
      var length = endOffset - startOffset;

      if (start >= startOffset && end <= endOffset) {
        removeBucket.push(element);
      } else {
        if (start >= startOffset) {
          if (start <= endOffset) {
            element.set("start", startOffset);
          } else {
            element.set("start", start - length);
          }
        }

        if (end > startOffset) {
          if (end <= endOffset) {
            element.set("end", startOffset);
          } else {
            element.set("end", end - length);
          }
        }
      }
    }

    for (var element of removeBucket) {
      elements.remove(element);
    }

    this.set("content", beforeContent + afterContent);
  }
}


module.exports = Block;
