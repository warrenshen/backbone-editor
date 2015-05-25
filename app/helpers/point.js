class Point {

  constructor(sectionIndex=0, blockIndex=0, caretOffset=0, shouldFloor=false) {
    this._sectionIndex = sectionIndex;
    this._blockIndex = blockIndex;
    this._caretOffset = caretOffset;
    this._shouldFloor = shouldFloor;
  }

  get sectionIndex() {
    return this._sectionIndex;
  }

  get blockIndex() {
    return this._blockIndex;
  }

  get caretOffset() {
    return this._caretOffset;
  }

  get shouldFloor() {
    return this._shouldFloor;
  }

  set sectionIndex(sectionIndex) {
    this._sectionIndex = sectionIndex;
  }

  set blockIndex(blockIndex) {
    this._blockIndex = blockIndex;
  }

  set caretOffset(caretOffset) {
    this._caretOffset = caretOffset;
  }

  set shouldFloor(shouldFloor) {
    this._shouldFloor = shouldFloor;
  }

  compareDeeply(other) {
    var sectionDifference = this._sectionIndex - other.sectionIndex;
    if (sectionDifference === 0) {
      var blockDifference = this._blockIndex - other.blockIndex;
      if (blockDifference === 0) {
        return this._caretOffset - other.caretOffset;
      } else {
        return blockDifference;
      }
    } else {
      return sectionDifference;
    }
  }

  equalsDeeply(other) {
    return this.equalsShallowly(other) && this._caretOffset === other.getCaretOffset();
  }

  prefixesBlock() {
    return this._caretOffset === 0;
  }

  prefixesEverything() {
    return this._sectionIndex === 0 && this._blockIndex === 0;
  }
}


module.exports = Point;
