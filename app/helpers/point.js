class Point {

  constructor(sectionIndex, blockIndex, caretOffset) {
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

  compareTo(other) {
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
}


module.exports = Point;
