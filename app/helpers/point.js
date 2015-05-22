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

  // findDifferenceWith?
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

  // sharesBlockWith?
  equalsShallowly(other) {
    var sectionDifference = this._sectionIndex - other.getSectionIndex();
    var blockDifference = this._blockIndex - other.getBlockIndex();
    if (sectionDifference === 0 && blockDifference === 0) {
      return true;
    } else {
      return false;
    }
  }

  equalsDeeply(other) {
    return this.equalsShallowly(other) && this._caretOffset === other.getCaretOffset();
  }
}


module.exports = Point;
