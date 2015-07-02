import _ from "lodash"

import Model from "app/templates/model";

import Formatter from "app/helpers/formatter";

import ModelDirectory from "app/directories/model_directory";

import TypeConstants from "app/constants/type_constants";


class Block extends Model {

  // --------------------------------------------------
  // Getters
  // --------------------------------------------------
  get defaults() {
    return {
      content: "",
      index: 0,
      is_centered: false,
      is_last: false,
      section_index: 0,
      source: "",
      type: TypeConstants.block.paragraph,
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
  // Conditionals
  // --------------------------------------------------
  isCentered() {
    return this.get("is_centered");
  }

  isEditable() {
    return this.get("type") !== TypeConstants.block.divider;
  }

  isImage() {
    return this.get("type") === TypeConstants.block.image;
  }

  isLast() {
    return this.get("is_last");
  }

  isList() {
    return this.get("type") === TypeConstants.block.list;
  }

  isParagraph() {
    return this.get("type") === TypeConstants.block.paragraph;
  }

  isQuote() {
    return this.get("type") === TypeConstants.block.quote;
  }

  // --------------------------------------------------
  // Methods
  // --------------------------------------------------
  addFragment(fragment, offset) {
    var content = this.get("content");
    var elements = this.get("elements");
    this.set("content", content.substring(0, offset) +
                        fragment +
                        content.substring(offset));
    for (var element of elements.models) {
      var end = element.get("end");
      var length = fragment.length;
      if (element.get("start") >= offset) {
        element.incrementOffsets(length);
      } else if (end >= offset) {
        element.set("end", end + length);
      }
    }
  }

  cloneDestructively(offset) {
    var content = this.get("content");
    var block = new Block({
      content: content.substring(offset),
      type: this.get("type"),
    });
    var bucket = [];
    var elements = this.get("elements");
    for (var i = 0; i < elements.length; i += 1) {
      var element = elements.at(i);
      var startOffset = element.get("start");
      if (startOffset < offset && element.get("end") > offset) {
        var clones = element.partialClones(offset, offset);
        var clone = clones[1];
        elements.remove(element);
        bucket.push(clones[0]);
        clone.decrementOffsets(clone.get("start"));
        block.get("elements").push(clone);
        i -= 1;
      } else if (startOffset >= offset) {
        elements.remove(element);
        block.get("elements").push(element.decrementOffsets(offset));
        i -= 1;
      }
    }
    for (var element of bucket) {
      elements.push(element);
    }
    this.set("content", content.substring(0, offset));
    return block;
  }

  elementComparator(element) {
    return [element.get("type"), element.get("start"), element.get("end")];
  }

  filterStyles(firstOffset, lastOffset) {
    var elements = this.get("elements");
    var type = this.get("type");
    var headingOne = TypeConstants.block.headingOne;
    var headingTwo = TypeConstants.block.headingTwo;
    var headingThree = TypeConstants.block.headingThree;
    var bucket = [];
    bucket.push([TypeConstants.block.centered, this.isCentered()]);
    bucket.push([headingOne, type === headingOne]);
    bucket.push([headingTwo, type === headingTwo]);
    bucket.push([headingThree, type === headingThree]);
    bucket.push([TypeConstants.block.quote, this.isQuote()]);
    for (var element of elements.models) {
      if (element.get("start") <= firstOffset &&
          element.get("end") >= lastOffset) {
        bucket.push([element.get("type"), true]);
      }
    }
    return new Map(bucket);
  }

  mergeElements() {
    var elements = this.get("elements");
    elements.comparator = this.elementComparator;
    elements.sort();
    for (var i = 0; i < elements.length - 1; i += 1) {
      if (elements.at(i).mergeElement(elements.at(i + 1))) {
        elements.remove(elements.at(i + 1));
        i -= 1;
      }
    }
  }

  mergeBlock(block, offset) {
    var content = this.get("content");
    var elements = this.get("elements");
    for (var element of block.get("elements").models) {
      element.incrementOffsets(offset);
      elements.push(element);
    }
    this.set("content", content.substring(0, offset) +
                        block.get("content") +
                        content.substring(offset));
    var bucket = [];
    for (var i = 0; i < elements.length; i += 1) {
      var element = elements.at(i);
      if (element.get("start") > offset && element.get("end") < offset) {
        var clones = element.partialClones(offset, offset);
        clones[1].incrementOffsets(block.get("content").length);
        bucket.concat(clones);
        elements.remove(element);
        i -= 1;
      }
    }
    for (var element of bucket) {
      elements.push(element);
    }
    return this;
  }

  parseElement(target) {
    var elements = this.get("elements");
    var bucket = [];
    var shouldIterate = false;
    for (var i = 0; i < elements.length; i += 1) {
      var element = elements.at(i);
      if (element.completelyBounds(target)) {
        var clones = element.partialClones(target.get("start"),
                                           target.get("end"));
        bucket = bucket.concat(clones);
        elements.remove(element);
        shouldIterate = true;
        i -= 1;
      }
    }
    if (shouldIterate) {
      for (var element of bucket) {
        elements.push(element);
      }
    } else {
      elements.push(target);
    }
    this.mergeElements();
  }

  removeFragment(firstOffset, lastOffset) {
    var elements = this.get("elements");
    var content = this.get("content");
    this.set("content", content.substring(0, firstOffset) +
                        content.substring(lastOffset));
    for (var i = 0; i < elements.length; i += 1) {
      var element = elements.at(i);
      var startOffset = element.get("start");
      var endOffset = element.get("end");
      var length = lastOffset - firstOffset;
      if (startOffset >= firstOffset && endOffset <= lastOffset) {
        elements.remove(element);
        i -= 1;
      } else {
        if (startOffset >= firstOffset) {
          if (startOffset <= lastOffset) {
            element.set("start", firstOffset);
          } else {
            element.set("start", startOffset - length);
          }
        }
        if (endOffset > firstOffset) {
          if (endOffset <= lastOffset) {
            element.set("end", firstOffset);
          } else {
            element.set("end", endOffset - length);
          }
        }
      }
    }
  }

  toJSON() {
    var json = Backbone.Model.prototype.toJSON.call(this);
    json.source = "";
    return json;
  }

  toString() {
    return Formatter.stringifyBlock(this);
  }
}


module.exports = Block;
