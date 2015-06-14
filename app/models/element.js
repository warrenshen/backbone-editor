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
  clonePrefix(offset) {
    var start = this.get("start");
    var clone = new Element({ type: this.get("type") });

    clone.setRange(start, offset);
    return (start < offset) ? clone : null;
  }

  cloneSuffix(offset) {
    var end = this.get("end");
    var clone = new Element({ type: this.get("type") });

    clone.setRange(offset, end);
    return (end > offset) ? clone : null;
  }

  completelyBounds(other) {
    return this.get("type") === other.get("type") &&
           this.get("start") <= other.get("start") &&
           this.get("end") >= other.get("end");
  }

  increment(value) {
    this.set("start", this.get("start") + value);
    this.set("end", this.get("end") + value);
  }

  mergeElement(element) {
    if (this.get("type") === element.get("type") &&
        this.get("start") <= element.get("end") &&
        this.get("end") >= element.get("start")) {
      this.setRange(
        Math.min(this.get("start"), element.get("start")),
        Math.max(this.get("end"), element.get("end"))
      );
      return true;
    } else {
      return false;
    }
  }

  setRange(start, end) {
    this.set("start", start);
    this.set("end", end);
  }
}


module.exports = Element;
