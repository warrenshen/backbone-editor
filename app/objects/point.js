class Point {

  constructor(sectionIndex, blockIndex, charOffset) {
    this._sectionIndex = sectionIndex;
    this._blockIndex = blockIndex;
    this._charOffset = charOffset;
  }

  getSectionIndex() {
    return this._sectionIndex;
  }

  getBlockIndex() {
    return this._blockIndex;
  }

  getCharOffset() {
    return this._charOffset;
  }

  compareTo(other) {
    var sectionDifference = this._sectionIndex - other.getSectionIndex();
    if (sectionDifference === 0) {
      var blockDifference = this._blockIndex - other.getBlockIndex();
      if (blockDifference === 0) {
        return this.charOffset - other.getCharOffset();
      } else {
        return blockDifference;
      }
    } else {
      return sectionDifference;
    }
  }
}
