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
      is_local_last: false,
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
      {
        type: "HasOne",
        key: "section",
        relatedModel: ModelDirectory.get("Section"),
      }
    ];
  }

  // --------------------------------------------------
  // Conditions
  // --------------------------------------------------
  isEditable() {
    return this.get("type") !== TypeConstants.block.divider;
  }

  isLast() {
    return this.get("section").get("is_last") && this.get("is_local_last");
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

    bucket.push([TypeConstants.block.centered, this.get("is_centered")]);
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

  toCode() {
    var content = this.toString();
    console.log(content);
    if (content) {
      content = "\n" + content + "\n";
    }

    switch (this.get("type")) {
      case TypeConstants.block.headingOne:
        return "<h1 class=\"block block-heading-one\">" +
               content + "</h1>" + "\n";
      case TypeConstants.block.headingTwo:
        return "<h2 class=\"block block-heading-two\">" +
               content + "</h2>" + "\n";
      case TypeConstants.block.headingThree:
        return "<h3 class=\"block block-heading-three\">" +
               content + "</h3>" + "\n";
      case TypeConstants.block.quote:
        return "<blockquote class=\"block block-quote\">" +
               content + "</blockquote>" + "\n";
      case TypeConstants.block.standard:
        return "<p class=\"block block-paragraph\">" +
                content + "</p>" + "\n";
    }
  }

  toString() {
    // TODO: Move formatter methods into this model?
    return Formatter.formatBlock(this);
  }
}


module.exports = Block;
