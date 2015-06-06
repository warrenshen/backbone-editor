import Model from "app/templates/model";

import ModelDirectory from "app/directories/model_directory";

import TypeConstants from "app/constants/type_constants";


class Element extends Model {

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
    if (start < offset) {
      var clone = new Element({ type: this.get("type") });
      clone.setRange(start, offset);
      return clone;
    } else {
      return null;
    }
  }

  cloneSuffix(offset) {
    var end = this.get("end");
    if (end > offset) {
      var clone = new Element({ type: this.get("type") });
      clone.setRange(offset, end);
      return clone;
    } else {
      return null;
    }
  }

  coincidesWith(other) {
    return this.get("type") === other.get("type") &&
           this.get("start") <= other.get("end") &&
           this.get("end") >= other.get("start");
  }

  completelyBounds(other) {
    return this.get("type") === other.get("type") &&
           this.get("start") <= other.get("start") &&
           this.get("end") >= other.get("end");
  }

  setRange(start, end) {
    this.set("start", start);
    this.set("end", end);
  }
}


module.exports = Element;
