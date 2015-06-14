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
  addFragment(fragment, offset) {
    var elements = this.get("elements");
    var content = this.get("content");

    this.set("content", content.substring(0, offset) +
                        fragment +
                        content.substring(offset));

    for (var element of elements.models) {
      var end = element.get("end");
      var length = fragment.length;

      if (element.get("start") >= offset) {
        element.increment(length);
      } else if (end >= offset) {
        element.set("end", end + length);
      }
    }
  }

  elementComparator(element) {
    return [element.get("type"), element.get("start"), element.get("end")];
  }

  filterStyles(startOffset, endOffset) {
    var elements = this.get("elements");
    var type = this.get("type");

    var headingOne = TypeConstants.block.headingOne;
    var headingTwo = TypeConstants.block.headingTwo;
    var headingThree = TypeConstants.block.headingThree;
    var quote = TypeConstants.block.quote;
    var styleBucket = [];

    styleBucket.push([TypeConstants.block.centered, this.get("centered")]);
    styleBucket.push([headingOne, type === headingOne]);
    styleBucket.push([headingTwo, type === headingTwo]);
    styleBucket.push([headingThree, type === headingThree]);
    styleBucket.push([quote, type === quote]);

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

    for (var i = 0; i < elements.length - 1; i += 1) {
      if (elements.at(i).mergeElement(elements.at(i + 1))) {
        elements.remove(elements.at(i + 1));
      }
    }
  }

  mergeBlock(otherBlock, offset) {
    var elements = this.get("elements");
    var otherElements = otherBlock.get("elements");

    for (var element of otherElements.models) {
      // TODO: Create an increment range method.
      element.increment(offset);
      elements.push(element);
    }

    // TODO: This add fragment will result in incorrect element ranges.
    this.addFragment(otherBlock.get("content"), offset);
    this.mergeElements();
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

  partialClone(offset) {
    var clone = new Block({
      content: content.substring(offset),
      type: this.get("type"),
    });
    var elements = this.get("elements");
    var cloneElements = clone.get("elements");

    for (var element of elements.models) {

    }

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
