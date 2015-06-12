class Link {

  // --------------------------------------------------
  // Setup
  // --------------------------------------------------
  constructor(rectangle, content) {
    this._rectangle = rectangle;
    this._content = content;
  }

  // --------------------------------------------------
  // Getters
  // --------------------------------------------------
  get rectangle() {
    return this._rectangle;
  }

  get content() {
    return this._content;
  }
}


module.exports = Link;
