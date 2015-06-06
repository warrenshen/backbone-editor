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
  addCharacter(offset, character) {
    var content = this.get("content");
    var prefix = content.substring(0, offset);
    var suffix = content.substring(offset);

    this.set("content", prefix + character + suffix);

    var elements = this.get("elements");
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
    var styles = [];
    var type = this.get("type");

    styles.push([TypeConstants.block.centered, this.get("centered")]);
    styles.push([TypeConstants.block.headingOne, type === TypeConstants.block.headingOne]);
    styles.push([TypeConstants.block.headingTwo, type === TypeConstants.block.headingTwo]);
    styles.push([TypeConstants.block.headingThree, type === TypeConstants.block.headingThree]);
    styles.push([TypeConstants.block.quote, type === TypeConstants.block.quote]);

    var elements = this.get("elements");
    for (var element of elements.models) {
      if (element.get("start") <= startOffset && element.get("end") >= endOffset) {
        styles.push([element.get("type"), true]);
      }
    }

    return new Map(styles);
  }

  mergeElements() {
    var elements = this.get("elements");
    elements.comparator = this.elementComparator;
    elements.sort();

    var oldElements = [];
    var indices = _.range(0, elements.length - 1);
    for (var index of indices) {
      var leftElement = elements.at(index);
      var rightElement = elements.at(index + 1);

      if (leftElement.coincidesWith(rightElement)) {
        var start = Math.min(leftElement.get("start"), rightElement.get("start"));
        var end = Math.max(leftElement.get("end"), rightElement.get("end"));

        rightElement.setRange(start, end);
        oldElements.push(leftElement);
      }
    }

    for (var oldElement of oldElements) {
      elements.remove(oldElement);
    }
  }

  parseElement(targetElement) {
    var elements = this.get("elements");

    var oldElements = [];
    var newElements = [];
    for (var element of elements.models) {
      if (element.completelyBounds(targetElement)) {
        var prefixElement = element.clonePrefix(targetElement.get("start"));
        var suffixElement = element.cloneSuffix(targetElement.get("end"));

        oldElements.push(element);
        newElements.push(prefixElement);
        newElements.push(suffixElement);
      }
    }

    if (oldElements.length > 0) {
      for (var oldElement of oldElements) {
        elements.remove(oldElement);
      }
      for (var newElement of newElements) {
        elements.push(newElement);
      }
    } else {
      elements.push(targetElement);
      this.mergeElements();
    }
  }

  transferFragment(otherBlock, offset) {
    var elements = this.get("elements");

    var oldElements = [];
    var newElements = [];
    var saveElements = [];
    for (var element of elements.models) {
      if (element.get("start") >= offset) {
        oldElements.push(element);
        newElements.push(element);
      } else if (element.get("end") > offset) {
        var prefixElement = element.clonePrefix(offset);
        var suffixElement = element.cloneSuffix(offset);

        oldElements.push(element);
        newElements.push(suffixElement);
        saveElements.push(prefixElement);
      }
    }

    for (var saveElement of saveElements) {
      elements.push(saveElement);
    }
    for (var oldElement of oldElements) {
      elements.remove(oldElement);
    }

    var otherElements = otherBlock.get("elements");
    for (var newElement of newElements) {
      var anchor = otherBlock.length - offset;
      var start = newElement.get("start") + anchor;
      var end = newElement.get("end") + anchor;

      newElement.setRange(start, end);
      otherElements.push(newElement);
    }

    var content = this.get("content").substring(offset);
    var otherContent = otherBlock.get("content");

    otherBlock.set("content", otherContent + content);
    this.removeFragment(offset, this.length);
  }

  removeFragment(startOffset, endOffset) {
    var elements = this.get("elements");
    var content = this.get("content");
    var prefix = content.substring(0, startOffset);
    var suffix = content.substring(endOffset);

    this.set("content", prefix + suffix);

    var oldElements = [];
    for (var element of elements.models) {
      var start = element.get("start");
      var end = element.get("end");
      var length = endOffset - startOffset;

      if (start >= startOffset && end <= endOffset) {
        oldElements.push(element);
      }

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

    for (var oldElement of oldElements) {
      elements.remove(oldElements);
    }
  }
}


module.exports = Block;
