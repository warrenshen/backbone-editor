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

  compareDeeply(otherPoint) {
    var sectionDifference = this._sectionIndex - otherPoint.sectionIndex;
    if (sectionDifference === 0) {
      var blockDifference = this._blockIndex - otherPoint.blockIndex;
      if (blockDifference === 0) {
        return this._caretOffset - otherPoint.caretOffset;
      } else {
        return blockDifference;
      }
    } else {
      return sectionDifference;
    }
  }

  equalsDeeply(otherPoint) {
    return this.equalsShallowly(otherPoint) &&
           this._caretOffset === otherPoint.getCaretOffset();
  }

  matchesIndices(sectionIndex, blockIndex) {
    return this._sectionIndex === sectionIndex &&
           this._blockIndex == blockIndex &&
           this.prefixesBlock();
  }

  prefixesBlock() {
    return this._caretOffset === 0;
  }

  prefixesEverything() {
    return this._sectionIndex === 0 && this._blockIndex === 0;
  }
}


module.exports = Point;
