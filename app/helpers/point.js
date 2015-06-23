class Point {

  // --------------------------------------------------
  // Setup
  // --------------------------------------------------
  constructor(sectionIndex, blockIndex, caretOffset) {
    this._sectionIndex = sectionIndex;
    this._blockIndex = blockIndex;
    this._caretOffset = caretOffset;
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

  // --------------------------------------------------
  // Methods
  // --------------------------------------------------
  clone() {
    return new Point(
      this._sectionIndex,
      this._blockIndex,
      this._caretOffset
    );
  }

  compareDeeply(point) {
    var shallowDifference = this.compareShallowly(point);
    var caretDifference = this._caretOffset - point.caretOffset;
    return shallowDifference ? shallowDifference : caretDifference;
  }

  compareShallowly(point) {
    var sectionDifference = this._sectionIndex - point.sectionIndex;
    var blockDifference = this._blockIndex - point.blockIndex;
    return sectionDifference ? sectionDifference : blockDifference;
  }
}


module.exports = Point;
