class Point {

  // --------------------------------------------------
  // Setup
  // --------------------------------------------------
  constructor(sectionIndex, blockIndex, caretOffset, shouldFloor=false) {
    this._sectionIndex = sectionIndex;
    this._blockIndex = blockIndex;
    this._caretOffset = caretOffset;
    this._shouldFloor = shouldFloor;
  }

  // --------------------------------------------------
  // Getters
  // --------------------------------------------------
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

  // --------------------------------------------------
  // Setters
  // --------------------------------------------------
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

  // --------------------------------------------------
  // Methods
  // --------------------------------------------------
  compareDeeply(otherPoint) {
    var sectionDifference = this._sectionIndex - otherPoint.sectionIndex;
    var blockDifference = this._blockIndex - otherPoint.blockIndex;
    var caretDifference = this._caretOffset - otherPoint.caretOffset;

    if (sectionDifference) {
      return sectionDifference;
    } else {
      return blockDifference ? blockDifference : caretDifference;
    }
  }

  matchesValues(sectionIndex, blockIndex, caretOffset=0) {
    return this._sectionIndex === sectionIndex &&
           this._blockIndex === blockIndex &&
           this._caretOffset === caretOffset;
  }
}


module.exports = Point;
