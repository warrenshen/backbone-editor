class Point {

  constructor(sectionIndex=0, blockIndex=0, caretOffset=0) {
    this._sectionIndex = sectionIndex;
    this._blockIndex = blockIndex;
    this._caretOffset = caretOffset;
  }

  getSectionIndex() {
    return this._sectionIndex;
  }

  getBlockIndex() {
    return this._blockIndex;
  }

  getCaretOffset() {
    return this._caretOffset;
  }

  compareDeeply(other) {
    var sectionDifference = this._sectionIndex - other.getSectionIndex();
    if (sectionDifference === 0) {
      var blockDifference = this._blockIndex - other.getBlockIndex();
      if (blockDifference === 0) {
        return this._caretOffset - other.getCaretOffset();
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
    return this._sectionIndex === 0 && this._blockIndex === 0 && this._caretOffset === 0;
  }
}


module.exports = Point;
