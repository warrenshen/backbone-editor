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
    var startOffset = this.get("start");
    if (startOffset < offset) {
      var clone = new Element({ type: this.get("type") });
      clone.setOffsets(startOffset, offset);
      return clone;
    } else {
      return null;
    }
  }

  cloneSuffix(offset) {
    var endOffset = this.get("offset");
    if (endOffset > offset) {
      var clone = new Element({ type: this.get("type") });
      clone.setOffset(offset, endOffset);
      return clone;
    } else {
      return null;
    }
  }

  completelyBounds(other) {
    return this.get("type") === other.get("type") &&
           this.get("start") <= other.get("start") &&
           this.get("end") >= other.get("end");
  }

  setOffsets(startOffset, endOffset) {
    this.set("start", startOffset);
    this.set("end", endOffset);
  }
}


module.exports = Element;
