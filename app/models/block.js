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
      local_last: false,
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

  destructiveClone(offset) {
    var content = this.get("content");
    var block = new Block({
      content: content.substring(offset),
      type: this.get("type"),
    });

    var bucket = [];
    var elements = this.get("elements");
    var otherElements = block.get("elements");

    for (var i = 0; i < elements.length; i += 1) {
      var element = elements.at(i);
      var startOffset = element.get("start");

      if (startOffset < offset && element.get("end") > offset) {
        var clones = element.partialClones(offset, offset);
        var clone = clones[1];

        elements.remove(element);
        bucket.push(clones[0]);

        clone.decrementOffsets(clone.get("start"));
        otherElements.push(clone);
        i -= 1;
      } else if (startOffset >= offset) {
        elements.remove(element);
        otherElements.push(element.decrementOffsets(offset));
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
    var quote = TypeConstants.block.quote;
    var bucket = [];

    bucket.push([TypeConstants.block.centered, this.get("centered")]);
    bucket.push([headingOne, type === headingOne]);
    bucket.push([headingTwo, type === headingTwo]);
    bucket.push([headingThree, type === headingThree]);
    bucket.push([quote, type === quote]);

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

    var otherContent = block.get("content");
    var otherElements = block.get("elements");

    for (var element of otherElements.models) {
      element.incrementOffsets(offset);
      elements.push(element);
    }

    this.set("content", content.substring(0, offset) +
                        otherContent +
                        content.substring(offset));

    var bucket = [];

    for (var i = 0; i < elements.length; i += 1) {
      var element = elements.at(i);

      if (element.get("start") > offset && element.get("end") < offset) {
        var clones = element.partialClones(offset, offset);

        clones[1].incrementOffsets(otherContent.length);
        bucket.concat(clones);
        elements.remove(element);
        i -= 1;
      }
    }

    for (var element of bucket) {
      elements.push(element);
    }
  }

  parseElement(target) {
    var elements = this.get("elements");
    var bucket = [];
    var complete = true;

    for (var i = 0; i < elements.length; i += 1) {
      var element = elements.at(i);

      if (element.completelyBounds(target)) {
        var clones = element.partialClones(target.get("start"),
                                           target.get("end"));
        bucket = bucket.concat(clones);
        elements.remove(element);
        complete = false;
        i -= 1;
      }
    }

    if (!complete) {
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
}


module.exports = Block;
