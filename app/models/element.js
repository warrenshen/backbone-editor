import Model from "app/templates/model";

import ModelDirectory from "app/directories/model_directory";

import TypeConstants from "app/constants/type_constants";


class Element extends Model {

  // --------------------------------------------------
  // Getters
  // --------------------------------------------------
  get defaults() {
    return {
      end: 0,
      link: "",
      start: 0,
      type: TypeConstants.element.bold,
    };
  }

  get name() {
    return "Element";
  }

  get relations() {
    return [];
  }

  // --------------------------------------------------
  // Methods
  // --------------------------------------------------
  completelyBounds(other) {
    return this.get("type") === other.get("type") &&
           this.get("start") <= other.get("start") &&
           this.get("end") >= other.get("end");
  }

  decrementOffsets(value) {
    this.set("start", this.get("start") - value);
    this.set("end", this.get("end") - value);
    return this;
  }

  incrementOffsets(value) {
    this.set("start", this.get("start") + value);
    this.set("end", this.get("end") + value);
    return this;
  }

  mergeElement(element) {
    if (this.get("type") === element.get("type") &&
        this.get("start") <= element.get("end") &&
        this.get("end") >= element.get("start")) {
      this.setOffsets(
        Math.min(this.get("start"), element.get("start")),
        Math.max(this.get("end"), element.get("end"))
      );
      return true;
    } else {
      return false;
    }
  }

  partialClones(firstOffset, lastOffset) {
    var clones = [];
    var startOffset = this.get("start");
    var endOffset = this.get("end");

    if (firstOffset > startOffset) {
      clones.push(new Element({
        end: firstOffset,
        start: startOffset,
        type: this.get("type"),
      }));
    }

    if (lastOffset < endOffset) {
      clones.push(new Element({
        end: endOffset,
        start: lastOffset,
        type: this.get("type"),
      }));
    }

    return clones;
  }

  setOffsets(startOffset, endOffset) {
    this.set("start", startOffset);
    this.set("end", endOffset);
    return this;
  }
}


module.exports = Element;
